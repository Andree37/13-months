import { createSignal, onCleanup, onMount } from "solid-js";
import type { ParentComponent } from "solid-js";

function isDarkTime(): boolean {
    const h = new Date().getHours();
    return h < 7 || h >= 19;
}

function applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

const ThemeProvider: ParentComponent = (props) => {
    const [dark, setDark] = createSignal(isDarkTime());

    onMount(() => {
        applyTheme(dark());

        const interval = setInterval(() => {
            const shouldBeDark = isDarkTime();
            if (shouldBeDark !== dark()) {
                setDark(shouldBeDark);
                applyTheme(shouldBeDark);
            }
        }, 60_000);

        onCleanup(() => clearInterval(interval));
    });

    return <>{props.children}</>;
};

export default ThemeProvider;
