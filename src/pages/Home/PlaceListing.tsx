export default function PlaceListing() {
  return (
    <section className="py-24 relative w-full bg-white">
      <div>
        <h2 className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-bold tracking-tight text-[#26354e]">
          Liste des meilleurs {" "}
          <span className="text-orange-500">lieux</span>
          <br className="hidden sm:block" />
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-center text-gray-600 px-4 sm:px-0">
          Accédez aux lieux les plus appréciés par notre communauté et faites votre choix
          en toute confiance grâce à des avis authentiques et transparents.
        </p>
      </div>
    </section>
  )
}