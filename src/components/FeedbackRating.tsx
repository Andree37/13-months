import { createSignal, For, Show, onMount } from "solid-js";

interface FeedbackOption {
    label: string;
    faceColor: string;
    darkerColor: string;
    face: "very-happy" | "happy" | "unhappy" | "very-unhappy";
}

const options: FeedbackOption[] = [
    {
        label: "Love it!",
        faceColor: "#00875A",
        darkerColor: "#006644",
        face: "very-happy",
    },
    {
        label: "Good",
        faceColor: "#7AB648",
        darkerColor: "#5C9030",
        face: "happy",
    },
    {
        label: "Meh",
        faceColor: "#E8734A",
        darkerColor: "#C25530",
        face: "unhappy",
    },
    {
        label: "Hate it",
        faceColor: "#D4322C",
        darkerColor: "#A82420",
        face: "very-unhappy",
    },
];

function SmileyFace(props: {
    face: FeedbackOption["face"];
    color: string;
    darkerColor: string;
    pressed: boolean;
}) {
    // All coordinates in a 100x100 viewBox for simplicity
    const V = 100;
    const mid = V / 2; // 50
    const r = 42; // face circle radius
    const shadowOffset = 3; // how far down the 3D shadow sits
    const pressedShift = 1.5; // how far the face sinks when pressed

    // Eyes — positioned relative to face center (50,50)
    const eyeSpread = 14; // horizontal distance from center
    const eyeY = -7; // offset above face center
    const eyeR = 5.5;

    // Pressed state shifts the face+features down
    const dy = props.pressed ? pressedShift : 0;

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${V} ${V}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 3D base shadow — darker circle beneath */}
            <circle
                cx={mid}
                cy={mid + shadowOffset}
                r={r}
                fill={props.darkerColor}
            />

            {/* Main face circle + all features as a group, shifted when pressed */}
            <g transform={`translate(0, ${dy})`}>
                {/* Face */}
                <circle cx={mid} cy={mid} r={r} fill={props.color} />

                {/* Glossy highlight */}
                <ellipse
                    cx={mid - r * 0.12}
                    cy={mid - r * 0.28}
                    rx={r * 0.48}
                    ry={r * 0.28}
                    fill="white"
                    opacity="0.15"
                />

                {/* Eyes — always white dots */}
                <circle
                    cx={mid - eyeSpread}
                    cy={mid + eyeY}
                    r={eyeR}
                    fill="white"
                />
                <circle
                    cx={mid + eyeSpread}
                    cy={mid + eyeY}
                    r={eyeR}
                    fill="white"
                />

                {/* Angry eyebrows (very-unhappy only) */}
                {props.face === "very-unhappy" && (
                    <>
                        <line
                            x1={mid - eyeSpread - eyeR * 1.4}
                            y1={mid + eyeY - eyeR * 2.3}
                            x2={mid - eyeSpread + eyeR * 1.1}
                            y2={mid + eyeY - eyeR * 1.4}
                            stroke="white"
                            stroke-width="2.4"
                            stroke-linecap="round"
                        />
                        <line
                            x1={mid + eyeSpread + eyeR * 1.4}
                            y1={mid + eyeY - eyeR * 2.3}
                            x2={mid + eyeSpread - eyeR * 1.1}
                            y2={mid + eyeY - eyeR * 1.4}
                            stroke="white"
                            stroke-width="2.4"
                            stroke-linecap="round"
                        />
                    </>
                )}

                {/* Mouth */}
                {props.face === "very-happy" && (
                    <path
                        d={`M ${mid - 20} ${mid + 5} Q ${mid} ${mid + 32}, ${mid + 20} ${mid + 5}`}
                        stroke="white"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        fill="none"
                    />
                )}
                {props.face === "happy" && (
                    <path
                        d={`M ${mid - 15} ${mid + 8} Q ${mid} ${mid + 24}, ${mid + 15} ${mid + 8}`}
                        stroke="white"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        fill="none"
                    />
                )}
                {props.face === "unhappy" && (
                    <path
                        d={`M ${mid - 13} ${mid + 18} Q ${mid} ${mid + 9}, ${mid + 13} ${mid + 18}`}
                        stroke="white"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        fill="none"
                    />
                )}
                {props.face === "very-unhappy" && (
                    <path
                        d={`M ${mid - 17} ${mid + 24} Q ${mid} ${mid + 9}, ${mid + 17} ${mid + 24}`}
                        stroke="white"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        fill="none"
                    />
                )}
            </g>
        </svg>
    );
}

