export default function Hero() {
  return (
    <section className="px-24 relative w-full bg-[url('/assets/hero-bg.webp')] bg-cover bg-center">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ backgroundColor: "#182B54", opacity: 0.6 }} />

      <div className="relative mx-autopx-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left px-5">

            <h1 className="mt-6 text-6xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
              Trouvez un pro 5
              <span
                aria-hidden="true"
                style={{
                  color: "#FFC107",
                  marginLeft: "6px",
                  fontSize: "1.05em",
                  textShadow: "0 1px 0 rgba(0,0,0,0.08)"
                }}
              >
                ★
              </span>
              <br className="hidden sm:block" />
              sélectionné près de {" "}
              <span className="text-orange-500">chez vous !</span>
              <br className="hidden sm:block" />

            </h1>

            <p className="mt-6 max-w-xl text-lg italic leading-relaxed text-white lg:max-w-none">
              Misez sur la qualité relationnelle et la compétence…
            </p>


          </div>

          {/* RIGHT VISUAL */}
          <div className="relative px-5 mx-auto w-full max-w-lg lg:max-w-none">
            <img
              src="/assets/hero-fox.png"
              alt="Hero Illustration"
              className="w-full h-auto"
              width="100"
              height="100"
            />
          </div>

        </div>
      </div>
    </section>
  )
}