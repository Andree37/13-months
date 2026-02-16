import { createSignal, onCleanup } from "solid-js";
import { toIFC, IFC_WEEKDAY_NAMES } from "../lib/calendar";

export default function Hero() {
    const [now, setNow] = createSignal(new Date());

    const interval = setInterval(() => setNow(new Date()), 1000);
    onCleanup(() => clearInterval(interval));

    const ifcDate = () => toIFC(now());

    const gregorianDay = () =>
        now().toLocaleDateString("en-US", { weekday: "long" });
    const gregorianMonthDay = () =>
        now().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const gregorianYear = () => now().getFullYear();

    const gregorianMonthLength = () => {
        const d = now();
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    };

    const timeString = () =>
        now().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

    return (
        <section
            aria-label="Today's date in the International Fixed Calendar"
            class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white px-4 transition-colors duration-500"
        >
            <div class="w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/3 p-4 sm:p-10 md:p-16 mb-8 sm:mb-10">
                <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-10 md:gap-14">
                    <div class="text-center">
                        <p class="text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 sm:mb-6">
                            Your calendar
                        </p>
                        <p class="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            {gregorianDay()}
                        </p>
                        <p class="text-base sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-600 dark:text-slate-300 mt-1 sm:mt-3">
                            {gregorianMonthDay()}
                        </p>
                        <p class="text-xs sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-2">
                            {gregorianYear()}
                        </p>
                        <p class="mt-2 sm:mt-6 text-[10px] sm:text-base text-slate-400 dark:text-slate-500">
                            <span class="tabular-nums font-semibold text-slate-600 dark:text-slate-300">
                                {gregorianMonthLength()}
                            </span>{" "}
                            days this month
                        </p>
                    </div>

                    <div class="flex flex-col items-center gap-2 self-stretch">
                        <div class="flex-1 w-px bg-linear-to-b from-transparent via-stone-300 dark:via-white/10 to-transparent" />
                        <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            vs
                        </span>
                        <div class="flex-1 w-px bg-linear-to-b from-transparent via-stone-300 dark:via-white/10 to-transparent" />
                    </div>

                    <div class="text-center">
                        <p class="text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2 sm:mb-6">
                            International Fixed Calendar
                        </p>
                        {ifcDate().isYearDay || ifcDate().isLeapDay ? (
                            <p class="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent leading-tight">
                                {ifcDate().isYearDay ? "Year Day" : "Leap Day"}
                            </p>
                        ) : (
                            <>
                                <p class="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                                    {IFC_WEEKDAY_NAMES[ifcDate().weekday!]}
                                </p>
                                <p class="text-base sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white mt-1 sm:mt-3">
                                    {ifcDate().monthName} {ifcDate().day}
                                </p>
                                <p class="text-xs sm:text-lg md:text-xl text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-2">
                                    {ifcDate().year}
                                </p>
                            </>
                        )}
                        <p class="mt-2 sm:mt-6 text-[10px] sm:text-base text-indigo-400 dark:text-indigo-400/70">
                            <span class="tabular-nums font-semibold text-indigo-500 dark:text-indigo-300">
                                28
                            </span>{" "}
                            days every month
                        </p>
                    </div>
                </div>
            </div>

            <p class="font-mono text-2xl sm:text-3xl text-slate-400 dark:text-slate-500 mb-8 sm:mb-10 tabular-nums">
                {timeString()}
            </p>

            <p class="max-w-xl text-center text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 sm:mb-12">
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

            <a
                href="#vote"
                class="mt-10 sm:mt-12 group inline-flex items-center gap-2.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5 px-5 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-300 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/10 hover:scale-105 animate-bounce [animation-duration:2s] [animation-iteration-count:3]"
            >
                Cast your vote — would you switch?
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
        </section>
    );
}
