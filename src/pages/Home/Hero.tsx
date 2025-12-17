export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[url('/assets/hero-bg.webp')] bg-cover bg-center px-6 sm:px-12 lg:px-24">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ backgroundColor: "#182B54", opacity: 0.6 }} />

      <div className="relative mx-auto py-20 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left px-5">

            <h2 className="
                    mt-6
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    xl:text-5xl
                    font-bold
                    leading-tight
                    tracking-tight
                    text-white
            ">
              Trouvez un pro 5
              <span
                aria-hidden="true"
                style={{
                  color: "#FFC107",
                  marginLeft: "6px",
                  fontSize: "0.95em",
                  textShadow: "0 1px 0 rgba(0,0,0,0.08)"
                }}
              >
                ★
              </span>
              <br className="hidden lg:block" />
              sélectionné près de{" "}
              <span className="text-orange-500">chez vous !</span>
            </h2>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg italic leading-relaxed text-white">
              Misez sur la qualité relationnelle et la compétence…
            </p>


          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg">
            <img
              src="/assets/hero-fox.png"
              alt="Hero Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  )
}