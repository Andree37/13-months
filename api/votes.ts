import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";

const VOTES_KEY = "13months:votes";
const VOTER_PREFIX = "13months:voter:";
const RATE_LIMIT_PREFIX = "13months:rl:";
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const NUM_OPTIONS = 5;

function getRedis() {
    return new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
    });
}

function getClientIP(req: VercelRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
        // x-forwarded-for can be a comma-separated list; first one is the real client
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

    // Set expiry only on first request in the window
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
    if (Array.isArray(votes) && votes.length === NUM_OPTIONS) {
        return votes;
    }
    return new Array(NUM_OPTIONS).fill(0);
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

    // ── GET: fetch votes + caller's current vote ────────────────
    if (req.method === "GET") {
        try {
            const [votes, userVote] = await Promise.all([
                getVotes(redis),
                redis.get<number>(`${VOTER_PREFIX}${ip}`),
            ]);

            return res.status(200).json({
                votes,
                userVote: typeof userVote === "number" ? userVote : null,
            });
        } catch (err) {
            console.error("Failed to fetch votes:", err);
            return res.status(500).json({ error: "Failed to fetch votes" });
        }
    }

    // ── POST: submit or change a vote ───────────────────────────
    if (req.method === "POST") {
        try {
            const { index } = req.body as { index: unknown };

            // Validate
            if (
                typeof index !== "number" ||
                !Number.isInteger(index) ||
                index < 0 ||
                index >= NUM_OPTIONS
            ) {
                return res.status(400).json({ error: "Invalid vote index" });
            }

            const voterKey = `${VOTER_PREFIX}${ip}`;

            // Look up what this IP previously voted for — server is the source of truth
            const previousVote = await redis.get<number>(voterKey);

            // If they're voting for the same thing, no-op
            if (typeof previousVote === "number" && previousVote === index) {
                const votes = await getVotes(redis);
                return res.status(200).json({ votes, userVote: index });
            }

            // Get current tallies
            const votes = await getVotes(redis);

            // Remove previous vote if it exists
            if (
                typeof previousVote === "number" &&
                previousVote >= 0 &&
                previousVote < NUM_OPTIONS
            ) {
                votes[previousVote] = Math.max(0, votes[previousVote] - 1);
            }

            // Add new vote
            votes[index]++;

            // Persist both atomically via pipeline
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
