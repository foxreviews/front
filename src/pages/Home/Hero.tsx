export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
              Trusted Reviews Platform
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
              Discover{" "}
              <span className="text-orange-500">Honest Reviews</span>
              <br className="hidden sm:block" />
              From Real Users
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 lg:max-w-none">
              Fox Reviews helps you make smarter decisions with transparent,
              verified, and community-driven reviews on products, services, and
              companies worldwide.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#reviews"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
              >
                Explore Reviews
              </a>

              <a
                href="#submit"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Submit a Review
              </a>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    4.8 / 5 average rating
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on 120,000+ reviews
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div className="h-3 w-[90%] rounded-full bg-orange-500" />
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div className="h-3 w-[75%] rounded-full bg-orange-400" />
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div className="h-3 w-[60%] rounded-full bg-orange-300" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}