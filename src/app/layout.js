import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "./components/Navbar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudioSpace | Book Creative Studios",
  description:
    "Discover, compare and book photo studios, sound stages, podcast rooms and music suites from creators near you.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="studio-light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-base-100 text-base-content"
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              border: "1px solid var(--color-base-300)",
            },
          }}
        />
      </body>
    </html>
  );
}
