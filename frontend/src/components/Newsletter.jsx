/**
 * Newsletter.jsx
 *
 * A simple email subscription form section displayed near the bottom of the homepage.
 * Has two visual states:
 *   1. Default (unsubscribed): Shows a heading, description, email input, and "Subscribe" button.
 *   2. Subscribed: Shows a confirmation message after the user submits their email.
 *
 * Note: This is a frontend-only mock — no actual API call is made.
 * The form just flips the `subscribed` state to true when a non-empty email is submitted.
 */
import { useState } from 'react';

const Newsletter = () => {
  // The email address the user has typed into the input field
  const [email, setEmail] = useState('');
  // Whether the user has already submitted (controls which UI state is shown)
  const [subscribed, setSubscribed] = useState(false);

  // Handle form submission: if email isn't blank, mark as subscribed and clear the input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-[#070404] font-['Outfit'] border-t border-red-950/40 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Never Miss a Deal!
        </h2>
        
        {/* Section description */}
        <p className="text-sm sm:text-base text-slate-400 font-normal max-w-lg mx-auto mb-8">
          Subscribe to get the latest car rental offers, new host additions, and exclusive weekend discounts across India.
        </p>

        {/* --- Conditional Rendering: Subscribed vs. Form --- */}
        {subscribed ? (
          /* Success confirmation badge shown after subscribing */
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-sm font-semibold shadow-lg shadow-red-950/50">
            <span>✓</span> Thank you for subscribing! Check your inbox soon.
          </div>
        ) : (
          /* Email subscription form */
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            {/* Email input field */}
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-5 py-3 text-sm rounded-xl border border-zinc-800 bg-zinc-950/90 focus:bg-zinc-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white placeholder:text-slate-500 transition-all"
            />
            
            {/* Subscribe button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/40 transition-all cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
};

export default Newsletter;
