import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";

const VOTES_KEY = "13months:votes";
const VOTER_PREFIX = "13months:voter:";
const RATE_LIMIT_PREFIX = "13months:rl:";
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const NUM_OPTIONS = 4;
const OLD_NUM_OPTIONS = 5;

function getRedis() {
    return new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
    });
}

function getClientIP(req: VercelRequest): string {
    // x-forwarded-for can be a comma-separated list; first entry is the real client
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
        return forwarded.split(",")[0].trim();
    }
    if (Array.isArray(forwarded)) {
        return forwarded[0].split(",")[0].trim();
    }
    return req.socket?.remoteAddress ?? "unknown";
}

async function checkRateLimit(
    redis: Redis,
    ip: string,
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const key = `${RATE_LIMIT_PREFIX}${ip}`;
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }

    const ttl = await redis.ttl(key);

    return {
        allowed: count <= RATE_LIMIT_MAX,
        remaining: Math.max(0, RATE_LIMIT_MAX - count),
        resetIn: ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS,
    };
}

async function getVotes(redis: Redis): Promise<number[]> {
    const votes = await redis.get<number[]>(VOTES_KEY);
    if (Array.isArray(votes)) {
        if (votes.length === NUM_OPTIONS) {
            return votes;
        }
        // Migrate from old 5-option format to new 4-option format
        // Old order: Terrible(0), Bad(1), Okay(2), Good(3), Love it(4)
        // New order: Love it(0), Good(1), Meh(2), Hate it(3)
        if (votes.length === OLD_NUM_OPTIONS) {
            const migrated = [
                votes[4] ?? 0, // Love it
                votes[3] ?? 0, // Good
                (votes[1] ?? 0) + (votes[2] ?? 0), // Bad + Okay -> Meh
                votes[0] ?? 0, // Terrible -> Hate it
            ];
            // Persist the migrated votes
            await redis.set(VOTES_KEY, migrated);
            return migrated;
        }
    }
    return new Array(NUM_OPTIONS).fill(0);
}

// Remap a user's old vote index (0-4) to the new index (0-3)
function migrateUserVote(oldIndex: number): number {
    // Old: Terrible(0), Bad(1), Okay(2), Good(3), Love it(4)
    // New: Love it(0), Good(1), Meh(2), Hate it(3)
    const mapping: Record<number, number> = { 0: 3, 1: 2, 2: 2, 3: 1, 4: 0 };
    return mapping[oldIndex] ?? 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const redis = getRedis();
    const ip = getClientIP(req);

    // ── Rate limit ──────────────────────────────────────────────
    const rateLimit = await checkRateLimit(redis, ip);

    res.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
    res.setHeader("X-RateLimit-Remaining", String(rateLimit.remaining));
    res.setHeader("X-RateLimit-Reset", String(rateLimit.resetIn));

    if (!rateLimit.allowed) {
        return res.status(429).json({
            error: "Too many requests. Slow down.",
            retryAfter: rateLimit.resetIn,
        });
    }

    // ── GET ─────────────────────────────────────────────────────
    if (req.method === "GET") {
        try {
            const [votes, rawUserVote] = await Promise.all([
                getVotes(redis),
                redis.get<number>(`${VOTER_PREFIX}${ip}`),
            ]);

            let userVote: number | null = null;
            if (typeof rawUserVote === "number") {
                if (rawUserVote >= NUM_OPTIONS) {
                    // Old format vote — migrate it
                    userVote = migrateUserVote(rawUserVote);
                    await redis.set(`${VOTER_PREFIX}${ip}`, userVote);
                } else {
                    userVote = rawUserVote;
                }
            }

            return res.status(200).json({ votes, userVote });
        } catch (err) {
            console.error("Failed to fetch votes:", err);
            return res.status(500).json({ error: "Failed to fetch votes" });
        }
    }

    // ── POST ────────────────────────────────────────────────────
    if (req.method === "POST") {
        try {
            const { index } = req.body as { index: unknown };

            if (
                typeof index !== "number" ||
                !Number.isInteger(index) ||
                index < 0 ||
                index >= NUM_OPTIONS
            ) {
                return res.status(400).json({ error: "Invalid vote index" });
            }

            const voterKey = `${VOTER_PREFIX}${ip}`;
            const previousVote = await redis.get<number>(voterKey);

            if (typeof previousVote === "number" && previousVote === index) {
                const votes = await getVotes(redis);
                return res.status(200).json({ votes, userVote: index });
            }

            const votes = await getVotes(redis);

            if (
                typeof previousVote === "number" &&
                previousVote >= 0 &&
                previousVote < NUM_OPTIONS
            ) {
                votes[previousVote] = Math.max(0, votes[previousVote] - 1);
            }

            votes[index]++;

            const pipeline = redis.pipeline();
            pipeline.set(VOTES_KEY, votes);
            pipeline.set(voterKey, index);
            await pipeline.exec();

            return res.status(200).json({ votes, userVote: index });
        } catch (err) {
            console.error("Failed to submit vote:", err);
            return res.status(500).json({ error: "Failed to submit vote" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
