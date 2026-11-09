
import type { Metadata } from "next";
import "./globals.css";

import VisitTracker from "./components/VisitTracker";
import CopyProtection from "./AntiCopyProtection";
import BackgroundMusic from "./components/BackgroundMusic";

export const metadata: Metadata = {
    title: "NextCAD Studio",
    description: "Design Gallery 3D",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body className="site-protected min-h-screen w-full flex flex-col overflow-x-hidden">
                <CopyProtection />
                <VisitTracker />
                <BackgroundMusic />

                {children}
            </body>
        </html>
    );
}