export default function FeedbackRating() {
    const [votes, setVotes] = createSignal<number[]>(
        new Array(options.length).fill(0),
    );
    const [userVote, setUserVote] = createSignal<number | null>(null);
    const [justVoted, setJustVoted] = createSignal(false);
    const [loading, setLoading] = createSignal(true);
    const [submitting, setSubmitting] = createSignal(false);
    const [rateLimited, setRateLimited] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [pressedIndex, setPressedIndex] = createSignal<number | null>(null);
    const [showResults, setShowResults] = createSignal(false);

    onMount(async () => {
        try {
            const res = await fetch("/api/votes");
            if (res.ok) {
                const data = await res.json();
                if (
                    Array.isArray(data.votes) &&
                    data.votes.length === options.length
                ) {
                    setVotes(data.votes);
                }
                if (typeof data.userVote === "number") {
                    setUserVote(data.userVote);
                    setShowResults(true);
                }
            }
        } catch {
            // API unreachable — votes stay at zero until next load
        } finally {
            setLoading(false);
        }
    });

    const totalVotes = () => votes().reduce((a, b) => a + b, 0);
    const maxVotes = () => Math.max(...votes(), 1);
    const disabled = () => submitting() || rateLimited();

    function revertOptimistic(
        optimistic: number[],
        index: number,
        previousVote: number | null,
    ) {
        const reverted = [...optimistic];
        reverted[index]--;
        if (previousVote !== null && previousVote >= 0) {
            reverted[previousVote]++;
        }
        setVotes(reverted);
        setUserVote(previousVote);
    }

    async function handleVote(index: number) {
        if (disabled()) return;

        const previousVote = userVote();
        const snapshot = [...votes()];
        const optimistic = [...snapshot];
        if (
            previousVote !== null &&
            previousVote >= 0 &&
            optimistic[previousVote] > 0
        ) {
            optimistic[previousVote]--;
        }
        optimistic[index]++;
        setVotes(optimistic);
        setUserVote(index);
        setError(null);
        setShowResults(true);

        setJustVoted(true);
        setTimeout(() => setJustVoted(false), 2500);

        setSubmitting(true);
        try {
            const res = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index }),
            });

            if (res.status === 429) {
                const data = await res.json();
                const resetIn = data.retryAfter ?? 60;
                setRateLimited(true);
                setError(`Too many requests. Try again in ${resetIn}s.`);
                revertOptimistic(optimistic, index, previousVote);
                setTimeout(() => {
                    setRateLimited(false);
                    setError(null);
                }, resetIn * 1000);
                return;
            }

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.votes)) {
                    if (data.votes.length === options.length) {
                        setVotes(data.votes);
                    }
                }
                if (typeof data.userVote === "number") {
                    setUserVote(data.userVote);
                }
            }
        } catch {
            // Optimistic update stays — next page load will resync
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section
            id="vote"
            aria-labelledby="feedback-heading"
            class="relative bg-stone-50 dark:bg-slate-900 py-24 sm:py-32 px-4 transition-colors duration-500"
        >
            <div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/50 dark:via-indigo-500/50 to-transparent" />

            <div class="mx-auto flex flex-col items-center">
                {/* The physical device */}
                <div
                    class="relative select-none"
                    style={{
                        width: "min(480px, 92vw)",
                    }}
                >
                    {/* Outer device shell — the white rounded panel */}
                    <div
                        style={{
                            background:
                                "linear-gradient(180deg, #ffffff 0%, #f5f5f0 100%)",
                            "border-radius": "2.2rem",
                            padding: "2.5rem 1.5rem 2rem",
                            "box-shadow":
                                "0 2px 0 0 #e0ddd5, 0 4px 0 0 #d4d0c8, 0 8px 24px rgba(0,0,0,0.15), 0 20px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Subtle top edge highlight */}
                        <div
                            style={{
                                position: "absolute",
                                top: "0",
                                left: "10%",
                                right: "10%",
                                height: "2px",
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                                "border-radius": "0 0 100% 100%",
                            }}
                        />

                        {/* Title */}
                        <h2
                            id="feedback-heading"
                            class="text-center mb-1"
                            style={{
                                "font-family":
                                    "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                "font-size": "clamp(0.95rem, 3.2vw, 1.15rem)",
                                "font-weight": "600",
                                color: "#2c2c2c",
                                "letter-spacing": "0.01em",
                                "line-height": "1.4",
                            }}
                        >
                            What Do You Think Of This Idea?
                        </h2>

                        <p
                            class="text-center"
                            style={{
                                "font-family":
                                    "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                "font-size": "clamp(0.7rem, 2.2vw, 0.78rem)",
                                color: "#888",
                                "margin-bottom": "2rem",
                                "letter-spacing": "0.01em",
                            }}
                        >
                            Would you switch to a 13-month calendar?
                        </p>

                        {/* Smiley buttons row */}
                        <div
                            class="flex items-end justify-center"
                            role="radiogroup"
                            aria-label="Rate the 13-month calendar idea"
                            style={{ gap: "clamp(0.7rem, 3.5vw, 1.6rem)" }}
                        >
                            <For each={options}>
                                {(option, i) => {
                                    const isSelected = () => userVote() === i();
                                    const isPressed = () =>
                                        pressedIndex() === i();

                                    return (
                                        <div
                                            class="flex flex-col items-center"
                                            style={{ gap: "0.45rem" }}
                                        >
                                            {/* The physical button well/recess */}
                                            <button
                                                type="button"
                                                role="radio"
                                                aria-checked={isSelected()}
                                                aria-label={`${option.label} — ${votes()[i()]} votes`}
                                                onClick={() => handleVote(i())}
                                                onMouseDown={() =>
                                                    setPressedIndex(i())
                                                }
                                                onMouseUp={() =>
                                                    setPressedIndex(null)
                                                }
                                                onMouseLeave={() =>
                                                    setPressedIndex(null)
                                                }
                                                onTouchStart={() =>
                                                    setPressedIndex(i())
                                                }
                                                onTouchEnd={() =>
                                                    setPressedIndex(null)
                                                }
                                                disabled={disabled()}
                                                class="relative outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                                                style={{
                                                    width: "clamp(60px, 17vw, 88px)",
                                                    height: "clamp(60px, 17vw, 88px)",
                                                    "border-radius": "50%",
                                                    background: isPressed()
                                                        ? "radial-gradient(circle, #e8e6e0 0%, #d8d5cc 100%)"
                                                        : "radial-gradient(circle, #eae8e2 0%, #e0ddd5 100%)",
                                                    "box-shadow": isPressed()
                                                        ? "inset 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(0,0,0,0.1)"
                                                        : "inset 0 2px 4px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.6)",
                                                    cursor: disabled()
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    opacity: disabled()
                                                        ? 0.6
                                                        : 1,
                                                    display: "flex",
                                                    "align-items": "center",
                                                    "justify-content": "center",
                                                    padding: "0",
                                                    border: "none",
                                                    transition:
                                                        "box-shadow 0.1s ease, background 0.1s ease",
                                                    transform:
                                                        isSelected() &&
                                                        !isPressed()
                                                            ? "scale(1.06)"
                                                            : "scale(1)",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "82%",
                                                        height: "82%",
                                                    }}
                                                >
                                                    <SmileyFace
                                                        face={option.face}
                                                        color={option.faceColor}
                                                        darkerColor={
                                                            option.darkerColor
                                                        }
                                                        pressed={isPressed()}
                                                    />
                                                </div>
                                            </button>

                                            {/* Selection indicator dot */}
                                            <div
                                                style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    "border-radius": "50%",
                                                    "background-color":
                                                        isSelected()
                                                            ? option.faceColor
                                                            : "transparent",
                                                    transition:
                                                        "background-color 0.2s ease, transform 0.2s ease",
                                                    transform: isSelected()
                                                        ? "scale(1)"
                                                        : "scale(0)",
                                                }}
                                            />
                                        </div>
                                    );
                                }}
                            </For>
                        </div>

                        {/* Thank you message — appears right on the device */}
                        <div
                            class="text-center"
                            style={{
                                "margin-top": "1.2rem",
                                height: "1.4rem",
                                overflow: "hidden",
                            }}
                        >
                            {error() ? (
                                <span
                                    style={{
                                        "font-size": "0.7rem",
                                        color: "#D4322C",
                                        "font-weight": "500",
                                        "font-family":
                                            "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                    }}
                                >
                                    {error()}
                                </span>
                            ) : (
                                <span
                                    style={{
                                        "font-size": "0.72rem",
                                        color: "#00875A",
                                        "font-weight": "500",
                                        "font-family":
                                            "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                        opacity: justVoted() ? 1 : 0,
                                        transition: "opacity 0.4s ease",
                                    }}
                                >
                                    ✓ Thanks for your feedback!
                                </span>
                            )}
                        </div>

                        {/* Bottom branding area — like HappyOrNot logo */}
                        <div
                            class="flex items-center justify-center"
                            style={{
                                "margin-top": "0.6rem",
                                gap: "0.35rem",
                            }}
                        >
                            <span
                                style={{
                                    "font-size": "0.6rem",
                                    "font-weight": "700",
                                    "letter-spacing": "0.08em",
                                    "text-transform": "uppercase",
                                    color: "#bbb",
                                    "font-family":
                                        "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                }}
                            >
                                13
                            </span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                            >
                                <circle cx="6" cy="6" r="5.5" fill="#bbb" />
                                <circle cx="4.5" cy="5" r="0.7" fill="white" />
                                <circle cx="7.5" cy="5" r="0.7" fill="white" />
                                <path
                                    d="M 4.2 7.2 Q 6 9, 7.8 7.2"
                                    stroke="white"
                                    stroke-width="0.6"
                                    stroke-linecap="round"
                                    fill="none"
                                />
                            </svg>
                            <span
                                style={{
                                    "font-size": "0.6rem",
                                    "font-weight": "700",
                                    "letter-spacing": "0.08em",
                                    "text-transform": "uppercase",
                                    color: "#bbb",
                                    "font-family":
                                        "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
                                }}
                            >
                                Months
                            </span>
                        </div>
                    </div>

                    {/* Bottom edge shadow to ground the device */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "15%",
                            right: "15%",
                            height: "16px",
                            background:
                                "radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)",
                            "pointer-events": "none",
                        }}
                    />
                </div>

                {/* Results — shown below the device after voting */}
                <Show when={showResults() && !loading()}>
                    <div
                        class="w-full transition-all duration-500"
                        style={{
                            "max-width": "min(480px, 92vw)",
                            "margin-top": "1.5rem",
                            opacity: showResults() ? 1 : 0,
                            transform: showResults()
                                ? "translateY(0)"
                                : "translateY(-10px)",
                        }}
                    >
                        <div
                            class="rounded-2xl border border-stone-200 dark:border-white/5 bg-white/80 dark:bg-white/3 backdrop-blur-sm p-5 sm:p-6"
                            style={{
                                "box-shadow": "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                        >
                            <p
                                class="text-xs font-medium text-slate-400 dark:text-slate-500 mb-3"
                                style={{
                                    "letter-spacing": "0.04em",
                                    "text-transform": "uppercase",
                                    "font-size": "0.65rem",
                                }}
                            >
                                Results
                                <span
                                    class="normal-case ml-1.5"
                                    style={{
                                        "letter-spacing": "0",
                                        "text-transform": "none",
                                    }}
                                >
                                    — {totalVotes()} vote
                                    {totalVotes() !== 1 ? "s" : ""}
                                </span>
                            </p>
                            <div class="space-y-2">
                                <For each={options}>
                                    {(option, i) => {
                                        const count = () => votes()[i()];
                                        const pct = () =>
                                            totalVotes() > 0
                                                ? Math.round(
                                                      (count() / totalVotes()) *
                                                          100,
                                                  )
                                                : 0;
                                        const barWidth = () =>
                                            maxVotes() > 0
                                                ? (count() / maxVotes()) * 100
                                                : 0;
                                        const isSelected = () =>
                                            userVote() === i();

                                        return (
                                            <div class="flex items-center gap-2.5">
                                                <div
                                                    class="shrink-0"
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                    }}
                                                >
                                                    <SmileyFace
                                                        face={option.face}
                                                        color={option.faceColor}
                                                        darkerColor={
                                                            option.darkerColor
                                                        }
                                                        pressed={false}
                                                    />
                                                </div>
                                                <div class="flex-1 h-4.5 rounded-full bg-stone-100 dark:bg-white/5 overflow-hidden relative">
                                                    <div
                                                        class="h-full rounded-full transition-all duration-700 ease-out"
                                                        style={{
                                                            width: `${barWidth()}%`,
                                                            "background-color":
                                                                option.faceColor,
                                                            opacity:
                                                                isSelected()
                                                                    ? 1
                                                                    : 0.55,
                                                        }}
                                                    />
                                                    {count() > 0 && (
                                                        <span
                                                            class="absolute inset-y-0 flex items-center font-semibold"
                                                            style={{
                                                                "font-size":
                                                                    "0.6rem",
                                                                ...(barWidth() >
                                                                35
                                                                    ? {
                                                                          right: "8px",
                                                                          color: "white",
                                                                      }
                                                                    : {
                                                                          left: `calc(${barWidth()}% + 6px)`,
                                                                          color: "#94a3b8",
                                                                      }),
                                                            }}
                                                        >
                                                            {count()} ({pct()}%)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </div>
                </Show>

                {/* Loading indicator */}
                <Show when={loading()}>
                    <div
                        class="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500"
                        style={{
                            "margin-top": "1.5rem",
                            "font-size": "0.75rem",
                        }}
                    >
                        <span
                            class="inline-block rounded-full border-2 border-slate-300 dark:border-slate-600 animate-spin"
                            style={{
                                width: "14px",
                                height: "14px",
                                "border-top-color": "#6366f1",
                            }}
                        />
                        Loading votes…
                    </div>
                </Show>
            </div>
        </section>
    );
}
