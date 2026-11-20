import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ownerApi } from '../services/api';
import CITIES from '../data/cities';
import bmwOffer from '../assets/cars/bmw-offer.png';

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
  const { isAuthenticated, isOwner, refreshUser } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [roleLoading, setRoleLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('suv');
  const [seatingCapacity, setSeatingCapacity] = useState('5');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState(CITIES[0]?.value || 'Mumbai');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCTAClick = async () => {
    if (!isAuthenticated) {
      navigate('/login?mode=signup');
      return;
    }
    if (!isOwner) {
      try {
        setRoleLoading(true);
        await ownerApi.changeRole();
        await refreshUser();
        toast.success('You are now a Rydely Host! 🎉');
        setShowForm(true);
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (err) {
        toast.error(err.message || 'Could not upgrade to host');
      } finally {
        setRoleLoading(false);
      }
      return;
    }
    setShowForm(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();

    // Validation
    if (!brand.trim()) return toast.error('Vehicle brand is required');
    if (!model.trim()) return toast.error('Vehicle model is required');
    const currentYear = new Date().getFullYear();
    const numYear = Number(year);
    if (!numYear || numYear < 1990 || numYear > currentYear) {
      return toast.error(`Year must be between 1990 and ${currentYear}`);
    }
    const seats = Number(seatingCapacity);
    if (!seats || seats < 1) return toast.error('Valid seating capacity required');
    const price = Number(pricePerDay);
    if (!price || price <= 0) return toast.error('Price per day must be greater than 0');
    if (!location.trim()) return toast.error('City location is required');
    if (!description.trim()) return toast.error('Vehicle description is required');
    if (!imageFile) return toast.error('Please upload an image for the car');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append(
        'carData',
        JSON.stringify({
          brand: brand.trim(),
          model: model.trim(),
          year: numYear,
          category,
          seating_capacity: seats,
          fuel_type: fuelType,
          transmission,
          pricePerDay: price,
          location,
          description: description.trim(),
        })
      );

      await ownerApi.addCar(fd);
      toast.success('Machine listed successfully! 🚀');

      // Reset form
      setBrand('');
      setModel('');
      setYear('');
      setCategory('suv');
      setSeatingCapacity('5');
      setFuelType('Petrol');
      setTransmission('Automatic');
      setPricePerDay('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      toast.error(err.message || 'Failed to list car');
    } finally {
      setSubmitting(false);
    }
  };

  const ctaButtonText = !isAuthenticated
    ? 'Get started'
    : !isOwner
    ? roleLoading
      ? 'Upgrading...'
      : 'Become a host'
    : 'List your machine';

  return (
    <div className="min-h-screen bg-[#080607] text-white pt-28 pb-20 font-['Outfit']">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-12 pb-20">
        <div
          className="absolute inset-0 pointer-events-none"
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
              <button
                type="button"
                onClick={handleCTAClick}
                disabled={roleLoading}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition hover:bg-red-500 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {ctaButtonText} <span className="ml-2">→</span>
              </button>
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
                src={bmwOffer}
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

      {/* ADD YOUR CAR SECTION (Owner / Revealed) */}
      {(isOwner || showForm) && (
        <section ref={formRef} className="max-w-4xl mx-auto px-5 mb-20 scroll-mt-32">
          <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950/90 border border-red-500/30 shadow-2xl shadow-red-950/20">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400 bg-red-950/60 border border-red-500/30 px-3.5 py-1 rounded-full">
                HOST CONSOLE · ADD VEHICLE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-4 mb-2 tracking-tight">
                List Your Machine
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Provide accurate details and photos to make your vehicle live on Rydely.
              </p>
            </div>

            <form onSubmit={handleSubmitCar} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Brand / Make
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. BMW, Mahindra, Porsche"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. XUV700, 911 Carrera"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Vehicle Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="suv">SUV</option>
                    <option value="mpv">MPV</option>
                    <option value="4x4">4x4</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                {/* Seating Capacity */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Transmission
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Daily Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Price Per Day (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Pickup City Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell renters about features, condition, handling and special notes..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Vehicle Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-3 relative w-44 h-28 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-red-800 disabled:to-rose-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Uploading machine...
                    </>
                  ) : (
                    <>
                      Publish Vehicle Listing 🚀
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

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
            <button
              type="button"
              onClick={handleCTAClick}
              disabled={roleLoading}
              className="inline-flex mt-8 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-zinc-200 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {ctaButtonText} <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListYourCar;
