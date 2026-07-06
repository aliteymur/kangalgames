import { useEffect, useState } from "react";
import { KangalEmblem, Wordmark, LogoLockup } from "./Logo.jsx";
import GuardianGame from "./GuardianGame.jsx";
import useReveal from "./useReveal.js";

const FOCUS = [
  {
    icon: <PhoneIcon />,
    title: "Mobile Games",
    desc: "Where we start. Handheld-first titles built for tight sessions, silky controls and depth that rewards mastery.",
    stage: ["In production", "now"],
  },
  {
    icon: <ConsoleIcon />,
    title: "AA Titles",
    desc: "Our core ambition: focused, high-craft games with the polish of a big studio and the soul of an independent one.",
    stage: ["Building toward", "building"],
  },
  {
    icon: <StarIcon />,
    title: "AAA Worlds",
    desc: "The long game. As the pack grows, so does our scope — original worlds built to stand beside the greats.",
    stage: ["Future vision", "future"],
  },
];

const VALUES = [
  {
    icon: <ShieldIcon />,
    title: "Guardian craft",
    desc: "The Kangal protects the flock. We protect the things that matter: the player’s time, trust and joy.",
  },
  {
    icon: <FlameIcon />,
    title: "Bold by default",
    desc: "We chase ideas worth making, not safe ones. Distinct art directions, honest mechanics, real stakes.",
  },
  {
    icon: <GemIcon />,
    title: "Polish obsessed",
    desc: "Feel first. A jump, a tap, a transition — if it doesn’t feel right, it isn’t done.",
  },
  {
    icon: <HeartIcon />,
    title: "Player-first, always",
    desc: "No dark patterns, no manipulative loops. Games that respect the people who play them.",
  },
];

