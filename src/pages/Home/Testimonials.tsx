export default function Testimonials() {
  return (
    <section className="py-24 relative w-full bg-[url('/assets/testimonial.png')] bg-cover bg-center">
      <div>
       <h2 className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-bold tracking-tight text-[#26354e]">
          What Say {" "}
          <span className="text-orange-500">Our Customers</span>
          <br className="hidden sm:block" />
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-center px-4 sm:px-0">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
        </p>
      </div>
    </section>
  )
}