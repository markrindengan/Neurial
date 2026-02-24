import { Link } from "react-router-dom";

const footerLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/neurial-mark.png" alt="Neurial" className="w-6 h-6 object-contain" />
          <span className="font-display text-sm font-bold tracking-tight">Neurial</span>
        </Link>

        <nav className="flex items-center gap-6 font-body text-xs text-muted-foreground">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} Neurial
        </p>
      </div>
    </footer>
  );
}
