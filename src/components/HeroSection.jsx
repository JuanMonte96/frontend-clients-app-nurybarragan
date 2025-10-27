import classImg from '../assets/nurybarragan42.jpg';

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-bg)] pt-28">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-[var(--color-text)]">
            Vivir en salud plena
          </h1>
          <p className="max-w-2xl mb-6 font-light text-[var(--color-text)] lg:mb-8 md:text-lg lg:text-xl">
            Transmitir a cada persona a cada individuo mi saber mi pasión por la danza, por el deporte, mi folclore tan rico y tan variado, mi cultura en general. Es una misión, un compromiso que debo cumplir despues de 25 años de experiencia profesional.
          </p>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex ">
          <img
            src={classImg}
            alt="hero image"
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
