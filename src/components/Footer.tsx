import { createSignal } from "solid-js";

export default function Footer() {
    const [shareStatus, setShareStatus] = createSignal<
        "idle" | "copied" | "error"
    >("idle");

    async function handleShare() {
        const shareData = {
            title: "13 Months — A Better Calendar",
            text: "What if we used 13 equal months of 28 days? Explore the International Fixed Calendar — the rational calendar that Kodak used for 61 years.",
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus("copied");
                setTimeout(() => setShareStatus("idle"), 2500);
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === "AbortError")
                return;

            try {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus("copied");
                setTimeout(() => setShareStatus("idle"), 2500);
            } catch {
                setShareStatus("error");
                setTimeout(() => setShareStatus("idle"), 2500);
            }
        }
    }

    const shareLabel = () => {
        switch (shareStatus()) {
            case "copied":
                return "Link copied!";
            case "error":
                return "Couldn't share";
            default:
                return "Share this";
        }
    };

    return (
        <footer
            role="contentinfo"
            aria-label="Site footer"
            class="relative bg-stone-50 dark:bg-slate-950 border-t border-stone-200 dark:border-white/5 py-16 px-4 transition-colors duration-500"
        >
            <div class="mx-auto max-w-6xl">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        The calendar is just a convention
                    </h2>
                    <p class="max-w-xl mx-auto text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                        We changed it before. We can change it again. 13 equal
                        months isn't radical — it's overdue.
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={handleShare}
                            aria-label={shareLabel()}
                            class={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all ${
                                shareStatus() === "copied"
                                    ? "bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25"
                                    : shareStatus() === "error"
                                      ? "bg-red-600 hover:bg-red-500"
                                      : "bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
                            }`}
                        >
                            {shareLabel()}
                            {shareStatus() === "idle" ? (
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width={2}
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                                    />
                                </svg>
                            ) : shareStatus() === "copied" ? (
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width={2}
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            ) : null}
                        </button>
                        <a
                            href="https://en.wikipedia.org/wiki/International_Fixed_Calendar"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Read about the International Fixed Calendar on Wikipedia (opens in new tab)"
                            class="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 backdrop-blur-sm transition-all hover:bg-stone-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                        >
                            Read on Wikipedia
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width={2}
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <div
                    class="h-px bg-linear-to-r from-transparent via-stone-300 dark:via-white/10 to-transparent mb-10"
                    aria-hidden="true"
                />

                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 dark:text-slate-500">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-slate-700 dark:text-slate-300">
                            13 Months
                        </span>
                        <span
                            class="text-slate-300 dark:text-slate-600"
                            aria-hidden="true"
                        >
                            ·
                        </span>
                        <span>A better calendar for everyone</span>
                    </div>

                    <nav
                        aria-label="Footer links"
                        class="flex items-center gap-6"
                    >
                        <a
                            href="https://en.wikipedia.org/wiki/International_Fixed_Calendar"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Wikipedia article on the International Fixed Calendar (opens in new tab)"
                            class="transition-colors hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            Wikipedia
                        </a>
                        <a
                            href="https://github.com/Andree37/13-months"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View source code on GitHub (opens in new tab)"
                            class="transition-colors hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5"
                        >
                            <svg
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Source
                        </a>
                    </nav>
                </div>

                <p class="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
                    Based on the International Fixed Calendar (1902). Not
                    affiliated with any standards body.
                </p>
            </div>
        </footer>
    );
}
