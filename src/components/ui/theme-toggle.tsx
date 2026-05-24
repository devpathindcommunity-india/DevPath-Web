"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import Button from "@/components/ui/Button"

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Wait for hydration to complete before rendering
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch and rendering before hydration is complete
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                disabled
                className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 p-0 flex items-center justify-center opacity-50"
                aria-label="Toggle theme (loading)"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
            </Button>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <Button
            variant="ghost"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors p-0 flex items-center justify-center"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-400" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
