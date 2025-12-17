export default function PopularCategories() {
  return (
    <section className="relative w-full py-24 px-6 lg:px-24 bg-[url('/assets/bg-simple-2.jpg')] bg-cover bg-center">

      <div className="absolute inset-0 bg-[#182B54] opacity-60 z-10"></div>

      <div className="relative z-20 max-w-7xl mx-auto text-center">
        <h2 className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-bold tracking-tight text-white">
          Most Popular{" "}
          <span className="text-orange-500">Categories</span>
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-center text-white px-4 sm:px-0">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
          praesentium voluptatum deleniti atque corrupti quos dolores et quas
          molestias excepturi
        </p>
      </div>
    </section>
  )
}
