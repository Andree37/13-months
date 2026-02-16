export const IFC_MONTH_NAMES = [
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
] as const;

export const IFC_WEEKDAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

export const IFC_WEEKDAY_SHORT = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
] as const;

export interface IFCDate {
    month: number | null;
    day: number | null;
    year: number;
    monthName: string;
    weekday: number | null;
    isYearDay: boolean;
    isLeapDay: boolean;
}

export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function doyToGregorian(year: number, doy: number): Date {
    const date = new Date(year, 0);
    date.setDate(doy);
    return date;
}

export function fromIFC(year: number, monthNumber: number, day: number): Date {
    const leap = isLeapYear(year);
    let doy = (monthNumber - 1) * 28 + day;

    if (leap && doy >= 169) {
        doy += 1;
    }

    return doyToGregorian(year, doy);
}

export function fromIFCYearDay(year: number): Date {
    const leap = isLeapYear(year);
    return doyToGregorian(year, leap ? 366 : 365);
}

export function fromIFCLeapDay(year: number): Date | null {
    if (!isLeapYear(year)) return null;
    return doyToGregorian(year, 169);
}

function dayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function toIFC(gregorian: Date): IFCDate {
    const year = gregorian.getFullYear();
    const doy = dayOfYear(gregorian);
    const leap = isLeapYear(year);
    const totalDays = leap ? 366 : 365;

    if (doy === totalDays) {
        return {
            month: null,
            day: null,
            year,
            monthName: "Year Day",
            weekday: null,
            isYearDay: true,
            isLeapDay: false,
        };
    }

    if (leap && doy === 169) {
        return {
            month: null,
            day: null,
            year,
            monthName: "Leap Day",
            weekday: null,
            isYearDay: false,
            isLeapDay: true,
        };
    }

    let adjusted = doy;
    if (leap && doy > 169) {
        adjusted = doy - 1;
    }

    const monthIndex = Math.ceil(adjusted / 28) - 1;
    const dayInMonth = ((adjusted - 1) % 28) + 1;
    const weekday = (dayInMonth - 1) % 7;

    return {
        month: monthIndex + 1,
        day: dayInMonth,
        year,
        monthName: IFC_MONTH_NAMES[monthIndex],
        weekday,
        isYearDay: false,
        isLeapDay: false,
    };
}

export function formatIFC(ifc: IFCDate): string {
    if (ifc.isYearDay) return `Year Day, ${ifc.year}`;
    if (ifc.isLeapDay) return `Leap Day, ${ifc.year}`;
    return `${IFC_WEEKDAY_NAMES[ifc.weekday!]}, ${ifc.monthName} ${ifc.day}, ${ifc.year}`;
}

export function formatGregorian(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function generateFullYear(year: number) {
    const months = IFC_MONTH_NAMES.map((name, i) => ({
        name,
        monthNumber: i + 1,
        days: Array.from({ length: 28 }, (_, d) => ({
            day: d + 1,
            weekday: d % 7,
        })),
    }));

    return { months, hasLeapDay: isLeapYear(year) };
}
