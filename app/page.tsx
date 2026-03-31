'use client';

import { useState, useEffect } from 'react';

/*
 * ============================================================
 *  SETUP INSTRUCTIONS
 * ============================================================
 *
 *  1. Replace your existing page.tsx (or page.js) in app/ with this file
 *
 *  2. Update your .env.local with your Supabase credentials:
 *     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 *  3. Update the SUPABASE CONFIG section below:
 *     - TABLE_NAME: your leads table name
 *     - COLUMN_MAP: map form fields to your actual column names
 *
 *  4. Make sure @supabase/supabase-js is installed:
 *     npm install @supabase/supabase-js
 *
 *  5. Update your layout.tsx:
 *     - Change the <title> to "Smart Retirement MN"
 *     - Remove any default Next.js boilerplate
 *
 *  6. After deploying, install Meta Pixel:
 *     - Add the base pixel code to layout.tsx <head>
 *     - The fbq('track', 'Lead') call is already in the form handler below
 * ============================================================
 */

// ============================================================
//  SUPABASE CONFIG — UPDATE THESE TO MATCH YOUR TABLE
// ============================================================
const TABLE_NAME = 'leads'; // ← Change to your table name

// Map form field names to your Supabase column names
// Left side = form field (don't change), Right side = your column name (change if needed)
const COLUMN_MAP = {
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  state: 'state',
  production: 'production',
  current_imo: 'current_imo',
  source: 'source', // auto-set to 'advisor_recruit'
};
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ---------- TARGET STATES (top of dropdown) ----------
const TARGET_STATES = ['Iowa', 'Minnesota', 'North Dakota', 'South Dakota', 'Wisconsin'];
const OTHER_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Kansas',
  'Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wyoming'
];

const PRODUCTION_OPTIONS = [
  'Just getting started', 'Under $500K', '$500K – $1M',
  '$1M – $3M', '$3M – $5M', '$5M – $10M', '$10M+'
];

