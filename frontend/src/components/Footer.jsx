import { PHONE_DISPLAY, EMAIL, OFFICE } from "@/lib/api";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white px-5 sm:px-10 py-10" data-testid="site-footer">
      <div className="max-w-[1500px] mx-auto grid sm:grid-cols-3 gap-6 items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 grid place-items-center font-serif text-xl font-bold">
              K
            </div>
            <div>
              <div className="font-serif text-lg font-bold">
                Krishna Tour &amp; Travels
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                Since 2010 · Pune
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-white/70 sm:text-center">
          <div>{PHONE_DISPLAY} · {EMAIL}</div>
          <div className="mt-1 text-xs">{OFFICE}</div>
        </div>
        <div className="text-xs text-white/50 sm:text-right">
          © {new Date().getFullYear()} Krishna Tour &amp; Travels. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
