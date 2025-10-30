// app/components/Footer.tsx
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-blue-weak bg-white">
      <div className="section flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <Logo />
        <nav className="flex gap-5 text-sm text-ink/70">
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/cgu">CGU</a>
          <a href="/contact">Contact</a>
        </nav>
        <p className="text-sm text-ink/60">© {new Date().getFullYear()} Skolr</p>
      </div>
    </footer>
  );
}
