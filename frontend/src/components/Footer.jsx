import { PHONE_DISPLAY, EMAIL, OFFICE, OWNER } from "@/lib/api";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white px-5 sm:px-10 py-10" data-testid="site-footer">
      <div className="max-w-[1500px] mx-auto grid sm:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white grid place-items-center p-1.5 shadow-lg">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold">Krishn Tour and Travels</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">By {OWNER}</div>
          </div>
        </div>
        <div className="text-sm text-white/70 sm:text-center">
          <div>{PHONE_DISPLAY} · {EMAIL}</div>
          <div className="mt-1 text-xs">{OFFICE}</div>
        </div>
        <div className="text-xs text-white/50 sm:text-right">
          © {new Date().getFullYear()} Krishn Tour and Travels.<br />All rights reserved.
        </div>
      </div>
    </footer>
  );
}
