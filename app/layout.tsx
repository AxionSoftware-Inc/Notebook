import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNavbar } from "@/widgets/layout/site-navbar";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

export const metadata: Metadata = {
    title: "MathSphere Notebook",
    description: "Standalone computational notebook extracted from the Mathematics monolith.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <html lang="uz" suppressHydrationWarning>
                <body className={`${manrope.variable} ${playfair.variable} min-h-screen`}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        <SiteNavbar />
                        {children}
                    </ThemeProvider>
                </body>
            </html>
    );
}
