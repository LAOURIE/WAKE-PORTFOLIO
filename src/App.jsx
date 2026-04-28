import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Portfolio", "Process", "Pricing", "Contact"];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#0a0a0a", color: "#f0ede6", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0a; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #c8f04d; border-radius: 10px; }

        .btn-primary {
          display: inline-block;
          background: #c8f04d;
          color: #0a0a0a;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          padding: 14px 32px;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-primary:hover { background: #d8ff5a; transform: translateY(-2px); }

        .btn-outline {
          display: inline-block;
          background: transparent;
          color: #f0ede6;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          padding: 13px 32px;
          border-radius: 2px;
          border: 1px solid rgba(240,237,230,0.3);
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .btn-outline:hover { border-color: #c8f04d; color: #c8f04d; transform: translateY(-2px); }

        .section { padding: 100px 0; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        .tag {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c8f04d;
          border: 1px solid rgba(200,240,77,0.35);
          padding: 5px 12px;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2px;
        }

        .card {
          background: #111;
          padding: 36px 32px;
          border-top: 2px solid transparent;
          transition: border-color 0.25s, background 0.25s;
        }
        .card:hover { border-color: #c8f04d; background: #161616; }

        .divider { width: 40px; height: 2px; background: #c8f04d; margin: 24px 0; }

        @media (max-width: 768px) {
          .section { padding: 70px 0; }
          .hero-btns { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? "rgba(10,10,10,0.95)" : "transparent",
        borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.06)" : "none",
        backdropFilter: scrollY > 40 ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        padding: "18px 0",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
            WAKE<span style={{ color: "#c8f04d" }}>.</span>STUDIOS
          </span>

          <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                style={{
                  background: "none", border: "none", color: "rgba(240,237,230,0.65)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", cursor: "pointer",
                  transition: "color 0.2s", fontWeight: 400,
                }}
                onMouseEnter={e => e.target.style.color = "#f0ede6"}
                onMouseLeave={e => e.target.style.color = "rgba(240,237,230,0.65)"}
              >
                {link}
              </button>
            ))}
            <button className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.82rem" }}
              onClick={() => scrollTo("contact")}>
              Get Started
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "#f0ede6", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px" }}
            className="hamburger">
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: "24px", height: "1.5px", background: "#f0ede6" }} />
            ))}
          </button>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .hamburger { display: flex !important; }
          }
        `}</style>

        {menuOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px 24px",
          }}>
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase())}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "none", border: "none", color: "#f0ede6",
                  fontFamily: "'Syne', sans-serif", fontSize: "1.1rem",
                  fontWeight: 600, padding: "12px 0", cursor: "pointer",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                {link}
              </button>
            ))}
            <button className="btn-primary" style={{ marginTop: "16px", width: "100%", textAlign: "center" }}
              onClick={() => scrollTo("contact")}>
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "140px 0 100px",
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,240,77,0.08) 0%, transparent 70%), #0a0a0a`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "780px" }}>
            <div className="tag" style={{ animation: "fadeUp 0.6s ease forwards" }}>⚡ 48-Hour Delivery</div>
            <h1 style={{
              fontSize: "clamp(2.8rem, 6vw, 5.2rem)", fontWeight: 800,
              lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "24px",
              animation: "fadeUp 0.7s ease 0.1s both",
            }}>
              High-Converting<br />
              <span style={{ color: "#c8f04d" }}>Websites</span> for<br />
              Coaches & Podcasters
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(240,237,230,0.65)", lineHeight: 1.7,
              maxWidth: "520px", marginBottom: "40px",
              animation: "fadeUp 0.7s ease 0.2s both",
            }}>
              We design clean, conversion-focused websites delivered in 48 hours. No fluff — just results.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: "14px", flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.3s both" }}>
              <button className="btn-primary" onClick={() => scrollTo("contact")}>Get Your Website →</button>
              <button className="btn-outline" onClick={() => scrollTo("portfolio")}>See Examples</button>
            </div>
            <div style={{ display: "flex", gap: "36px", marginTop: "60px", flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.4s both" }}>
              {[["48h", "Delivery"], ["$250", "Flat Rate"], ["100%", "Mobile Ready"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#c8f04d" }}>{num}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(240,237,230,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section" id="about" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <Reveal>
            <div className="tag">Who It's For</div>
            <h2 className="section-title">Built for creators who want<br /><span style={{ color: "#c8f04d" }}>more clients & subscribers</span></h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.55)", maxWidth: "480px", lineHeight: 1.7, marginBottom: "48px" }}>
              Whether you're booking clients or growing an audience — we build the page that does the work for you.
            </p>
          </Reveal>
          <div className="grid-3">
            {[
              { emoji: "🎯", title: "Coaches", desc: "Turn visitors into booked calls with a focused landing page built around your offer." },
              { emoji: "🎙️", title: "Podcasters", desc: "Convert listeners into email subscribers and loyal fans with a clean homepage." },
              { emoji: "💼", title: "Consultants", desc: "Show your offer clearly and capture leads with a no-nonsense professional page." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="card">
                  <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{item.emoji}</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
                  <div className="divider" />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.6)", lineHeight: 1.7, fontSize: "0.95rem" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section" style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            <Reveal>
              <div className="tag">What's Included</div>
              <h2 className="section-title">Everything you need.<br /><span style={{ color: "#c8f04d" }}>Nothing you don't.</span></h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.55)", lineHeight: 1.7 }}>
                A complete, launch-ready website — designed, built, and delivered in under 48 hours.
              </p>
            </Reveal>
            <div>
              {[
                "Custom 1-page website","Mobile optimized design","Conversion-focused layout",
                "Lead capture form","Fast 48-hour delivery","Clean modern UI",
                "Simple edits included","Hosted for free",
              ].map((item, i) => (
                <Reveal key={item} delay={i * 0.06}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.98rem",
                  }}>
                    <span style={{
                      width: "22px", height: "22px", borderRadius: "2px",
                      background: "rgba(200,240,77,0.12)", color: "#c8f04d",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", flexShrink: 0,
                    }}>✓</span>
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section" id="portfolio" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <Reveal>
            <div className="tag">Recent Builds</div>
            <h2 className="section-title" style={{ marginBottom: "48px" }}>See the work in action</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2px" }}>
            {[
              { title: "Coaching Website", desc: "Landing page designed to convert visitors into booked calls.", label: "View Demo →", href: "https://wakestudios.vercel.app/demo-coaching", color: "#c8f04d", icon: "🎯" },
              { title: "Podcast Website", desc: "Simple homepage designed to turn listeners into subscribers.", label: "View Demo →", href: "https://wakestudios.vercel.app/demo-podcast", color: "#7dd3fc", icon: "🎙️" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.15}>
                <div style={{ background: "#111", padding: "44px 36px", borderTop: `2px solid ${item.color}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "20px", right: "24px", fontSize: "3.5rem", opacity: 0.07 }}>{item.icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: item.color, marginBottom: "12px" }}>Demo Build</div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.6)", lineHeight: 1.7, marginBottom: "28px", fontSize: "0.95rem" }}>{item.desc}</p>
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: item.color, textDecoration: "none", fontSize: "0.88rem", letterSpacing: "0.04em", borderBottom: `1px solid ${item.color}`, paddingBottom: "2px", transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >{item.label}</a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process" style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <Reveal>
            <div className="tag">How It Works</div>
            <h2 className="section-title" style={{ marginBottom: "60px" }}>Simple <span style={{ color: "#c8f04d" }}>3-Step</span> Process</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2px" }}>
            {[
              { step: "01", title: "Submit your details", desc: "Fill out a short form — tell us about your offer, audience, and goals." },
              { step: "02", title: "We design your website", desc: "Our team builds your custom, conversion-focused page from scratch." },
              { step: "03", title: "Delivered in 48 hours", desc: "Your site goes live. Ready to capture leads and convert visitors." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.15}>
                <div className="card" style={{ position: "relative", paddingTop: "40px" }}>
                  <div style={{ position: "absolute", top: "24px", right: "28px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "3.5rem", color: "rgba(200,240,77,0.07)", lineHeight: 1, letterSpacing: "-0.04em" }}>{item.step}</div>
                  <div style={{ width: "36px", height: "36px", borderRadius: "2px", background: "rgba(200,240,77,0.1)", border: "1px solid rgba(200,240,77,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8f04d", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Syne', sans-serif", marginBottom: "20px" }}>{item.step}</div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.55)", lineHeight: 1.7, fontSize: "0.92rem" }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <Reveal>
            <div className="tag">Pricing</div>
            <h2 className="section-title" style={{ marginBottom: "8px" }}>Starter Offer</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.5)", marginBottom: "40px" }}>One clear price. No surprises.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: "#111", border: "1px solid rgba(200,240,77,0.25)", padding: "48px 44px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #c8f04d, rgba(200,240,77,0.3))" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.5)", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>48-Hour Website</div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Complete Landing Page</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#c8f04d", lineHeight: 1 }}>$250</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.4)", fontSize: "0.8rem" }}>one-time</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "36px" }}>
                {["1 page website","Mobile optimized","Lead capture","Fast delivery","Free hosting","Simple edits"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(240,237,230,0.7)" }}>
                    <span style={{ color: "#c8f04d", fontSize: "0.8rem" }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: "100%", textAlign: "center", padding: "16px" }} onClick={() => scrollTo("contact")}>
                Get Started — $250
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "120px 0", background: `radial-gradient(ellipse 70% 80% at 50% 50%, rgba(200,240,77,0.07) 0%, transparent 70%), #0d0d0d`, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <div className="tag" style={{ margin: "0 auto 20px" }}>Ready?</div>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              Get your website live<br /><span style={{ color: "#c8f04d" }}>in 48 hours</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.55)", maxWidth: "440px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              We build clean, conversion-focused websites for coaches and podcasters.
            </p>
            <button className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }} onClick={() => scrollTo("contact")}>
              Start Your Website →
            </button>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ maxWidth: "580px" }}>
          <Reveal>
            <div className="tag">Contact</div>
            <h2 className="section-title" style={{ marginBottom: "8px" }}>Let's build your site</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.5)", marginBottom: "40px" }}>
              Reach out and we'll get started within 24 hours.
            </p>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
          <Reveal delay={0.2}>
            <div style={{ marginTop: "36px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.07)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(240,237,230,0.5)" }}>
              <a href="mailto:wakestudios@proton.me" style={{ color: "#c8f04d", textDecoration: "none" }}>📧 wakestudios@proton.me</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 0", background: "#080808" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>WAKE<span style={{ color: "#c8f04d" }}>.</span>STUDIOS</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(240,237,230,0.3)" }}>© {new Date().getFullYear()} Wake Studios. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website Request from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nWebsite Type: ${form.type}\n\n${form.message}`);
    window.location.href = `mailto:wakestudios@proton.me?subject=${subject}&body=${body}`;
    setSent(true);
  };
  const inputStyle = {
    width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px", padding: "14px 16px", color: "#f0ede6",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s",
  };
  if (sent) return (
    <div style={{ background: "rgba(200,240,77,0.07)", border: "1px solid rgba(200,240,77,0.25)", padding: "32px", textAlign: "center", borderRadius: "2px" }}>
      <div style={{ fontSize: "2rem", marginBottom: "12px" }}>✅</div>
      <h3 style={{ fontWeight: 700, marginBottom: "8px" }}>Request sent!</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,237,230,0.6)" }}>We'll get back to you within 24 hours.</p>
    </div>
  );
  return (
    <form onSubmit={submit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <input name="name" value={form.name} onChange={handle} placeholder="Your name" required style={inputStyle} onFocus={e => e.target.style.borderColor = "#c8f04d"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
        <input name="email" type="email" value={form.email} onChange={handle} placeholder="Your email" required style={inputStyle} onFocus={e => e.target.style.borderColor = "#c8f04d"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>
      <select name="type" value={form.type} onChange={handle} required style={{ ...inputStyle, marginBottom: "12px", appearance: "none" }} onFocus={e => e.target.style.borderColor = "#c8f04d"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}>
        <option value="" disabled>What type of site do you need?</option>
        <option value="Coaching Website">Coaching Website</option>
        <option value="Podcast Website">Podcast Website</option>
        <option value="Consultant Website">Consultant Website</option>
        <option value="Other">Other</option>
      </select>
      <textarea name="message" value={form.message} onChange={handle} rows={4} placeholder="Tell us about your offer, audience, and any details..." style={{ ...inputStyle, resize: "vertical", marginBottom: "16px" }} onFocus={e => e.target.style.borderColor = "#c8f04d"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      <button type="submit" className="btn-primary" style={{ width: "100%", textAlign: "center", padding: "16px", fontSize: "1rem" }}>Send Request →</button>
    </form>
  );
}
