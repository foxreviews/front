import { Clock, FileText, Mail} from "lucide-react";

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

        {/* COLUMN 1 – Contact */}
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

        {/* COLUMN 3 – Abonnez-vous */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Abonnez-vous</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Abonnez-vous pour suivre les dernières analyses, retours d’expérience et évaluations
            sur nos services et plateformes en ligne.
          </p>
        </div>

        {/* COLUMN 4 – Sponsoring & Feedback */}
        <div className="space-y-6 mx-auto lg:mx-0 max-w-xs">

          {/* Feedback Form */}
          <form className="space-y-3 text-sm">
            <h3 className="font-semibold mb-2">Envoyez-nous un message</h3>
            <input
              type="text"
              placeholder="Nom"
              className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="tel"
              placeholder="Numéro (optionnel)"
              className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              placeholder="Message"
              className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition-colors rounded py-2 font-semibold cursor-pointer"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/70">
        © {new Date().getFullYear()} Fox Reviews — Tous droits réservés
      </div>
    </footer>
  );
}
