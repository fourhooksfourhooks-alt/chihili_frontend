import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8f4] text-[#3b1519]">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(203,3,66,0.14),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(170,7,58,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(250,232,220,0.65))]" />
        <div className="absolute left-0 top-0 h-40 w-40 border-l border-t border-[#cb0342]/20" />
        <div className="absolute bottom-0 right-0 h-40 w-40 border-b border-r border-[#cb0342]/20" />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_18px_50px_rgba(131,10,12,0.14)]">
            <Image
              src="/chihiliLogo.png"
              alt="Chihili"
              width={72}
              height={72}
              priority
              className="h-16 w-16 object-contain"
            />
          </div>

          <p className="mb-4 font-lato text-sm font-bold uppercase tracking-[0.28em] text-[#cb0342]">
            Chihili
          </p>
          <h1 className="font-crimson-pro text-5xl font-bold leading-tight text-[#540608] sm:text-6xl lg:text-7xl">
            Coming Soon
          </h1>
          <p className="mt-6 max-w-2xl font-lato text-base leading-8 text-[#6f3732] sm:text-lg">
            We are preparing a refined Odia fashion experience for you. The
            user panel will be available shortly.
          </p>

          <div className="mt-10 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-[#cb0342]/40 to-transparent" />
          <p className="mt-8 font-dancing-script text-3xl text-[#830a0c]">
            Stay tuned
          </p>
        </div>
      </section>
    </main>
  );
}
