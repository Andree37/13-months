import { createSignal, onCleanup } from "solid-js";
import {
    toIFC,
    formatIFC,
    formatGregorian,
    IFC_WEEKDAY_NAMES,
} from "../lib/calendar";

export default function Hero() {
    const [now, setNow] = createSignal(new Date());

    const interval = setInterval(() => setNow(new Date()), 1000);
    onCleanup(() => clearInterval(interval));

    const ifcDate = () => toIFC(now());
    const ifcFormatted = () => formatIFC(ifcDate());
    const gregorianFormatted = () => formatGregorian(now());

    const timeString = () =>
        now().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

    return (
        <section class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white px-4 transition-colors duration-500">
            <div class="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div class="relative z-10 mb-8">
                <span class="inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 px-4 py-1.5 text-sm text-slate-500 dark:text-slate-300 backdrop-blur-sm">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live — Right now
                </span>
            </div>

            <p class="relative z-10 text-sm text-slate-400 dark:text-slate-400 mb-2 tracking-wide uppercase">
                Gregorian: {gregorianFormatted()}
            </p>

            <h1 class="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-center leading-none mb-4">
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

            <p class="relative z-10 font-mono text-2xl sm:text-3xl text-slate-400 dark:text-slate-500 mb-10 tabular-nums">
                {timeString()}
            </p>

            <p class="relative z-10 max-w-xl text-center text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12">
                Today's date, if we used the{" "}
                <span class="text-slate-900 dark:text-white font-semibold">
                    13-month calendar
                </span>
                .
                <br />
                <span class="text-slate-400 dark:text-slate-500">
                    13 equal months. 28 days each. Every month identical.
                </span>
            </p>

            <div class="relative z-10 flex flex-col sm:flex-row gap-4">
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

            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
                <span class="text-xs uppercase tracking-widest">Scroll</span>
                <div class="w-px h-8 bg-linear-to-b from-slate-400 dark:from-slate-600 to-transparent" />
            </div>
        </section>
    );
}
