import ThemeProvider from "./components/ThemeProvider";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import CalendarView from "./components/CalendarView";
import History from "./components/History";
import Footer from "./components/Footer";

export default function App() {
    return (
        <ThemeProvider>
            <div class="min-h-screen bg-stone-100 dark:bg-slate-950 font-[Inter,system-ui,sans-serif] antialiased transition-colors duration-500">
                <Hero />
                <HowItWorks />
                <CalendarView />
                <History />
                <Footer />
            </div>
        </ThemeProvider>
    );
}
