import ZelioLogo from "./ZelioLogo";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#get-started" },
  { label: "Privacy", href: "#footer" },
  { label: "Terms", href: "#footer" },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-ink/[0.06] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <ZelioLogo
          markClassName="h-6 w-6"
          wordmarkClassName="text-lg font-extrabold tracking-tight text-ink"
        />
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-muted">© ZELIO</p>
      </div>
    </footer>
  );
}
