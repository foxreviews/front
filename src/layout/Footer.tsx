import { Clock, FileText, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {

  const iconClass = "w-4 h-4";

  return (
    <footer className="bg-[#242F3E] text-white">
      {/* Main footer */}
      <div className="
            max-w-7xl mx-auto
            px-6
            py-14
            grid
            grid-cols-1
            gap-12
            sm:grid-cols-2
            lg:grid-cols-4
            text-center
            lg:text-left
      ">


        {/* COLUMN 1 – Logo / description */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul>
            <li className="flex items-center gap-2 mb-5 text-white/80">
              <Clock className={iconClass} />
              <span>9h - 18h, Lundi - Vendredi</span>
            </li>
            <li className="flex items-center gap-2 mb-5 text-white/80">
              <Mail className={iconClass} />
             <a href="mailto:contact@foxreviews.com">contact@foxreviews.com</a>
            </li>
            <li className="flex items-center gap-2 mb-5 text-white/80">
              <FileText className={iconClass} />
              <a href="#contact">Formulaire de contact</a>
            </li>
          </ul>
        </div>

        {/* COLUMN 2 – Navigation */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="hover:text-orange-500 cursor-pointer">Accueil</li>
            <li className="hover:text-orange-500 cursor-pointer">Catégories</li>
            <li className="hover:text-orange-500 cursor-pointer">Villes</li>
            <li className="hover:text-orange-500 cursor-pointer">Contact</li>
            <li className="hover:text-orange-500 cursor-pointer">À Propos</li>
          </ul>
        </div>

        {/* COLUMN 3 – Infos + icons */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Adresse & Contacts</h3>
          <div className="mx-auto lg:mx-0">
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center justify-center lg:justify-start gap-3">
                <MapPin className={iconClass} />
                <span>France</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-3">
                <Phone className={iconClass} />
                <span>+33 XX XXX XX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COLUMN 4 – App store */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Abonnez-vous</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Abonnez-vous pour suivre les dernières analyses, retours d’expérience et évaluations
            sur nos services et plateformes en ligne. 
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/70">
        © {new Date().getFullYear()} Fox Reviews — Tous droits réservés
      </div>
    </footer>
  )
}