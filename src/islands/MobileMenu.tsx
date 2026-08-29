import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex h-9 w-9 cursor-pointer items-center justify-center border-2 border-ink bg-paper text-lg font-black md:!hidden"
      >
        ☰
      </button>
      {open && (
        <ul className="absolute inset-x-0 top-16 flex flex-col gap-1 border-b-[3px] border-ink bg-paper px-4 py-4 text-sm font-black uppercase tracking-widest md:!hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-a block text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
