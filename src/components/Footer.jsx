import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { CATEGORIES } from "@/app/lib/constants";
import Logo from "@/components/Logo";
import NewsletterForm from "@/components/NewsletterForm";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/add-studio", label: "Host Your Space" },
];

// The new X logo (not the old Twitter bird)
const socials = [
  { href: "https://x.com", label: "StudioSpace on X", icon: FaXTwitter },
  { href: "https://instagram.com", label: "StudioSpace on Instagram", icon: FaInstagram },
  { href: "https://youtube.com", label: "StudioSpace on YouTube", icon: FaYoutube },
  { href: "https://facebook.com", label: "StudioSpace on Facebook", icon: FaFacebookF },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-base-content/70">
            StudioSpace connects creators with the rooms they need: photo
            studios, sound stages, podcast lounges, music suites and art
            workshops, booked by the hour and hosted by people who care about
            the craft.
          </p>
          <div className="flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="btn btn-circle btn-sm btn-outline"
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest">Quick links</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular categories */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest">Popular categories</h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            {CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="hover:text-primary"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-widest">Studio news</h3>
          <p className="text-sm text-base-content/70">
            New spaces, host tips and booking deals, once a month.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-base-content/60 sm:flex-row">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
