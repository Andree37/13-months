import { createSignal, For, Show } from "solid-js";
import {
    generateFullYear,
    toIFC,
    IFC_WEEKDAY_SHORT,
    isLeapYear,
} from "../lib/calendar";

export default function CalendarView() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = createSignal(currentYear);

    const calendar = () => generateFullYear(year());
    const todayIFC = () => toIFC(new Date());

    const isToday = (monthNumber: number, day: number) => {
        const t = todayIFC();
        return (
            t.year === year() &&
            t.month === monthNumber &&
            t.day === day &&
            !t.isYearDay &&
            !t.isLeapDay
        );
    };

    return (
        <section
            id="calendar"
            aria-labelledby="calendar-heading"
            class="relative bg-stone-50 dark:bg-slate-950 py-16 sm:py-24 md:py-32 px-4 transition-colors duration-500"
        >
            <div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-400/50 dark:via-violet-500/50 to-transparent" />

            <div class="mx-auto max-w-7xl">
                <div class="text-center mb-8 sm:mb-12">
                    <p class="text-xs sm:text-sm font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 mb-2 sm:mb-3 select-none">
                        Full Calendar
                    </p>
                    <h2
                        id="calendar-heading"
                        class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4"
                    >
                        {year()} at a glance
                    </h2>
                    <p class="max-w-2xl mx-auto text-sm sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                        All 13 months laid out — each one identical, each one
                        perfectly predictable.
                    </p>
                </div>

                <div class="flex items-center justify-center gap-4 mb-8 sm:mb-12">
                    <button
                        onClick={() => setYear((y) => y - 1)}
                        class="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-all hover:bg-stone-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-white/20"
                        aria-label={`Previous year, ${year() - 1}`}
                    >
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
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <span
                        class="text-2xl font-bold text-slate-900 dark:text-white tabular-nums min-w-[5ch] text-center"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {year()}
                    </span>

                    <button
                        onClick={() => setYear((y) => y + 1)}
                        class="flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-all hover:bg-stone-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-white/20"
                        aria-label={`Next year, ${year() + 1}`}
                    >
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
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    <Show when={year() !== currentYear}>
                        <button
                            onClick={() => setYear(currentYear)}
                            class="ml-2 rounded-full border border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                            aria-label={`Return to current year, ${currentYear}`}
                        >
                            Today
                        </button>
                    </Show>
                </div>

                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    role="list"
                    aria-label={`All 13 months of ${year()}`}
                >
                    <For each={calendar().months}>
                        {(month) => (
                            <div
                                role="listitem"
                                aria-label={`${month.name}, month ${month.monthNumber}`}
                                class={`rounded-2xl border p-5 transition-all duration-500 ${
                                    month.name === "Sol"
                                        ? "border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/4 shadow-lg shadow-amber-500/5"
                                        : "border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-white/2 hover:border-stone-300 dark:hover:border-white/10"
                                }`}
                            >
                                <div class="flex items-baseline justify-between mb-4">
                                    <h3
                                        class={`text-lg font-semibold ${
                                            month.name === "Sol"
                                                ? "text-amber-600 dark:text-amber-300"
                                                : "text-slate-900 dark:text-white"
                                        }`}
                                    >
                                        {month.name}
                                    </h3>
                                    <span class="text-xs text-slate-400 dark:text-slate-600 tabular-nums">
                                        Month {month.monthNumber}
                                    </span>
                                </div>

                                <div
                                    class="grid grid-cols-7 gap-0.5 mb-1"
                                    role="row"
                                >
                                    <For each={IFC_WEEKDAY_SHORT}>
                                        {(wd) => (
                                            <div
                                                role="columnheader"
                                                class="text-center text-[10px] font-medium text-slate-400 dark:text-slate-600 py-1"
                                            >
                                                {wd}
                                            </div>
                                        )}
                                    </For>
                                </div>

                                <div
                                    class="grid grid-cols-7 gap-0.5"
                                    role="rowgroup"
                                >
                                    <For each={month.days}>
                                        {(dayInfo) => {
                                            const today = isToday(
                                                month.monthNumber,
                                                dayInfo.day,
                                            );
                                            const isWeekend =
                                                dayInfo.weekday === 0 ||
                                                dayInfo.weekday === 6;
                                            return (
                                                <div
                                                    role="cell"
                                                    class={`flex items-center justify-center rounded-md text-xs h-8 transition-colors ${
                                                        today
                                                            ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/50"
                                                            : isWeekend
                                                              ? "text-slate-400 dark:text-slate-500 bg-stone-100 dark:bg-white/1"
                                                              : "text-slate-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-white/5"
                                                    }`}
                                                    title={`${IFC_WEEKDAY_SHORT[dayInfo.weekday]}, ${month.name} ${dayInfo.day}${today ? " (today)" : ""}`}
                                                    aria-current={
                                                        today
                                                            ? "date"
                                                            : undefined
                                                    }
                                                >
                                                    {dayInfo.day}
                                                </div>
                                            );
                                        }}
                                    </For>
                                </div>
                            </div>
                        )}
                    </For>

                    <div
                        role="listitem"
                        aria-label="Special days"
                        class="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/3 p-5 flex flex-col justify-center transition-colors duration-500"
                    >
                        <h3 class="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-4">
                            Special Days
                        </h3>

                        <div class="space-y-4">
                            <div class="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-100/50 dark:bg-emerald-500/5 p-4">
                                <div class="flex items-center gap-3 mb-2">
                                    <div>
                                        <p class="font-semibold text-emerald-700 dark:text-emerald-200 text-sm">
                                            Year Day
                                        </p>
                                        <p class="text-[10px] uppercase tracking-wider text-emerald-500/70">
                                            Every year · After December 28
                                        </p>
                                    </div>
                                </div>
                                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    A worldwide holiday outside of any week or
                                    month. The 365th day, connecting one year to
                                    the next.
                                </p>
                            </div>

                            <div
                                class={`rounded-xl border p-4 ${
                                    isLeapYear(year())
                                        ? "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5"
                                        : "border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-white/2"
                                }`}
                            >
                                <div class="flex items-center gap-3 mb-2">
                                    <div>
                                        <p
                                            class={`font-semibold text-sm ${isLeapYear(year()) ? "text-amber-700 dark:text-amber-200" : "text-slate-400 dark:text-slate-500"}`}
                                        >
                                            Leap Day
                                        </p>
                                        <p
                                            class={`text-[10px] uppercase tracking-wider ${isLeapYear(year()) ? "text-amber-500/70" : "text-slate-400 dark:text-slate-500"}`}
                                        >
                                            {isLeapYear(year())
                                                ? `${year()} is a leap year · After June 28`
                                                : `${year()} is not a leap year`}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    class={`text-xs leading-relaxed ${isLeapYear(year()) ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}
                                >
                                    An extra intercalary day added every 4 years
                                    between June and Sol. Also outside the
                                    weekly cycle.
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-200 dark:border-white/5">
                            <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                                <span>Regular days</span>
                                <span class="text-slate-700 dark:text-slate-300 tabular-nums">
                                    364
                                </span>
                            </div>
                            <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                                <span>Year Day</span>
                                <span class="text-emerald-500 dark:text-emerald-400 tabular-nums">
                                    +1
                                </span>
                            </div>
                            <Show when={isLeapYear(year())}>
                                <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                                    <span>Leap Day</span>
                                    <span class="text-amber-500 dark:text-amber-400 tabular-nums">
                                        +1
                                    </span>
                                </div>
                            </Show>
                            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-stone-200 dark:border-white/5 font-medium">
                                <span>Total</span>
                                <span class="text-slate-900 dark:text-white tabular-nums">
                                    {isLeapYear(year()) ? 366 : 365} days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
