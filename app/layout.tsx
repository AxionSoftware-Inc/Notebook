import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import "./theme.css";
import "@/styles/axion-science-tokens.css";
import "@/styles/axion-premium-landing.css";
import "@/styles/axion-notebook-chrome.css";
import "@/styles/axion-premium-workspace.css";
import "@/styles/axion-notebook-final-polish.css";
import { ThemeProvider } from "@/components/theme-provider";
import { EcosystemBar } from "@/components/ecosystem/ecosystem-bar";
import { EcosystemKeyboardNav } from "@/components/ecosystem/ecosystem-keyboard-nav";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Axion Notebook",
    description: "A calm research notebook for reasoning, evidence, mathematics, science, and project memory.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${manrope.variable} ${playfair.variable} min-h-screen`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                    <EcosystemKeyboardNav currentApp="notebook" />
                    <EcosystemBar currentApp="notebook" />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
