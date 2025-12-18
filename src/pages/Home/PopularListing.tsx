export default function PopularListing() {
  return (
    <section className="py-24 px-6 sm:px-12 lg:px-24 relative w-full bg-white">
      <div>
        <h2 className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-bold tracking-tight text-[#26354e]">
          <span className="text-orange-500">Annonces </span>
          les plus populaires
          <br className="hidden sm:block" />
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-center text-gray-600 px-4 sm:px-0">
          Découvrez les annonces les plus consultées et les mieux notées par la
          communauté, mettant en avant des professionnels reconnus pour la qualité
          de leurs services et la satisfaction de leurs clients.
        </p>
      </div>
    </section>
  )
}