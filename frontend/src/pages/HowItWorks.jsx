
import { useState } from 'react';
import { Link } from 'react-router-dom';

const renterSteps = [
  {
    number: '01',
    icon: '🔎',
    title: 'Find your ride',
    text: 'Explore cars by city, category, price and features. Choose the vehicle that fits your journey.',
  },
  {
    number: '02',
    icon: '🪪',
    title: 'Get verified',
    text: 'Complete the required identity and driving licence verification before your booking.',
  },
  {
    number: '03',
    icon: '🔑',
    title: 'Pick up your car',
    text: 'Choose an available pickup or delivery option and review the vehicle condition with the host.',
  },
  {
    number: '04',
    icon: '🛣️',
    title: 'Enjoy the drive',
    text: 'Hit the road, follow the rental terms and return the car at the agreed time and location.',
  },
];

const hostSteps = [
  {
    number: '01',
    icon: '🚘',
    title: 'Add your vehicle',
    text: 'Share your car details, registration information and clear photos so renters know what to expect.',
  },
  {
    number: '02',
    icon: '💸',
    title: 'Set your price',
    text: 'Choose your daily rental price, availability and preferred pickup arrangements.',
  },
  {
    number: '03',
    icon: '🤝',
    title: 'Connect with renters',
    text: 'Review booking requests and coordinate a smooth handover with verified renters.',
  },
  {
    number: '04',
    icon: '📈',
    title: 'Earn from your car',
    text: 'Make your vehicle work for you whenever it is available. Keep track of your listings and bookings.',
  },
];

const faqs = [
  {
    q: 'How do I book a car?',
    a: 'Browse the available cars, open the vehicle you like, select your trip dates and follow the booking process.',
  },
  {
    q: 'Can I choose where to pick up the car?',
    a: 'Pickup and delivery options depend on the individual vehicle listing. Check the details before booking.',
  },
  {
    q: 'How do I list my car?',
    a: 'Visit the List Your Car page, review the requirements and follow the listing process.',
  },
  {
    q: 'Can I control when my car is available?',
    a: 'Yes. Vehicle availability should be managed through the dates and availability options provided for your listing.',
  },
  {
    q: 'Where can I get help?',
    a: 'Visit our Contact page for support with bookings, listings or other questions.',
  },
];

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('renter');
  const [openFaq, setOpenFaq] = useState(0);

  const steps = activeTab === 'renter' ? renterSteps : hostSteps;

  return (
    <div className="min-h-screen bg-[#080607] text-white pt-28 pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,.22), transparent 60%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-red-300">
            The Rydely experience
          </span>

          <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            Your journey.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-500 to-red-600">
              Your way.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-lg leading-relaxed text-zinc-400">
            A simpler way to share cars. Find a ride for your next adventure
            or turn your parked car into an opportunity.
          </p>

          <div className="mt-9 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            <button
              onClick={() => setActiveTab('renter')}
              className={`rounded-xl px-5 sm:px-8 py-3 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'renter'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              I want to rent
            </button>
            <button
              onClick={() => setActiveTab('host')}
              className={`rounded-xl px-5 sm:px-8 py-3 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'host'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              I want to host
            </button>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-red-400 font-bold">
              {activeTab === 'renter' ? 'For renters' : 'For car owners'}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
              {activeTab === 'renter'
                ? 'Four steps to your next drive.'
                : 'Four steps to start hosting.'}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-zinc-500">
            {activeTab === 'renter'
              ? 'From discovering a car to getting behind the wheel.'
              : 'From creating your listing to managing your rentals.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-[#100b0c] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40"
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{step.icon}</span>
                <span className="font-mono text-xs text-red-400/80">
                  {step.number}
                </span>
              </div>
              <div className="mt-12">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {step.text}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="max-w-7xl mx-auto px-5 mt-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            ['01', 'More choice', 'Explore different cars for different kinds of journeys.'],
            ['02', 'More control', 'Choose the vehicle, dates and arrangements that work for you.'],
            ['03', 'One platform', 'Discover, book and manage your car-sharing experience in one place.'],
          ].map(([number, title, text]) => (
            <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-xs font-mono text-red-400">{number}</span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-5 mt-24">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-red-400">Need clarity?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                <span className={`text-xl text-red-400 transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openFaq === index && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 mt-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#250b10] to-zinc-950 px-7 py-12 sm:px-12 sm:py-16 text-center">
          <div className="absolute w-72 h-72 rounded-full bg-red-600/20 blur-[100px] -top-32 left-1/2 -translate-x-1/2" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-red-300">Make your move</p>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black">Ready to get going?</h2>
            <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-zinc-300">
              Find your next ride or share your car with the Rydely community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/cars" className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-black hover:bg-zinc-200 transition">
                Explore cars
              </Link>
              <Link to="/offer-ride" className="rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-red-500 transition">
                List your car
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
