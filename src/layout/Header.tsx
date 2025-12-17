import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Accueil");
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const links = [
    { label: "Accueil", href: "/" },
    { label: "Catégories", href: "/#reviews" },
    { label: "Villes", href: "/#submit" },
    { label: "Contact", href: "/#contact" },
    { label: "À Propos", href: "/#apropos" },
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

    return (
      <a
        key={link.label}
        href={link.href}
        onClick={() => {
          setActive(link.label);
          setOpen(false);
        }}
        className={`
          block px-6 py-2 cursor-pointer transition-colors
          ${active === link.label ? "text-orange-500 font-bold" : baseColor}
          hover:text-orange-500
        `}
      >
        {link.label}
      </a>
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
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => renderLink(link))}
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
          {links.map((link) => renderLink(link, true))}
        </nav>
      )}
    </header>
  );
}