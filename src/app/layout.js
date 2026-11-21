import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "StudioSpace | Book Creative Studios",
    template: "%s | StudioSpace",
  },
  description:
    "Discover, compare and book photo studios, sound stages, podcast rooms and music suites from creators near you.",
};

// Runs before the page is painted, so a saved dark theme never flashes white
const themeScript = `
try {
  var saved = localStorage.getItem("studiospace-theme");
  var theme = saved === "studio-dark" || saved === "studio-light"
    ? saved
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "studio-dark" : "studio-light");
  document.documentElement.setAttribute("data-theme", theme);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="studio-light"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="flex min-h-screen flex-col bg-base-100 text-base-content"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
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
