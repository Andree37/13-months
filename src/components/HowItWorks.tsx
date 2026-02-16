import { For } from "solid-js";

const monthLayout = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Sol",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const cards = [
    {
        icon: "☀️",
        title: "A new month called Sol",
        description:
            "It sits between June and July. Named after the sun. Everything else keeps its name — January is still January, December is still December. There's just one more month in between.",
    },
    {
        icon: null,
        title: "Year Day",
        description:
            "13 × 28 = 364, so there's one day left over. That's Year Day — it comes after December 28 and before next January 1. It's not a Monday or a Tuesday. It's just a day off. A universal holiday.",
    },
    {
        icon: null,
        title: "Leap years",
        description:
            "Same rule as now — every 4 years, you get an extra day. It slots in after June 28, right before Sol starts. Another day outside the weekly cycle. Two holidays instead of one.",
    },
    {
        icon: null,
        title: "The week never breaks",
        description:
            "Every month starts on Sunday and ends on Saturday. The 1st is always a Sunday. The 14th is always a Saturday. Year after year after year. You could throw away your calendar and still know what day it is.",
    },
];

export default function HowItWorks() {
    return (
        <section
            id="why"
            aria-labelledby="how-it-works-heading"
            class="relative bg-stone-50 dark:bg-slate-900 py-16 sm:py-24 md:py-32 px-4 transition-colors duration-500"
        >
            <div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/50 dark:via-indigo-500/50 to-transparent" />

            <div class="mx-auto max-w-6xl">
                <div class="text-center mb-12 sm:mb-20">
                    <h2
                        id="how-it-works-heading"
                        class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4"
                    >
                        The whole idea in 30 seconds
                    </h2>
                    <p class="max-w-2xl mx-auto text-sm sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                        Take the 365 days in a year. Divide them into 13 months
                        of 28 days. That's 364. The leftover day is a holiday
                        that doesn't belong to any month or week. Done.
                    </p>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-24"
                    role="list"
                >
                    <For each={cards}>
                        {(card) => (
                            <div
                                role="listitem"
                                class="rounded-2xl border border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 p-4 sm:p-6 md:p-8 transition-colors duration-500"
                            >
                                {card.icon ? (
                                    <div class="flex items-start gap-3 mb-2">
                                        <span
                                            class="text-2xl leading-none shrink-0 mt-0.5"
                                            aria-hidden="true"
                                        >
                                            {card.icon}
                                        </span>
                                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                                            {card.title}
                                        </h3>
                                    </div>
                                ) : (
                                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        {card.title}
                                    </h3>
                                )}
                                <p
                                    class={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${card.icon ? "pl-9" : ""}`}
                                >
                                    {card.description}
                                </p>
                            </div>
                        )}
                    </For>
                </div>

                <div class="text-center mb-8 sm:mb-10">
                    <h3
                        id="month-template-heading"
                        class="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                        This is what every month looks like
                    </h3>
                    <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                        All 13 of them. Exactly the same. No exceptions.
                    </p>
                </div>

                <div
                    class="mx-auto max-w-sm rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-white/3 p-4 sm:p-6 md:p-8 backdrop-blur-sm mb-10 sm:mb-16 transition-colors duration-500"
                    role="table"
                    aria-labelledby="month-template-heading"
                >
                    <div class="grid grid-cols-7 gap-1 mb-2" role="row">
                        <For each={weekdays}>
                            {(day) => (
                                <div class="text-center text-xs font-medium text-slate-400 dark:text-slate-500 py-1">
                                    {day}
                                </div>
                            )}
                        </For>
                    </div>
                    <div class="grid grid-cols-7 gap-1">
                        <For each={Array.from({ length: 28 }, (_, i) => i + 1)}>
                            {(day) => (
                                <div
                                    class={`flex items-center justify-center rounded-lg text-sm h-10 transition-colors ${
                                        day % 7 === 0
                                            ? "text-indigo-500 dark:text-indigo-400/70 bg-indigo-50 dark:bg-indigo-500/5"
                                            : day % 7 === 1
                                              ? "text-violet-500 dark:text-violet-400/70 bg-violet-50 dark:bg-violet-500/5"
                                              : "text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-white/5"
                                    }`}
                                >
                                    {day}
                                </div>
                            )}
                        </For>
                    </div>
                    <p class="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
                        4 weeks. Always starts Sunday. Always ends Saturday.
                    </p>
                </div>

                <div class="text-center mb-4 sm:mb-6">
                    <h3
                        id="full-year-heading"
                        class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-1"
                    >
                        The full year
                    </h3>
                    <p class="text-sm text-slate-400 dark:text-slate-500">
                        364 regular days + Year Day (+ Leap Day some years)
                    </p>
                </div>

                <div
                    class="flex flex-wrap justify-center gap-2 sm:gap-3"
                    role="list"
                    aria-labelledby="full-year-heading"
                >
                    <For each={monthLayout}>
                        {(month, i) => (
                            <div
                                role="listitem"
                                class={`rounded-xl border px-3 py-2 sm:px-4 sm:py-3 text-center transition-all hover:scale-105 ${
                                    month === "Sol"
                                        ? "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-lg shadow-amber-500/5"
                                        : "border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/20"
                                }`}
                            >
                                <p class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                                    {i() + 1}
                                </p>
                                <p class="text-xs sm:text-sm font-medium">
                                    {month}
                                </p>
                                <p class="text-[10px] text-slate-400 dark:text-slate-600">
                                    28 days
                                </p>
                            </div>
                        )}
                    </For>
                    <div
                        role="listitem"
                        class="rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 sm:px-4 sm:py-3 text-center"
                    >
                        <p class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                            +
                        </p>
                        <p class="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-300">
                            Year Day
                        </p>
                        <p class="text-[10px] text-emerald-500/60">1 day</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
