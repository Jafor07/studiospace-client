"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LuBookmark,
  LuLayoutDashboard,
  LuList,
  LuLogOut,
  LuMenu,
  LuPlus,
  LuTicket,
} from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import { resetWishlist } from "@/app/lib/wishlist-store";
import { getInitials } from "@/app/lib/utils";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: LuPlus },
  { href: "/my-listings", label: "My Studio Listings", icon: LuList },
  { href: "/my-bookings", label: "My Bookings", icon: LuTicket },
  { href: "/saved", label: "Saved Studios", icon: LuBookmark },
];

// Clicking a menu item should also close the dropdown
const closeDropdown = () => document.activeElement?.blur();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    closeDropdown();
    await authClient.signOut();
    resetWishlist();
    toast.success("You have been logged out.");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Left: mobile menu + logo */}
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open menu">
              <LuMenu size={22} />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-10 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeDropdown}
                    className={isActive(link.href) ? "menu-active" : ""}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!user && !isPending && (
                <>
                  <li className="mt-2">
                    <Link href="/login" onClick={closeDropdown}>Login</Link>
                  </li>
                  <li>
                    <Link href="/signup" onClick={closeDropdown}>Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Logo />
        </div>

        {/* Centre: links with an underline on the active page */}
        <nav className="navbar-center hidden lg:flex" aria-label="Main">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-btn border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "border-primary text-primary"
                      : "border-transparent hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: theme + login buttons or the user's avatar */}
        <div className="navbar-end gap-2">
          <ThemeToggle />

          {isPending && <div className="skeleton h-10 w-10 shrink-0 rounded-full" />}

          {!isPending && !user && (
            <div className="hidden gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost">Login</Link>
              <Link href="/signup" className="btn btn-primary">Register</Link>
            </div>
          )}

          {!isPending && user && (
            <div className="dropdown dropdown-end dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open account menu"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full border-2 border-primary object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 mt-1 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="menu-title px-3 py-2">
                  <span className="block text-base font-bold text-base-content">{user.name}</span>
                  <span className="block truncate text-xs font-normal">{user.email}</span>
                </li>
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeDropdown}>
                      <link.icon size={16} />
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-base-300 pt-1">
                  <button type="button" onClick={handleLogout} className="text-error">
                    <LuLogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
