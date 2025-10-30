// app/components/Navbar.tsx
"use client";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-weak bg-white/80 backdrop-blur">
      <nav className="section flex h-16 items-center justify-between">
        <Logo />

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-xl border border-blue-weak px-3 py-2"
          aria-label="Menu"
        >
          ☰
        </button>

        <ul className="hidden items-center gap-6 md:flex">
          <li><a href="#features" className="p text-ink/80 hover:text-ink">Fonctionnalités</a></li>
          <li><a href="#pricing" className="p text-ink/80 hover:text-ink">Packs</a></li>
          <li><a href="#community" className="p text-ink/80 hover:text-ink">Communauté</a></li>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="https://discord.gg/ton-invite" target="_blank" className="btn btn-ghost">Rejoindre le Discord</a>
          <a href="#pricing" className="btn btn-primary">Obtenir un pack</a>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-blue-weak bg-white">
          <ul className="section flex flex-col py-3">
            <a href="#features" onClick={() => setOpen(false)} className="py-2">Fonctionnalités</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="py-2">Packs</a>
            <a href="#community" onClick={() => setOpen(false)} className="py-2">Communauté</a>
            <a href="https://discord.gg/ton-invite" className="btn btn-ghost mt-3">Discord</a>
            <a href="#pricing" className="btn btn-primary mt-2">Obtenir un pack</a>
          </ul>
        </div>
      )}
    </header>
  );
}
