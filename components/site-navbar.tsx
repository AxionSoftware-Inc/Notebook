"use client";

import Link from "next/link";
import { MoonStar, NotebookPen, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme !== "light";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 text-xs font-black uppercase tracking-[0.16em] text-foreground transition hover:border-accent/30 hover:bg-muted/50"
            aria-label="Toggle theme"
        >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span>{isDark ? "Light" : "Dark"}</span>
        </button>
    );
}

export function SiteNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 px-4 py-3">
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-[var(--accent-soft)] text-accent">
                        <NotebookPen className="h-5 w-5" />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">MathSphere</span>
                        <span className="block text-sm font-black tracking-tight">Notebook Workspace</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    <a href="#notebook" className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:text-foreground">
                        Notebook
                    </a>
                    <a href="#backend" className="rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:text-foreground">
                        Backend
                    </a>
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <a
                        href="/admin/"
                        className="inline-flex h-10 items-center rounded-full border border-border/70 bg-foreground px-4 text-xs font-black uppercase tracking-[0.16em] text-background transition hover:opacity-90"
                    >
                        Admin
                    </a>
                </div>
            </div>
        </header>
    );
}
