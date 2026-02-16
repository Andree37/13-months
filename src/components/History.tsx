import { For } from "solid-js";

const timeline = [
    {
        year: "1902",
        title: "An accountant has an idea",
        description:
            "Moses Cotsworth, a British railway statistician, publishes 'The Rational Almanac.' His argument: months should be equal. He designs a 13-month calendar to prove it.",
    },
    {
        year: "1922",
        title: "The League of Nations looks into it",
        description:
            "Calendar reform becomes a real international conversation. A formal committee is set up to evaluate proposals, and the 13-month calendar is one of the front-runners.",
    },
    {
        year: "1928",
        title: "Kodak starts using it",
        description:
            "George Eastman loves the idea so much he switches Kodak's entire internal operations to 13 months. Payroll, accounting, everything. It works.",
    },
    {
        year: "1937",
        title: "It gets voted down",
        description:
            "The League of Nations puts it to a vote. Religious groups push back — the extra day outside the week messes with the Sabbath cycle. The proposal dies.",
    },
    {
        year: "1989",
        title: "Kodak gives up",
        description:
            "After 61 years, Kodak drops the calendar. Not because it didn't work — it did. But being the only company using a different calendar got old.",
    },
    {
        year: "Now",
        title: "Still a good idea",
        description:
            "Software runs everything now. Switching calendars is a database migration, not a civilization-level crisis. The hard part was never the math.",
    },
];

const faqs = [
    {
        question: "What about the leftover day?",
        answer: "It's called Year Day. It comes after December 28 and before the next January 1. It doesn't belong to any week — no Monday, no Tuesday, just a day off. Leap years get a second one after June.",
    },
    {
        question: "Do holidays move?",
        answer: "Some dates would shift, but here's the thing — every date would always be the same day of the week, forever. Christmas on a Wednesday? It's on a Wednesday every year. That's more predictable, not less.",
    },
    {
        question: "Doesn't this break the Sabbath?",
        answer: "This is the objection that killed it in 1937. Year Day sits outside the 7-day week, which some see as breaking an unbroken chain. Others say it's just a pause. It depends on who you ask.",
    },
    {
        question: "Has anyone actually tried this?",
        answer: "Kodak ran on it for 61 years. It wasn't a pilot program — it was how they did business. Payroll, planning, accounting. They only stopped because the rest of the world wouldn't switch.",
    },
    {
        question: "Why 13? Why not 10 or something?",
        answer: "Because 28 divides perfectly into 4 weeks. No other month length does that. 13 × 28 = 364, which is as close to 365 as you can get with perfectly equal months.",
    },
    {
        question: "Could we actually do this?",
        answer: "The math has never been the problem. In 1937 it meant reprinting every calendar and contract on earth. Today it's a software update. The barrier is cultural, not technical.",
    },
];

export default function History() {
    return (
        <section
            aria-labelledby="history-heading"
            class="relative bg-stone-50 dark:bg-slate-900 py-16 sm:py-24 md:py-32 px-4 transition-colors duration-500"
        >
            <div class="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/50 dark:via-emerald-500/50 to-transparent" />

            <div class="mx-auto max-w-6xl">
                <div class="text-center mb-12 sm:mb-20">
                    <h2
                        id="history-heading"
                        class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4"
                    >
                        This isn't new
                    </h2>
                    <p class="max-w-2xl mx-auto text-sm sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                        People have been trying to fix the calendar for over a
                        century. It almost happened.
                    </p>
                </div>

                <div
                    class="relative mb-16 sm:mb-32"
                    role="list"
                    aria-label="Timeline of calendar reform"
                >
                    <div
                        class="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-amber-400/50 dark:from-amber-500/50 via-indigo-400/30 dark:via-indigo-500/30 to-transparent sm:-translate-x-px"
                        aria-hidden="true"
                    />

                    <div class="space-y-12">
                        <For each={timeline}>
                            {(event, i) => (
                                <div
                                    role="listitem"
                                    aria-label={`${event.year}: ${event.title}`}
                                    class={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 ${
                                        i() % 2 === 0
                                            ? "sm:flex-row"
                                            : "sm:flex-row-reverse"
                                    }`}
                                >
                                    <div
                                        class={`flex-1 ml-12 sm:ml-0 ${
                                            i() % 2 === 0
                                                ? "sm:text-right"
                                                : "sm:text-left"
                                        }`}
                                    >
                                        <div
                                            class={`inline-block rounded-2xl border border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 p-6 text-left max-w-md transition-colors duration-500 ${
                                                i() % 2 === 0
                                                    ? "sm:ml-auto"
                                                    : "sm:mr-auto"
                                            }`}
                                        >
                                            <p class="text-xs font-bold uppercase tracking-widest text-amber-500/70 dark:text-amber-400/70 mb-1">
                                                {event.year}
                                            </p>
                                            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-2">
                                                {event.title}
                                            </h3>
                                            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        class="absolute left-4 sm:left-1/2 top-6 sm:top-8 -translate-x-1/2 flex items-center justify-center"
                                        aria-hidden="true"
                                    >
                                        <div class="w-3 h-3 rounded-full bg-stone-50 dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500/60 ring-4 ring-stone-50 dark:ring-slate-900" />
                                    </div>

                                    <div class="flex-1 hidden sm:block" />
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                <div class="text-center mb-10 sm:mb-16">
                    <h2
                        id="faq-heading"
                        class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        Yeah, but...
                    </h2>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto"
                    role="list"
                    aria-labelledby="faq-heading"
                >
                    <For each={faqs}>
                        {(faq) => (
                            <div
                                role="listitem"
                                class="rounded-2xl border border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 p-4 sm:p-6 hover:border-indigo-300 dark:hover:border-indigo-500/20 transition-colors"
                            >
                                <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                                    <span
                                        class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-bold mt-0.5"
                                        aria-hidden="true"
                                    >
                                        ?
                                    </span>
                                    {faq.question}
                                </h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-9">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </For>
                </div>

                <aside
                    aria-label="Key fact: Kodak's 61-year use of the calendar"
                    class="mt-12 sm:mt-20 mx-auto max-w-3xl rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/3 p-6 sm:p-8 md:p-10 text-center transition-colors duration-500"
                >
                    <h3 class="text-xl font-bold text-amber-700 dark:text-amber-200 mb-3">
                        Kodak used this for 61 years
                    </h3>
                    <p class="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
                        From 1928 to 1989, Eastman Kodak ran payroll,
                        accounting, and planning on 13 months internally. It
                        wasn't a theory — it was their actual system, and it
                        worked. They only dropped it because nobody else was
                        using it.
                    </p>
                </aside>
            </div>
        </section>
    );
}
