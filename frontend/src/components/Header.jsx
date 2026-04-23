import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/api";

const links = [
  { href: "#home", label: "Home" },
  { href: "#fleet", label: "Fleet" },
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 px-5 sm:px-10 py-5 flex items-center justify-between"
      data-testid="site-header"
    >
      <a href="#home" className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-orange-500 grid place-items-center text-white font-serif text-2xl font-bold shadow-lg">
          K
        </div>
        <div className="text-white">
          <div className="font-serif text-lg sm:text-xl font-bold leading-tight">
            Krishna Tour &amp; Travels
          </div>
          <div className="text-[10px] sm:text-xs tracking-[0.2em] uppercase opacity-80">
            Since 2010 · Pune
          </div>
        </div>
      </a>

      <nav className="hidden lg:flex items-center gap-7 text-white/90 text-sm font-medium">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="hover:text-orange-400 transition-colors"
            data-testid={`nav-${l.label.toLowerCase().replace(" ", "-")}`}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <a
          href={`tel:${PHONE_TEL}`}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all"
          data-testid="header-phone"
        >
          <Phone size={16} />
          {PHONE_DISPLAY}
        </a>
        <a
          href="#book"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-orange-500/30 transition-all"
          data-testid="header-book-btn"
        >
          Book Now
        </a>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-white p-2"
        data-testid="mobile-menu-btn"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 px-5 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-white">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-full text-sm font-semibold mt-2"
            >
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