export default function AdvisorRecruit() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    state: '', production: '', current_imo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSticky, setShowSticky] = useState(false);

  // Sticky bar logic
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const form = document.getElementById('contact');
      if (!hero || !form) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      const formTop = form.getBoundingClientRect().top;
      setShowSticky(heroBottom < 0 && formTop > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Build the row using your column mapping
      const row: Record<string, string> = {};
      Object.entries(COLUMN_MAP).forEach(([formField, dbColumn]) => {
        if (formField === 'source') {
          row[dbColumn] = 'advisor_recruit';
        } else {
          row[dbColumn] = formData[formField as keyof typeof formData];
        }
      });

      const { error: dbError } = await supabase.from(TABLE_NAME).insert([row]);

      if (dbError) {
        console.error('Supabase error:', dbError);
        setError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Fire Meta Pixel Lead event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
        
        :root {
          --navy: #0f2b3c;
          --navy-mid: #1a3d52;
          --teal: #1a8a7d;
          --teal-light: #22b8a6;
          --gold: #c8965a;
          --gold-light: #dbb07a;
          --cream: #faf8f5;
          --warm-white: #fefdfb;
          --text: #1a2a35;
          --text-mid: #4a5f6d;
          --text-light: #7a8f9d;
          --border: #e2ddd6;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--warm-white); -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { opacity: 0; animation: fadeUp 0.6s ease 0.2s forwards; }
        .fade-2 { opacity: 0; animation: fadeUp 0.6s ease 0.35s forwards; }
        .fade-3 { opacity: 0; animation: fadeUp 0.6s ease 0.5s forwards; }
        .fade-4 { opacity: 0; animation: fadeUp 0.6s ease 0.65s forwards; }
      `}</style>

      {/* ===== HERO ===== */}
      <section id="hero" style={{ background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '80%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(26,138,125,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 80px', position: 'relative', zIndex: 1 }}>
          <div className="fade-1" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--teal-light)', border: '1px solid rgba(34,184,166,0.3)', padding: '8px 18px', borderRadius: 4, marginBottom: 32 }}>
            For Independent FIA Producers
          </div>
          <h1 className="fade-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(34px, 5.2vw, 54px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, maxWidth: 720, marginBottom: 24 }}>
            You Find the Clients. You Close the Business. <em style={{ fontStyle: 'normal', color: 'var(--gold-light)' }}>Why Is Your IMO Cashing the Biggest Check?</em>
          </h1>
          <p className="fade-3" style={{ fontSize: 19, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', maxWidth: 580, marginBottom: 36 }}>
            Going direct means 1% to 2.5% more on every dollar of premium you place. On a $300K case, that&apos;s $3,000 to $7,500 that&apos;s currently going to someone who didn&apos;t sit at that kitchen table with you.
          </p>
          <div className="fade-4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#contact" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, fontSize: 15, padding: '16px 32px', borderRadius: 4, textDecoration: 'none', transition: 'all 0.25s ease' }}>
              Get My Personalized Comp Comparison →
            </a>
            <a href="#math" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 2 }}>
              See the math first
            </a>
          </div>
        </div>
      </section>

      {/* ===== EMOTIONAL TENSION ===== */}
      <section style={{ padding: '80px 40px', background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.35, marginBottom: 28 }}>
            You already know something doesn&apos;t add up.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--text-mid)', marginBottom: 20 }}>
            You drive to the appointment. You sit with the client for two hours. You explain the product, answer every question, calm every fear. You fill out the paperwork, follow up with the carrier, chase down the missing forms. <strong style={{ color: 'var(--text)' }}>You do all of it.</strong>
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--text-mid)', marginBottom: 20 }}>
            And somewhere in a corporate office, someone who has never met your client — who doesn&apos;t know their name, their situation, or what keeps them up at night — takes a cut of your commission. Not for placing the case. Not for finding the client. For <strong style={{ color: 'var(--text)' }}>access</strong>. That&apos;s it. Access you could get directly.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--text-mid)', marginBottom: 0 }}>
            The question isn&apos;t whether you&apos;re good enough to go direct. You already are. The question is how long you&apos;re willing to keep paying a toll on a road you built yourself.
          </p>
          <div style={{ marginTop: 36, padding: '28px 32px', background: 'white', borderRadius: 6, borderLeft: '4px solid var(--gold)', boxShadow: '0 1px 3px rgba(15,43,60,0.06)' }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)', fontWeight: 500, margin: 0 }}>
              Every month you wait is another month of cases where 1–2.5% walks out the door. On a $3M annual book, that&apos;s $2,500 to $6,250 — gone — <em>every single month</em>.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MATH ===== */}
      <section id="math" style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 600, color: 'var(--navy)', marginBottom: 12 }}>Here&apos;s What the Spread Looks Like</h2>
            <p style={{ fontSize: 16, color: 'var(--text-light)' }}>Based on a single $300K FIA placement</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { label: 'Baseline comp increase', number: '+1%', context: 'Starting spread vs. typical IMO', highlight: false },
              { label: 'Per case ($300K)', number: '+$3,000', context: 'Extra on a single placement', highlight: false },
              { label: 'On a $3M annual book', number: '+$30,000', context: 'Per year, at the baseline spread', highlight: true },
            ].map((card, i) => (
              <div key={i} style={{
                background: card.highlight ? 'var(--navy)' : 'var(--cream)',
                borderRadius: 8, padding: '32px 24px', textAlign: 'center',
                border: card.highlight ? '1px solid var(--navy)' : '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: card.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-light)', marginBottom: 10 }}>{card.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: card.highlight ? 'var(--gold-light)' : 'var(--teal)', marginBottom: 6 }}>{card.number}</div>
                <div style={{ fontSize: 13, color: card.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-light)' }}>{card.context}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 24, background: 'linear-gradient(135deg, #f8f4ef 0%, #faf8f5 100%)', borderRadius: 8, border: '1px dashed var(--gold)' }}>
            <p style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              Top producers see spreads up to <strong style={{ color: 'var(--navy)' }}>2.5%</strong> — that&apos;s <strong style={{ color: 'var(--navy)' }}>+$7,500 per case</strong> and up to <strong style={{ color: 'var(--navy)' }}>$75,000 more per year</strong> on a $3M book.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section style={{ padding: '70px 40px', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--teal-light)', marginBottom: 36 }}>
            What advisors say after making the switch
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { quote: "I spent six years paying an override to an IMO that couldn't tell me my own production numbers without a three-day turnaround. Went direct, picked up the phone on day one, and had a real person walk me through an illustration. Should have done this years ago.", attr: '— FIA Producer, Minnesota' },
              { quote: "The comp bump was what got my attention, but the service is what made me stay. I have a dedicated wholesaler who knows my book, knows my clients, and actually answers when I call. That didn't exist at my old IMO.", attr: '— Independent Agent, Wisconsin' },
            ].map((q, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '28px 24px', textAlign: 'left' }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', marginBottom: 14 }}>{q.quote}</p>
                <div style={{ fontSize: 13, color: 'var(--gold-light)', fontWeight: 700 }}>{q.attr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section style={{ padding: '80px 40px', background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 600, color: 'var(--navy)', marginBottom: 12 }}>What Changes When You Go Direct</h2>
            <p style={{ fontSize: 16, color: 'var(--text-mid)' }}>Better comp is just the start.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '💰', title: '1% to 2.5% More Per Case', desc: "Every basis point your IMO was taking goes back to you. Same products, same clients, same work — just more in your pocket where it belongs." },
              { icon: '📞', title: 'A Wholesaler Who Picks Up', desc: "A local, dedicated team that knows your book and answers your calls. Not a 1-800 queue. Not a chatbot. A person who knows FIAs and knows your name." },
              { icon: '✅', title: 'Products That Compete', desc: "A full FIA shelf — accumulation, income, and hybrid. Strong ratings, flexible riders, and a carrier that's actively investing in the independent channel." },
            ].map((card, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 8, padding: '32px 28px', border: '1px solid var(--border)', transition: 'all 0.3s ease' }}>
                <div style={{ width: 44, height: 44, background: 'var(--navy)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 20 }}>{card.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-mid)' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OBJECTION HANDLING ===== */}
      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, color: 'var(--navy)', textAlign: 'center', marginBottom: 44 }}>
            Questions You Might Be Asking
          </h2>
          {[
            { q: "I've been with my IMO for years. Is switching really worth the hassle?", a: "There's no \"switching\" required. You can add a direct carrier appointment alongside your existing IMO relationships. Write business where the comp is best. Most advisors start by moving their highest-volume product to direct and keep everything else in place." },
            { q: "What's the catch? Why would the carrier offer me more?", a: "No catch. When you go through an IMO, the carrier pays a higher total commission — the IMO just keeps the difference. Going direct means the carrier pays less overall and you still earn more. Everyone wins except the middleman." },
            { q: "I'm not doing $3M a year. Is this still worth it?", a: "Yes. The 1% baseline spread applies regardless of volume. On a $1M book, that's still $10,000 more per year. And with dedicated wholesaling support, many advisors see their production increase after going direct — because they have a team that's actually invested in helping them grow." },
            { q: "How long does it take to get appointed?", a: "Most advisors are appointed and writing business within 2–3 weeks. We handle the paperwork. You focus on your clients." },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
                <span style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontSize: 22, marginRight: 4 }}>&ldquo;</span>
                {item.q}
                <span style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontSize: 22, marginLeft: 2 }}>&rdquo;</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-mid)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section id="contact" style={{ padding: '80px 40px', background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {!submitted ? (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3.5vw, 34px)', fontWeight: 600, color: 'var(--navy)', textAlign: 'center', marginBottom: 8 }}>
                See What You&apos;re Missing
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-mid)', textAlign: 'center', marginBottom: 36, lineHeight: 1.6 }}>
                Fill this out and we&apos;ll send you a personalized comp comparison — your current IMO rates versus going direct. Takes 60 seconds.
              </p>
              <div style={{ textAlign: 'center', background: 'var(--navy)', color: 'var(--gold-light)', fontSize: 14, fontWeight: 700, padding: '12px 20px', borderRadius: 6, marginBottom: 32 }}>
                Every month you wait is another month of cases at IMO rates.
              </div>

              {error && (
                <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <FormField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="First name" />
                  <FormField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Last name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                  <FormField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 555-5555" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: 'var(--text-mid)', marginBottom: 5 }}>State</label>
                  <select name="state" value={formData.state} onChange={handleChange} required style={selectStyle}>
                    <option value="">Select your state</option>
                    {TARGET_STATES.map(s => <option key={s}>{s}</option>)}
                    <option disabled>──────────</option>
                    {OTHER_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: 'var(--text-mid)', marginBottom: 5 }}>Annual FIA Production (Approximate)</label>
                  <select name="production" value={formData.production} onChange={handleChange} required style={selectStyle}>
                    <option value="">Select range</option>
                    {PRODUCTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <FormField label="Current IMO / BGA (Optional)" name="current_imo" value={formData.current_imo} onChange={handleChange} placeholder="Who are you currently contracted through?" />

                <button
                  onClick={handleSubmit as any}
                  disabled={submitting}
                  style={{
                    background: submitting ? 'var(--text-mid)' : 'var(--navy)',
                    color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
                    padding: '16px 32px', border: 'none', borderRadius: 5, cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s ease', marginTop: 6,
                  }}
                >
                  {submitting ? 'Submitting...' : 'Get My Comp Comparison →'}
                </button>
                <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
                  Confidential. No spam. We&apos;ll reach out within one business day.
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div style={{ width: 56, height: 56, background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24, color: 'white' }}>✓</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: 'var(--navy)', marginBottom: 10 }}>Your Comparison Is on the Way</h3>
              <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
                We&apos;re pulling together your personalized numbers. Expect to hear from us within one business day — usually sooner.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: '40px 40px 80px', background: 'var(--navy)', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          &copy; 2026 Smart Retirement MN. All rights reserved. For financial professional use only. Not for consumer distribution.
        </p>
      </footer>

      {/* ===== STICKY BAR ===== */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--navy)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        zIndex: 100,
        transform: showSticky ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s ease',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          You could be earning <strong style={{ color: 'var(--gold-light)' }}>$30K–$75K more</strong> per year.
        </p>
        <a href="#contact" style={{
          display: 'inline-block', background: 'var(--gold)', color: 'var(--navy)',
          fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 4,
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          Get My Comp Comparison →
        </a>
      </div>
    </>
  );
}

// ---------- REUSABLE FORM FIELD COMPONENT ----------
function FormField({ label, name, value, onChange, required, placeholder, type = 'text' }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: 'var(--text-mid)', marginBottom: 5 }}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

// ---------- SHARED STYLES ----------
const inputStyle: React.CSSProperties = {
  padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 5,
  fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--text)',
  background: 'white', WebkitAppearance: 'none' as any, outline: 'none', width: '100%',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8f9d' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
};