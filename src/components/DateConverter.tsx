import { createSignal, For, Show } from "solid-js";
import {
    toIFC,
    fromIFC,
    fromIFCYearDay,
    fromIFCLeapDay,
    formatGregorian,
    isLeapYear,
    IFC_MONTH_NAMES,
    IFC_WEEKDAY_NAMES,
} from "../lib/calendar";

type Direction = "greg-to-ifc" | "ifc-to-greg";

export default function DateConverter() {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const [gregInput, setGregInput] = createSignal(todayStr);
    const [ifcYear, setIfcYear] = createSignal(today.getFullYear());
    const [ifcMonth, setIfcMonth] = createSignal(1);
    const [ifcDay, setIfcDay] = createSignal(1);
    const [ifcSpecial, setIfcSpecial] = createSignal<
        "none" | "yearday" | "leapday"
    >("none");
    const [direction, setDirection] = createSignal<Direction>("greg-to-ifc");

    const gregDate = () => {
        const parts = gregInput().split("-");
        if (parts.length !== 3) return null;
        const [y, m, d] = parts.map(Number);
        if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
        return new Date(y, m - 1, d);
    };

    const ifcResult = () => {
        const d = gregDate();
        if (!d) return null;
        return toIFC(d);
    };

    const gregResult = () => {
        if (ifcSpecial() === "yearday") return fromIFCYearDay(ifcYear());
        if (ifcSpecial() === "leapday") return fromIFCLeapDay(ifcYear());
        return fromIFC(ifcYear(), ifcMonth(), ifcDay());
    };

    const showLeapDayOption = () => isLeapYear(ifcYear());

    return (
        <section
            aria-labelledby="converter-heading"
            class="relative bg-stone-50 dark:bg-slate-950 pb-24 sm:pb-32 px-4 transition-colors duration-500"
        >
            <div class="mx-auto max-w-3xl">
                <div class="text-center mb-12">
                    <p class="text-sm font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3 select-none">
                        Date Converter
                    </p>
                    <h2
                        id="converter-heading"
                        class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        When is your birthday, really?
                    </h2>
                    <p class="max-w-xl mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
                        Plug in any date — your birthday, your mom's, an
                        anniversary — and see what it looks like in the 13-month
                        calendar.
                    </p>
                </div>

                <div class="flex items-center justify-center mb-10">
                    <div class="inline-flex rounded-full border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-white/5 p-1 gap-1">
                        <button
                            type="button"
                            onClick={() => setDirection("greg-to-ifc")}
                            class={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                direction() === "greg-to-ifc"
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }`}
                        >
                            Gregorian → IFC
                        </button>
                        <button
                            type="button"
                            onClick={() => setDirection("ifc-to-greg")}
                            class={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                direction() === "ifc-to-greg"
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }`}
                        >
                            IFC → Gregorian
                        </button>
                    </div>
                </div>

                <div class="rounded-2xl border border-stone-200 dark:border-white/5 bg-stone-100 dark:bg-white/2 p-6 sm:p-8 transition-colors duration-500">
                    <Show when={direction() === "greg-to-ifc"}>
                        <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                            <div>
                                <label
                                    for="greg-date-input"
                                    class="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3"
                                >
                                    Gregorian date
                                </label>
                                <input
                                    id="greg-date-input"
                                    type="date"
                                    value={gregInput()}
                                    onInput={(e) =>
                                        setGregInput(e.currentTarget.value)
                                    }
                                    class="w-full rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500"
                                />
                                <Show when={gregDate()}>
                                    <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        {formatGregorian(gregDate()!)}
                                    </p>
                                </Show>
                            </div>

                            <div class="flex items-center justify-center">
                                <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                                    <svg
                                        class="w-5 h-5 text-indigo-500 dark:text-indigo-400 md:rotate-0 rotate-90"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width={2}
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                                    IFC date
                                </p>
                                <Show
                                    when={ifcResult()}
                                    fallback={
                                        <div class="rounded-xl border border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-white/1 p-4 text-center text-sm text-slate-400 dark:text-slate-500">
                                            Pick a valid date
                                        </div>
                                    }
                                >
                                    {(ifc) => (
                                        <div
                                            class={`rounded-xl border p-4 text-center transition-colors ${
                                                ifc().isYearDay
                                                    ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5"
                                                    : ifc().isLeapDay
                                                      ? "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5"
                                                      : "border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5"
                                            }`}
                                        >
                                            <Show
                                                when={
                                                    !ifc().isYearDay &&
                                                    !ifc().isLeapDay
                                                }
                                                fallback={
                                                    <div>
                                                        <p
                                                            class={`text-2xl font-bold ${
                                                                ifc().isYearDay
                                                                    ? "text-emerald-600 dark:text-emerald-300"
                                                                    : "text-amber-600 dark:text-amber-300"
                                                            }`}
                                                        >
                                                            {ifc().monthName}
                                                        </p>
                                                        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                            {ifc().isYearDay
                                                                ? "A day outside the weekly cycle"
                                                                : "An intercalary day between June and Sol"}
                                                        </p>
                                                    </div>
                                                }
                                            >
                                                <p class="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1">
                                                    {
                                                        IFC_WEEKDAY_NAMES[
                                                            ifc().weekday!
                                                        ]
                                                    }
                                                </p>
                                                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {ifc().monthName}{" "}
                                                    <span class="text-indigo-500 dark:text-indigo-400">
                                                        {ifc().day}
                                                    </span>
                                                </p>
                                                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                    Month {ifc().month} of 13 ·
                                                    Week{" "}
                                                    {Math.ceil(ifc().day! / 7)}{" "}
                                                    of 4
                                                </p>
                                            </Show>
                                        </div>
                                    )}
                                </Show>
                            </div>
                        </div>
                    </Show>

                    <Show when={direction() === "ifc-to-greg"}>
                        <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                                    IFC date
                                </p>

                                <div class="space-y-3">
                                    <div>
                                        <label
                                            for="ifc-year"
                                            class="block text-[11px] text-slate-400 dark:text-slate-500 mb-1"
                                        >
                                            Year
                                        </label>
                                        <input
                                            id="ifc-year"
                                            type="number"
                                            min="1"
                                            max="9999"
                                            value={ifcYear()}
                                            onInput={(e) => {
                                                const parsed =
                                                    parseInt(
                                                        e.currentTarget.value,
                                                    ) || today.getFullYear();
                                                setIfcYear(parsed);
                                                if (
                                                    !isLeapYear(parsed) &&
                                                    ifcSpecial() === "leapday"
                                                ) {
                                                    setIfcSpecial("none");
                                                }
                                            }}
                                            class="w-full rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500"
                                        />
                                    </div>

                                    <div class="flex items-center gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIfcSpecial("none")
                                            }
                                            class={`rounded-full px-3 py-1 text-[11px] font-medium border transition-all ${
                                                ifcSpecial() === "none"
                                                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300"
                                                    : "border-stone-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                            }`}
                                        >
                                            Regular day
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIfcSpecial("yearday")
                                            }
                                            class={`rounded-full px-3 py-1 text-[11px] font-medium border transition-all ${
                                                ifcSpecial() === "yearday"
                                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                                                    : "border-stone-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                            }`}
                                        >
                                            Year Day
                                        </button>
                                        <Show when={showLeapDayOption()}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIfcSpecial("leapday")
                                                }
                                                class={`rounded-full px-3 py-1 text-[11px] font-medium border transition-all ${
                                                    ifcSpecial() === "leapday"
                                                        ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-300"
                                                        : "border-stone-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                                }`}
                                            >
                                                Leap Day
                                            </button>
                                        </Show>
                                    </div>

                                    <Show when={ifcSpecial() === "none"}>
                                        <div>
                                            <label
                                                for="ifc-month"
                                                class="block text-[11px] text-slate-400 dark:text-slate-500 mb-1"
                                            >
                                                Month
                                            </label>
                                            <select
                                                id="ifc-month"
                                                value={ifcMonth()}
                                                onChange={(e) =>
                                                    setIfcMonth(
                                                        parseInt(
                                                            e.currentTarget
                                                                .value,
                                                        ),
                                                    )
                                                }
                                                class="w-full rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 appearance-none"
                                            >
                                                <For each={IFC_MONTH_NAMES}>
                                                    {(name, i) => (
                                                        <option value={i() + 1}>
                                                            {i() + 1}. {name}
                                                        </option>
                                                    )}
                                                </For>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                for="ifc-day"
                                                class="block text-[11px] text-slate-400 dark:text-slate-500 mb-1"
                                            >
                                                Day (1–28)
                                            </label>
                                            <input
                                                id="ifc-day"
                                                type="number"
                                                min="1"
                                                max="28"
                                                value={ifcDay()}
                                                onInput={(e) =>
                                                    setIfcDay(
                                                        Math.max(
                                                            1,
                                                            Math.min(
                                                                28,
                                                                parseInt(
                                                                    e
                                                                        .currentTarget
                                                                        .value,
                                                                ) || 1,
                                                            ),
                                                        ),
                                                    )
                                                }
                                                class="w-full rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500"
                                            />
                                        </div>
                                    </Show>
                                </div>
                            </div>

                            <div class="flex items-center justify-center">
                                <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                                    <svg
                                        class="w-5 h-5 text-indigo-500 dark:text-indigo-400 md:rotate-0 rotate-90"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width={2}
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                                    Gregorian date
                                </p>
                                <Show
                                    when={gregResult()}
                                    fallback={
                                        <div class="rounded-xl border border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-white/1 p-4 text-center text-sm text-slate-400 dark:text-slate-500">
                                            {ifcSpecial() === "leapday" &&
                                            !isLeapYear(ifcYear())
                                                ? `${ifcYear()} is not a leap year`
                                                : "Pick a valid IFC date"}
                                        </div>
                                    }
                                >
                                    {(result) => {
                                        const gregMonths = [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                        ];
                                        const gregWeekdays = [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                        ];
                                        return (
                                            <div class="rounded-xl border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-500/5 p-4 text-center transition-colors">
                                                <p class="text-xs text-violet-500 dark:text-violet-400 font-medium mb-1">
                                                    {
                                                        gregWeekdays[
                                                            result().getDay()
                                                        ]
                                                    }
                                                </p>
                                                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {
                                                        gregMonths[
                                                            result().getMonth()
                                                        ]
                                                    }{" "}
                                                    <span class="text-violet-500 dark:text-violet-400">
                                                        {result().getDate()}
                                                    </span>
                                                </p>
                                                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                    {formatGregorian(result())}
                                                </p>
                                            </div>
                                        );
                                    }}
                                </Show>
                            </div>
                        </div>
                    </Show>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-md mx-auto">
                        <span class="font-medium text-slate-500 dark:text-slate-400">
                            Fun fact:
                        </span>{" "}
                        In the IFC, your birthday always falls on the same day
                        of the week, every single year.
                    </p>
                </div>
            </div>
        </section>
    );
}
