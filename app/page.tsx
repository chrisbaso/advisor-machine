"use client";

import { useState } from "react";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      first_name: String(formData.get("first_name") || ""),
      last_name: String(formData.get("last_name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      state: String(formData.get("state") || ""),
      production: String(formData.get("production") || ""),
      current_imo: String(formData.get("current_imo") || ""),
      notes: String(formData.get("notes") || ""),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("There was a problem submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-6 inline-block rounded border border-teal-400/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            For Independent Financial Advisors
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Stop Giving Away <span className="text-amber-300">Your Commissions</span> to a Middleman
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Going direct means 1% to 2.5% more on every dollar of premium you place.
            On a $300K case, that is $3,000 to $7,500 back in your pocket.
            How many cases do you write a year?
          </p>

          <a
            href="#contact"
            className="mt-8 inline-block rounded bg-amber-500 px-6 py-4 font-semibold text-slate-900 transition hover:bg-amber-400"
          >
            Find Out What You&apos;re Leaving on the Table →
          </a>
        </div>
      </section>

      <section className="bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            The IMO Tax Nobody Talks About
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Most independent advisors go through an IMO or BGA to access FIA carriers because
            they think they have to. But that access comes at a price — a layer of overrides
            that comes directly out of your compensation.
          </p>

          <div className="mt-10 rounded-lg border border-stone-200 bg-white p-8 text-left shadow-sm">
            <p className="text-lg font-medium text-slate-800">
              Here&apos;s what the comp difference looks like on a single $300K FIA placement:
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded bg-stone-50 p-6 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Baseline Spread
                </div>
                <div className="mt-2 text-3xl font-bold text-teal-700">+1%</div>
              </div>

              <div className="rounded bg-stone-50 p-6 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Per Case ($300K)
                </div>
                <div className="mt-2 text-3xl font-bold text-teal-700">+$3,000</div>
              </div>

              <div className="rounded bg-stone-50 p-6 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  On a $3M Book
                </div>
                <div className="mt-2 text-3xl font-bold text-amber-700">+$30,000/yr</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              What Direct Access Actually Looks Like
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              No layers. No markups. Just you and the carrier.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">1% to 2.5% More on Every Case</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Going direct means a measurable comp increase on every dollar of premium you place.
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">Dedicated Wholesaling Team</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Real people who pick up the phone and help move business.
              </p>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">Competitive FIA Shelf</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Strong accumulation, income, and hybrid products built to compete.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">How Going Direct Works</h2>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-xl font-bold">1. Tell Us About Your Practice</h3>
              <p className="mt-2 text-slate-300">
                Fill out the short form below. We&apos;ll look at production, products, and current setup.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">2. We&apos;ll Run Your Numbers</h3>
              <p className="mt-2 text-slate-300">
                We&apos;ll compare direct comp versus your current IMO arrangement using real numbers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold">3. Get Appointed and Start Writing</h3>
              <p className="mt-2 text-slate-300">
                If it makes sense, paperwork gets handled and you can move quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
            This Is Built for Advisors Who...
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              Are already placing FIAs and know their comp does not reflect their production
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              Want to add annuities at top-tier comp from day one
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              Are tired of generic support when they need help on a case
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              Produce $3M+ in annual FIA premium or are building toward it
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
            Let&apos;s Run Your Numbers
          </h2>
          <p className="mt-3 text-center text-lg text-slate-600">
            Fill out the form below and we&apos;ll show you what going direct could mean for your practice.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="first_name"
                  required
                  placeholder="First name"
                  className="rounded border border-stone-300 bg-stone-50 px-4 py-3"
                />
                <input
                  name="last_name"
                  required
                  placeholder="Last name"
                  className="rounded border border-stone-300 bg-stone-50 px-4 py-3"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="rounded border border-stone-300 bg-stone-50 px-4 py-3"
                />
                <input
                  name="phone"
                  placeholder="(555) 555-5555"
                  className="rounded border border-stone-300 bg-stone-50 px-4 py-3"
                />
              </div>

              <select
                name="state"
                required
                className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3"
              >
                <option value="">Select your state</option>
                <option>Minnesota</option>
                <option>Wisconsin</option>
                <option>Florida</option>
                <option>Texas</option>
                <option>California</option>
                <option>New York</option>
              </select>

              <select
                name="production"
                required
                className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3"
              >
                <option value="">Annual FIA Production (Approximate)</option>
                <option>Just getting started</option>
                <option>Under $500K</option>
                <option>$500K - $1M</option>
                <option>$1M - $3M</option>
                <option>$3M - $5M</option>
                <option>$5M - $10M</option>
                <option>$10M+</option>
              </select>

              <input
                name="current_imo"
                placeholder="Current IMO / BGA (Optional)"
                className="w-full rounded border border-stone-300 bg-stone-50 px-4 py-3"
              />

              <textarea
                name="notes"
                placeholder="Anything else we should know?"
                className="min-h-[100px] w-full rounded border border-stone-300 bg-stone-50 px-4 py-3"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Show Me the Numbers →"}
              </button>

              {error && <p className="text-center text-red-600">{error}</p>}
            </form>
          ) : (
            <div className="mt-10 rounded-lg border border-stone-200 bg-stone-50 p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900">We&apos;ve Got Your Info</h3>
              <p className="mt-3 text-slate-600">
                Thanks for reaching out. We&apos;ll review your information and follow up with next steps.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}