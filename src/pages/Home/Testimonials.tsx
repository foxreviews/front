export default function Testimonials() {
  return (
    <section
      className="
        relative
        w-full
        py-24
        bg-[url('/assets/testimonial.png')]
        bg-cover
        bg-center
      "
    >
      {/* Overlay clair */}
      <div className="absolute inset-0 bg-white/90" />

      {/* Contenu */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-24">
        <h2
          className="
            text-center
            text-3xl sm:text-4xl lg:text-5xl
            font-bold
            tracking-tight
            text-[#26354e]
          "
        >
          Que disent{" "}
          <span className="text-orange-500">Nos Clients</span>
        </h2>

        <p
          className="
            mt-6
            max-w-3xl
            mx-auto
            text-center
            text-gray-600
          "
        >
          Découvrez les retours d’expérience de nos utilisateurs qui ont trouvé des professionnels
          fiables et qualifiés près de chez eux. Leurs avis reflètent la qualité des services,
          la relation de confiance établie et la satisfaction obtenue après chaque collaboration.
        </p>
      </div>
    </section>
  )
}