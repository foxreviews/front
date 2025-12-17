export default function Footer() {
  return (
    <footer className="bg-[#182B54] text-white">
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
          <h3 className="font-semibold mb-4">À propos de nous</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Plateforme de mise en relation avec des professionnels qualifiés,
            évalués par de vrais clients.
          </p>
        </div>

        {/* COLUMN 2 – Navigation */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="hover:text-orange-500 cursor-pointer">Accueil</li>
            <li className="hover:text-orange-500 cursor-pointer">Catégories</li>
            <li className="hover:text-orange-500 cursor-pointer">Professionnels</li>
            <li className="hover:text-orange-500 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* COLUMN 3 – Infos + icons */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Adresse & Contacts</h3>
          <div className="mx-auto lg:mx-0">
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center justify-center lg:justify-start gap-3">
                <span>📍</span>
                <span>France</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-3">
                <span>📧</span>
                <span>contact@foxreviews.com</span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-3">
                <span>📞</span>
                <span>+33 XX XXX XX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* COLUMN 4 – App store */}
        <div className="space-y-4 mx-auto lg:mx-0 max-w-xs">
          <h3 className="font-semibold mb-4">Abonnez-vous</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            At Vero Eos Et Accusamus Et Iusto Odio Dignissimos Ducimus Qui Blanditiis. Lorem ipsum dolor sit amet, consectetur.
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