const ROADMAP = [
  {
    n: "01",
    when: "2026",
    title: "The studio is founded",
    desc: "Kangal Games is born — an independent studio inspired by the loyal, fearless Anatolian Kangal.",
    active: true,
  },
  {
    n: "02",
    when: "In progress",
    title: "First mobile title in development",
    desc: "Our debut game is taking shape: a mobile-first experience built to prove our craft and our feel.",
    active: true,
  },
  {
    n: "03",
    when: "Next",
    title: "Growing the pack",
    desc: "Bringing on artists, engineers and designers who share the obsession with quality.",
  },
  {
    n: "04",
    when: "Beyond",
    title: "AA and, one day, AAA",
    desc: "Scaling from focused AA releases toward original, large-scale worlds of our own.",
  },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Falls back to the vector lockup until you add public/logo.png
  const [logoOk, setLogoOk] = useState(true);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* NAV */}
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <a href="#top" onClick={close} aria-label="Kangal Games home">
            {logoOk ? (
              <img
                src="/logo.png"
                alt="Kangal Games"
                className="nav-logo"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <LogoLockup emblemSize={42} />
            )}
          </a>
          <button
            className="nav-toggle"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#studio" onClick={close}>
              Studio
            </a>
            <a href="#craft" onClick={close}>
              What we make
            </a>
            <a href="#demo" onClick={close}>
              Demo
            </a>
            <a href="#roadmap" onClick={close}>
              Roadmap
            </a>
            <a href="#contact" onClick={close} className="btn btn--primary" style={{color:"black"}}>
              Get in touch
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="hero-badge reveal in">
                <span className="dot" /> Independent game studio · Málaga TechPark · Spain
              </span>
              <h1 className="reveal in">
                Loyal to the craft.
                <br />
                <span className="gradient-text">Fearless</span> in the making.
              </h1>
              <p className="sub reveal in d1">
                Kangal Games is a new independent studio building bold,
                high-craft games — starting on mobile, with our sights set on AA
                and beyond. Named for the Anatolian Kangal: strong, loyal,
                unshakeable.
              </p>
              <div className="hero-cta reveal in d2">
                <a href="#craft" className="btn btn--primary">
                  See what we’re building <Arrow />
                </a>
                <a href="#studio" className="btn btn--ghost">
                  About the studio
                </a>
              </div>
              <div className="hero-stats reveal in d3">
                <div className="s">
                  <b>2026</b>
                  <span>Founded</span>
                </div>
                <div className="s">
                  <b>Mobile-first</b>
                  <span>Debut title</span>
                </div>
                <div className="s">
                  <b>AA → AAA</b>
                  <span>The ambition</span>
                </div>
              </div>
            </div>
            <div className="hero-emblem reveal in">
              {/* To use your official logo art instead of this vector emblem,
                  drop it in /public as logo.png and swap this for:
                  <img src="/logo.png" alt="Kangal Games" style={{maxWidth:'100%'}} /> */}
               <img src="/kangal_main_logo.png" alt="Kangal Games" style={{maxWidth:'100%'}} />
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll</span>
            <span className="line" />
          </div>
        </section>

        {/* STRIP */}
        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            <StripItems />
            <StripItems />
          </div>
        </div>

        {/* STUDIO */}
        <section id="studio" className="section">
          <div className="container about-grid">
            <div className="reveal">
              <span className="eyebrow">The studio</span>
              <h2 className="section-title">
                A young studio with an old spirit.
              </h2>
              <p>
                Kangal Games takes its name from the{" "}
                <strong className="text-tan">Anatolian Kangal</strong> — the
                guardian dog of the Turkish highlands, known for its loyalty,
                calm strength and refusal to back down. That’s the temperament
                we’re building the studio around.
              </p>
              <p>
                We’re independent and early. We don’t have a shipped game yet —
                and we’re not going to pretend otherwise. What we have is a
                clear direction: make games with real craft, treat players with
                respect, and grow deliberately from mobile toward AA and, in
                time, AAA.
              </p>
            </div>
            <div className="about-card reveal d1">
              <p className="quote">
                “We’d rather make one game that feels unmistakably ours than ten
                that feel like everyone else’s.”
              </p>
              <div className="who">— The Kangal Games team</div>
            </div>
          </div>
        </section>

        {/* CRAFT / WHAT WE MAKE */}
        <section id="craft" className="section">
          <div className="container">
            <div className="reveal">
              <span className="eyebrow">What we make</span>
              <h2 className="section-title">
                From your pocket to the big screen.
              </h2>
              <p className="section-lead">
                A deliberate path. We start where we can move fast and prove our
                feel — then scale our ambition as the pack grows.
              </p>
            </div>
            <div className="cards">
              {FOCUS.map((f, i) => (
                <article key={f.title} className={`card reveal d${i}`}>
                  <div className="ico">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className={`stage ${f.stage[1]}`}>{f.stage[0]}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO GAME */}
        <section id="demo" className="section">
          <div className="container">
            <div className="reveal">
              <span className="eyebrow">Playable demo</span>
              <h2 className="section-title">Feel it, don’t just read it.</h2>
              <p className="section-lead">
                A tiny browser tech demo — no download, no sign-up. Guard the
                moonlit steppe as the Kangal and hold back the wolves. It’s a
                small taste of the game feel we obsess over.
              </p>
            </div>
            <div className="reveal d1" style={{ marginTop: 40 }}>
              <GuardianGame />
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section id="roadmap" className="section">
          <div className="container">
            <div className="reveal">
              <span className="eyebrow">Where we’re headed</span>
              <h2 className="section-title">The roadmap.</h2>
              <p className="section-lead">
                Honest about today, clear about tomorrow.
              </p>
            </div>
            <div className="roadmap">
              <div className="road-line" aria-hidden="true" />
              {ROADMAP.map((r) => (
                <div
                  key={r.n}
                  className={`road-item reveal ${r.active ? "active" : ""}`}
                >
                  <div className="road-dot">{r.n}</div>
                  <div>
                    <div className="when">{r.when}</div>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section id="values" className="section">
          <div className="container">
            <div className="reveal">
              <span className="eyebrow">What we believe</span>
              <h2 className="section-title">The Kangal code.</h2>
            </div>
            <div className="cards">
              {VALUES.map((v, i) => (
                <article key={v.title} className={`card reveal d${i % 3}`}>
                  <div className="ico">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / CTA */}
        <section id="contact" className="section">
          <div className="container">
            <div className="cta reveal">
              <span className="eyebrow" style={{ justifyContent: "center" }}>
                Join the pack
              </span>
              <h2>Let’s build something worth playing.</h2>
              <p>
                Publishers, collaborators, future teammates, or players who just
                want to follow along — we’d love to hear from you.
              </p>
              <div className="cta-actions">
                <a
                  href="mailto:hello@kangalgames.com"
                  className="btn btn--primary"
                >
                  hello@kangalgames.com
                </a>
                <a href="#studio" className="btn btn--ghost">
                  Learn more
                </a>
              </div>
              {/*}
              <div className="socials">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="X / Twitter"
                >
                  <XIcon />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="LinkedIn"
                >
                  <InIcon />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Discord"
                >
                  <DiscordIcon />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Instagram"
                >
                  <IgIcon />
                </a>
              </div>
                */}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          {logoOk ? (
            <img
              src="/logo.png"
              alt="Kangal Games"
              className="nav-logo"
              onError={() => setLogoOk(false)}
            />
          ) : (
            <LogoLockup emblemSize={42} />
          )}
          <nav className="footer-nav">
            <a href="#studio">Studio</a>
            <a href="#craft">What we make</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#contact">Contact</a>
          </nav>
          <span className="muted">
            © {new Date().getFullYear()} Kangal Games. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
}

function StripItems() {
  const items = [
    "Independent studio",
    "Mobile-first",
    "AA craft",
    "AAA ambition",
    "Player-first",
    "Made in Spain",
  ];
  return (
    <>
      {items.map((t, i) => (
        <span key={i}>
          {t} <b>·</b>
        </span>
      ))}
    </>
  );
}

/* ---------- inline icons (stroke, currentColor) ---------- */
const S = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
function Arrow() {
  return (
    <svg {...S} width={18} height={18} style={{ color: "inherit" }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  );
}
function ConsoleIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7 11v2M6 12h2M15.5 11.5h.01M18 13.5h.01" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.6 1.1-6L3.4 9.4l6-.8z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <path d="M12 3c1 3-2 4-2 7a2 2 0 104 0c0-1 .5-1.5 1-2 1.5 2 2 3.5 2 5a5 5 0 11-10 0c0-4 3-6 5-10z" />
    </svg>
  );
}
function GemIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <path d="M6 4h12l3 5-9 11L3 9z" />
      <path d="M3 9h18M9 4l-3 5 6 11 6-11-3-5" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg {...S} style={{ color: "var(--tan)" }}>
      <path d="M12 20s-7-4.5-9-9a4.5 4.5 0 018-3 4.5 4.5 0 018 3c-2 4.5-9 9-9 9z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg {...S} width={19} height={19}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}
function InIcon() {
  return (
    <svg {...S} width={19} height={19}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg {...S} width={19} height={19}>
      <path d="M7 8c3-1.5 7-1.5 10 0M7 16c3 1.5 7 1.5 10 0M8 9l-1.5 7M16 9l1.5 7" />
      <circle cx="9.5" cy="12" r="1" />
      <circle cx="14.5" cy="12" r="1" />
    </svg>
  );
}
function IgIcon() {
  return (
    <svg {...S} width={19} height={19}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7v.01" />
    </svg>
  );
}
