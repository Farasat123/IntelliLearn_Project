import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();
const THEME_OPTIONS = ["light", "dark"];

const getInitialTheme = () => {
	if (typeof window === "undefined") {
		return "light";
	}

	const storedTheme = window.localStorage.getItem("theme");
	if (storedTheme && THEME_OPTIONS.includes(storedTheme)) {
		return storedTheme;
	}

	const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
	return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(getInitialTheme);
	const isDark = theme === "dark";

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		window.localStorage.setItem("theme", theme);
		document.documentElement.dataset.theme = theme;
		document.documentElement.classList.toggle("dark", isDark);
	}, [theme, isDark]);

	const setTheme = (nextTheme) => {
		setThemeState(THEME_OPTIONS.includes(nextTheme) ? nextTheme : "light");
	};

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			isDark,
		}),
		[theme, isDark]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

	export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
