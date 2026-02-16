import { createSignal, onCleanup } from "solid-js";
import {
    toIFC,
    formatIFC,
    formatGregorian,
    IFC_WEEKDAY_NAMES,
} from "../lib/calendar";

export default function Hero() {
    const [now, setNow] = createSignal(new Date());

    // Update every 60s — only the date matters, not the seconds
    const interval = setInterval(() => setNow(new Date()), 60_000);
    onCleanup(() => clearInterval(interval));

    const ifcDate = () => toIFC(now());
    const ifcFormatted = () => formatIFC(ifcDate());
    const gregorianFormatted = () => formatGregorian(now());

    return (
        <section
            aria-label="Today's date in the International Fixed Calendar"
            class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white px-4 transition-colors duration-500"
        >
            <div class="mb-8">
                <span class="inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 px-4 py-1.5 text-sm text-slate-500 dark:text-slate-300 backdrop-blur-sm">
                    <span class="relative flex h-2 w-2" aria-hidden="true">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    The International Fixed Calendar
                </span>
            </div>

            <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-center leading-none mb-6">
                {ifcDate().isYearDay || ifcDate().isLeapDay ? (
                    <span class="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                        {ifcFormatted()}
                    </span>
                ) : (
                    <>
                        <span class="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {IFC_WEEKDAY_NAMES[ifcDate().weekday!]}
                        </span>
                        <br />
                        <span class="text-slate-900 dark:text-white">
                            {ifcDate().monthName} {ifcDate().day}
                        </span>
                        <span class="text-slate-400 dark:text-slate-500">
                            , {ifcDate().year}
                        </span>
                    </>
                )}
            </h1>

            <p class="text-base sm:text-lg text-slate-400 dark:text-slate-500 mb-10 text-center">
                Today is{" "}
                <span class="text-slate-600 dark:text-slate-300">
                    {gregorianFormatted()}
                </span>
                . Same day, different system.
            </p>

            <p class="max-w-xl text-center text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12">
                <span class="text-slate-900 dark:text-white font-semibold">
                    13 equal months. 28 days each.
                </span>{" "}
                Every month starts on Sunday. Every month ends on Saturday.
                <br />
                <span class="text-slate-400 dark:text-slate-500">
                    The calendar that almost replaced the one you use today.
                </span>
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
                <a
                    href="#why"
                    class="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                    Why 13 months?
                    <svg
                        class="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width={2}
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </a>
                <a
                    href="#calendar"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-300 backdrop-blur-sm transition-all hover:bg-stone-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                >
                    View full calendar
                </a>
            </div>
        </section>
    );
}
