import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Accueil");
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const publicLinks = [
    { label: "Accueil", href: "/" },
    { label: "Catégories", href: "/categories" },
    { label: "Sous-catégories", href: "/sous-categories" },
    { label: "Villes", href: "/villes" },
    { label: "Contact", href: "/#contact" },
  ];

  const clientLinks = [
    { label: "Dashboard", href: "/client/dashboard" },
    { label: "Mon Entreprise", href: "/client/entreprise" },
    { label: "Mes Avis", href: "/client/upload-avis" },
    { label: "Facturation", href: "/client/billing" },
  ];

  const authLinks = [
    { label: "Connexion", href: "/login" },
    { label: "Inscription", href: "/register" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** 
   * Header est "solid" si :
   * - pas sur la home
   * - OU scrollé
   */
  const isSolidHeader = !isHome || scrolled;

  const renderLink = (
    link: { label: string; href: string },
    isMobile = false
  ) => {
    const baseColor = isMobile
      ? "text-gray-700"
      : isSolidHeader
      ? "text-gray-700"
      : "text-white";

    const isExternal = link.href.startsWith("http");

    return (
      <a
        key={link.label}
        href={link.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={() => {
          setActive(link.label);
          setOpen(false);
        }}
        className={`
          block px-6 py-2 cursor-pointer transition-colors
          ${active === link.label || pathname === link.href ? "text-orange-500 font-bold" : baseColor}
          hover:text-orange-500
        `}
      >
        {link.label}
      </a>
    );
  };

  const renderDropdown = (
    label: string,
    links: { label: string; href: string }[],
    isMobile = false
  ) => {
    const baseColor = isMobile
      ? "text-gray-700"
      : isSolidHeader
      ? "text-gray-700"
      : "text-white";

    if (isMobile) {
      // Mobile: Simple list
      return (
        <div key={label}>
          <div className="px-6 py-2 font-bold text-gray-900 border-t">{label}</div>
          {links.map((link) => renderLink(link, true))}
        </div>
      );
    }

    // Desktop: Dropdown
    const isOpen = dropdownOpen === label;
    
    return (
      <div
        key={label}
        className="relative"
        onMouseEnter={() => setDropdownOpen(label)}
        onMouseLeave={() => setDropdownOpen(null)}
      >
        <button
          className={`
            px-6 py-2 cursor-pointer transition-colors flex items-center gap-2
            ${baseColor} hover:text-orange-500
          `}
        >
          {label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-lg py-2 z-50">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActive(link.label)}
                className="block px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-colors duration-300
        ${isSolidHeader ? "bg-white shadow-md" : "bg-transparent"}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <a href="/" className="inline-block">
          <img
            src="/assets/hero-fox.png"
            alt="FoxReviews Logo"
            className={`
              h-10 sm:h-12 object-contain transition-all duration-300
              ${isSolidHeader ? "w-10 sm:w-12" : "w-12 sm:w-16"}
            `}
          />
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-2">
          {publicLinks.map((link) => renderLink(link))}
          
          {isAuthenticated ? (
            renderDropdown("Espace Client", clientLinks)
          ) : (
            renderDropdown("Connexion", authLinks)
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className={`
            md:hidden transition-colors duration-300 text-2xl
            ${isSolidHeader ? "text-gray-700" : "text-white"}
          `}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-white shadow-lg">
          {publicLinks.map((link) => renderLink(link, true))}
          
          {isAuthenticated ? (
            renderDropdown("Espace Client", clientLinks, true)
          ) : (
            renderDropdown("Connexion", authLinks, true)
          )}
        </nav>
      )}
    </header>
  );
}