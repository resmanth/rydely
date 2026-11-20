
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: '💰',
    title: 'Earn from your car',
    text: 'Put your vehicle to work when you are not using it.',
  },
  {
    icon: '🗓️',
    title: 'Choose your availability',
    text: 'Decide when your car can be booked and when it stays with you.',
  },
  {
    icon: '🎯',
    title: 'Set your own price',
    text: 'Choose a daily rental price that makes sense for your vehicle.',
  },
  {
    icon: '📊',
    title: 'Manage in one place',
    text: 'Keep your vehicle details and rental activity organised.',
  },
];

const steps = [
  ['01', 'Tell us about your car', 'Add the make, model, year and other essential vehicle details.'],
  ['02', 'Upload your documents', 'Keep your registration and required vehicle documents ready for review.'],
  ['03', 'Add photos and pricing', 'Show renters your car and choose your rental price and availability.'],
  ['04', 'Publish your listing', 'Review your information and submit your vehicle listing.'],
];

const requirements = [
  'A valid vehicle registration certificate (RC)',
  'A valid insurance document',
  'Clear exterior and interior vehicle photos',
  'Accurate vehicle details and condition',
  'Your preferred rental price and availability',
];

const ListYourCar = () => {
  return (
    <div className="min-h-screen bg-[#080607] text-white pt-28 pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-12 pb-20">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 75% 35%, rgba(220,38,38,.2), transparent 45%), radial-gradient(ellipse at 15% 80%, rgba(127,29,29,.13), transparent 45%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-red-300">
              Rydely host programme
            </span>

            <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.04] tracking-tight">
              Your car has
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">
                more to give.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm sm:text-lg leading-relaxed text-zinc-400">
              Make the most of the time your car spends parked. List it on
              Rydely, choose when it is available and connect with people
              looking for their next drive.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition hover:bg-red-500"
              >
                Get started <span className="ml-2">→</span>
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-5 text-xs text-zinc-500">
              Have your vehicle details and documents ready before you begin.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-red-600/20 blur-[90px]" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-800/80 to-zinc-950 p-5 sm:p-8">
              <img
                src="/src/assets/cars/bmw-offer.png"
                alt="Car available to list on Rydely"
                className="w-full h-64 sm:h-80 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,.6)]"
              />
              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Your vehicle</p>
                  <p className="mt-1 font-bold">Your car. Your terms.</p>
                </div>
                <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-bold text-red-300">
                  Become a host
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-5 mt-8">
        <div className="max-w-2xl mb-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-red-400">Why host with Rydely?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">More flexibility. More control.</h2>
          <p className="mt-3 text-sm text-zinc-500">A hosting experience designed around your vehicle and your schedule.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/40 hover:bg-white/[0.05]">
              <span className="text-3xl">{benefit.icon}</span>
              <h3 className="mt-6 text-lg font-bold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="max-w-7xl mx-auto px-5 mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-red-400">Getting started</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">List your car in four steps.</h2>
          <p className="mt-3 text-sm text-zinc-500">Get your details ready and follow the listing process.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(([number, title, text]) => (
            <div key={number} className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-[#100b0c] p-6">
              <span className="font-mono text-sm text-red-400">{number}</span>
              <div className="my-6 h-px bg-gradient-to-r from-red-500/60 to-transparent" />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="max-w-7xl mx-auto px-5 mt-24">
        <div className="grid lg:grid-cols-2 gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900/90 to-[#10090b] p-7 sm:p-10 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-red-400">Before you begin</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">Get your car listing-ready.</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              A complete and accurate listing helps renters understand your
              vehicle. Keep these details handy before starting.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex mt-7 text-sm font-bold text-red-400 hover:text-red-300"
            >
              Understand the hosting process <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="space-y-3">
            {requirements.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-sm text-red-400">✓</span>
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 mt-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#260b10] to-zinc-950 p-8 sm:p-14 text-center">
          <div className="absolute w-72 h-72 bg-red-600/20 blur-[100px] rounded-full -top-32 left-1/2 -translate-x-1/2" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-red-300">Your next step starts here</p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black">Ready to become a host?</h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-zinc-300">
              Create your account and get ready to share your car with the Rydely community.
            </p>
            <Link
              to="/login?mode=signup"
              className="inline-flex mt-8 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Create your account <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListYourCar;
