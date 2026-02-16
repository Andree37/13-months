import { createSignal, For, onMount } from "solid-js";

interface FeedbackOption {
    emoji: string;
    label: string;
    color: string;
    hoverColor: string;
    bgColor: string;
    darkBgColor: string;
    borderColor: string;
    darkBorderColor: string;
    barColor: string;
}

const options: FeedbackOption[] = [
    {
        emoji: "😡",
        label: "Terrible",
        color: "text-red-500",
        hoverColor: "hover:bg-red-100 dark:hover:bg-red-500/15",
        bgColor: "bg-red-50",
        darkBgColor: "dark:bg-red-500/10",
        borderColor: "border-red-200",
        darkBorderColor: "dark:border-red-500/30",
        barColor: "bg-red-400 dark:bg-red-500",
    },
    {
        emoji: "😕",
        label: "Bad",
        color: "text-orange-500",
        hoverColor: "hover:bg-orange-100 dark:hover:bg-orange-500/15",
        bgColor: "bg-orange-50",
        darkBgColor: "dark:bg-orange-500/10",
        borderColor: "border-orange-200",
        darkBorderColor: "dark:border-orange-500/30",
        barColor: "bg-orange-400 dark:bg-orange-500",
    },
    {
        emoji: "😐",
        label: "Okay",
        color: "text-yellow-500",
        hoverColor: "hover:bg-yellow-100 dark:hover:bg-yellow-500/15",
        bgColor: "bg-yellow-50",
        darkBgColor: "dark:bg-yellow-500/10",
        borderColor: "border-yellow-200",
        darkBorderColor: "dark:border-yellow-500/30",
        barColor: "bg-yellow-400 dark:bg-yellow-500",
    },
    {
        emoji: "🙂",
        label: "Good",
        color: "text-lime-500",
        hoverColor: "hover:bg-lime-100 dark:hover:bg-lime-500/15",
        bgColor: "bg-lime-50",
        darkBgColor: "dark:bg-lime-500/10",
        borderColor: "border-lime-200",
        darkBorderColor: "dark:border-lime-500/30",
        barColor: "bg-lime-400 dark:bg-lime-500",
    },
    {
        emoji: "😃",
        label: "Love it!",
        color: "text-emerald-500",
        hoverColor: "hover:bg-emerald-100 dark:hover:bg-emerald-500/15",
        bgColor: "bg-emerald-50",
        darkBgColor: "dark:bg-emerald-500/10",
        borderColor: "border-emerald-200",
        darkBorderColor: "dark:border-emerald-500/30",
        barColor: "bg-emerald-400 dark:bg-emerald-500",
    },
];

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
                }
            }
        } catch {
            // If API is unreachable, votes stay at zero
        } finally {
            setLoading(false);
        }
    });

    const totalVotes = () => votes().reduce((a, b) => a + b, 0);
    const maxVotes = () => Math.max(...votes(), 1);

    async function handleVote(index: number) {
        if (submitting() || rateLimited()) return;

        // Optimistic update
        const previousVote = userVote();
        const optimistic = [...votes()];
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

        setJustVoted(true);
        setTimeout(() => setJustVoted(false), 2000);

        // Send to API — server tracks previousVote by IP, we only send the new index
        setSubmitting(true);
        try {
            const res = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index }),
            });

            if (res.status === 429) {
                const data = await res.json();
                setRateLimited(true);
                const resetIn = data.retryAfter ?? 60;
                setError(`Too many requests. Try again in ${resetIn}s.`);

                // Revert optimistic update
                setVotes(
                    previousVote !== null
                        ? (() => {
                              const reverted = [...optimistic];
                              reverted[index]--;
                              if (previousVote >= 0) reverted[previousVote]++;
                              return reverted;
                          })()
                        : (() => {
                              const reverted = [...optimistic];
                              reverted[index]--;
                              return reverted;
                          })(),
                );
                setUserVote(previousVote);

                setTimeout(() => {
                    setRateLimited(false);
                    setError(null);
                }, resetIn * 1000);
                return;
            }

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
                }
            }
        } catch {
            // Optimistic update stays — next page load will resync from server
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

            <div class="mx-auto max-w-2xl">
                <div class="text-center mb-12">
                    <h2
                        id="feedback-heading"
                        class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        What do you think?
                    </h2>
                    <p class="max-w-lg mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
                        Would you switch to a 13-month calendar? Tap a face to
                        let us know how you feel about consistent 28-day months!
                    </p>
                </div>

                <div class="rounded-2xl border border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 p-6 sm:p-8 transition-colors duration-500">
                    {/* Emoji buttons */}
                    <div
                        class="flex items-center justify-center gap-2 sm:gap-4 mb-8"
                        role="radiogroup"
                        aria-label="Rate the 13-month calendar idea"
                    >
                        <For each={options}>
                            {(option, i) => {
                                const isSelected = () => userVote() === i();
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected()}
                                        aria-label={`${option.label} — ${votes()[i()]} votes`}
                                        onClick={() => handleVote(i())}
                                        disabled={submitting() || rateLimited()}
                                        class={`group relative flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 sm:px-5 sm:py-4 transition-all duration-200 select-none ${
                                            submitting() || rateLimited()
                                                ? "opacity-60 cursor-not-allowed"
                                                : "cursor-pointer"
                                        } ${
                                            isSelected()
                                                ? `${option.borderColor} ${option.darkBorderColor} ${option.bgColor} ${option.darkBgColor} scale-110 shadow-lg`
                                                : `border-transparent ${submitting() || rateLimited() ? "" : option.hoverColor + " hover:scale-105"}`
                                        }`}
                                    >
                                        <span
                                            class={`text-3xl sm:text-4xl transition-transform duration-200 ${
                                                isSelected()
                                                    ? "scale-110"
                                                    : submitting() ||
                                                        rateLimited()
                                                      ? ""
                                                      : "group-hover:scale-110"
                                            }`}
                                            aria-hidden="true"
                                        >
                                            {option.emoji}
                                        </span>
                                        <span
                                            class={`text-[10px] sm:text-xs font-medium transition-colors ${
                                                isSelected()
                                                    ? option.color
                                                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                            }`}
                                        >
                                            {option.label}
                                        </span>
                                    </button>
                                );
                            }}
                        </For>
                    </div>

                    {/* Vote count bar chart */}
                    <div
                        class={`space-y-2.5 transition-opacity duration-300 ${loading() ? "opacity-40" : "opacity-100"}`}
                    >
                        <For each={options}>
                            {(option, i) => {
                                const count = () => votes()[i()];
                                const pct = () =>
                                    totalVotes() > 0
                                        ? Math.round(
                                              (count() / totalVotes()) * 100,
                                          )
                                        : 0;
                                const barWidth = () =>
                                    maxVotes() > 0
                                        ? (count() / maxVotes()) * 100
                                        : 0;
                                const isSelected = () => userVote() === i();

                                return (
                                    <div class="flex items-center gap-3">
                                        <span
                                            class="text-lg w-7 text-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            {option.emoji}
                                        </span>
                                        <div class="flex-1 h-6 rounded-full bg-stone-200/60 dark:bg-white/5 overflow-hidden relative">
                                            <div
                                                class={`h-full rounded-full transition-all duration-700 ease-out ${option.barColor} ${
                                                    isSelected()
                                                        ? "opacity-100"
                                                        : "opacity-70"
                                                }`}
                                                style={{
                                                    width: `${barWidth()}%`,
                                                }}
                                            />
                                            {count() > 0 && (
                                                <span
                                                    class={`absolute inset-y-0 flex items-center text-[10px] sm:text-xs font-semibold ${
                                                        barWidth() > 30
                                                            ? "right-2 text-white"
                                                            : "text-slate-500 dark:text-slate-400"
                                                    }`}
                                                    style={
                                                        barWidth() <= 30
                                                            ? {
                                                                  left: `calc(${barWidth()}% + 8px)`,
                                                              }
                                                            : undefined
                                                    }
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

                    {/* Total, status, and error messages */}
                    <div class="mt-6 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>
                            {loading() ? (
                                <span class="inline-flex items-center gap-1.5">
                                    <span class="inline-block w-3 h-3 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-indigo-500 animate-spin" />
                                    Loading votes…
                                </span>
                            ) : (
                                <>
                                    {totalVotes()} vote
                                    {totalVotes() !== 1 ? "s" : ""} total
                                </>
                            )}
                        </span>
                        {error() ? (
                            <span class="text-red-500 dark:text-red-400 font-medium">
                                {error()}
                            </span>
                        ) : (
                            <span
                                class={`transition-opacity duration-500 ${
                                    justVoted() ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                ✓ Thanks for your feedback!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
