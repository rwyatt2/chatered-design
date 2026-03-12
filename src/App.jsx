import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- STYLES & TOKENS ---
// Styles moved to index.css
const globalStyles = `

  :root {
    /* 2-Color Print Foundation */
    --paper: #EFEFE9;
    --ink: #0A0A0A;
    --accent: #FF3B00; /* Electric Vermilion */
  }

  body {
    background-color: var(--paper);
    color: var(--ink);
    font-family: 'Archivo', -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  .film-grain {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 9999;
    pointer-events: none;
    background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
    opacity: 0.08;
    mix-blend-mode: multiply;
  }

  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .neo-grotesque { font-family: 'Archivo', sans-serif; letter-spacing: -0.05em; }

  /* Brutalist Elements */
  .tech-border { border: 2px solid var(--ink); }
  .tech-border-b { border-bottom: 2px solid var(--ink); }
  
  /* Physical Shadows */
  .tech-shadow {
    box-shadow: 6px 6px 0px 0px var(--ink);
    transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tech-shadow:hover {
    box-shadow: 8px 8px 0px 0px var(--accent);
    transform: translate(-2px, -2px);
    border-color: var(--accent);
  }

  .tech-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border: 2px solid var(--ink);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.05em;
    background: #fff;
  }
  .tech-badge-accent { background: var(--accent); color: white; border-color: var(--accent); }
  .tech-badge-black { background: var(--ink); color: var(--paper); }

  /* Heavy Mechanical Buttons */
  .tech-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: var(--ink);
    color: var(--paper);
    border: 2px solid var(--ink);
    padding: 16px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-decoration: none;
    box-shadow: 4px 4px 0px 0px var(--accent);
    transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tech-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 6px 6px 0px 0px var(--ink);
    transform: translate(-2px, -2px);
  }
  .tech-btn:active {
    box-shadow: 0px 0px 0px 0px var(--ink) !important;
    transform: translate(4px, 4px) !important;
    transition: all 0.05s ease;
  }
  
  .tech-btn-outline {
    background: var(--paper);
    color: var(--ink);
    box-shadow: 4px 4px 0px 0px var(--ink);
  }
  .tech-btn-outline:hover {
    background: #fff;
    box-shadow: 6px 6px 0px 0px var(--accent);
    border-color: var(--accent);
    color: var(--accent);
  }

  .tech-input {
    width: 100%;
    background: #fff;
    border: 2px solid var(--ink);
    padding: 16px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
  }
  .tech-input:focus {
    border-color: var(--accent);
  }

  .blinking-cursor {
    display: inline-block;
    width: 10px;
    height: 18px;
    background-color: var(--ink);
    animation: blink 1s step-end infinite;
    vertical-align: middle;
    margin-left: 4px;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* AI Texture: Hatched Pattern */
  .hatched-bg {
    background-color: var(--paper);
    background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(10, 10, 10, 0.08) 4px, rgba(10, 10, 10, 0.08) 5px);
  }

  /* Structural Grid Lines */
  .grid-col-line {
    border-left: 1px solid rgba(10, 10, 10, 0.08);
    height: 100%;
  }

  ::selection { background: var(--accent); color: var(--paper); }
`;

// --- STRUCTURAL COMPONENTS ---

// Mobile Haptic Feedback Utility
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(15); // Creates a sharp, physical mechanical click feel
  }
};

const PersistentGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] flex justify-center w-full mix-blend-multiply" aria-hidden="true">
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex h-full">
      <div className="flex-1 grid-col-line" />
      <div className="flex-1 grid-col-line hidden sm:block" />
      <div className="flex-1 grid-col-line hidden md:block" />
      <div className="flex-1 grid-col-line hidden lg:block" />
      <div className="grid-col-line" /> {/* Right edge */}
    </div>
  </div>
);

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const MagneticWrapper = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15); // Reduced pull for heavier feel
    y.set((e.clientY - centerY) * 0.15);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={triggerHaptic}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- CORE COMPONENTS ---

const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [terminalText, setTerminalText] = useState('');

  const runTerminalSequence = async () => {
    setStatus('processing');
    const sequence = [
      "> AUTHENTICATING...",
      "> ENCRYPTING_DATA...",
      "> HANDSHAKE_OK.",
      "> LOGGED. SCHEMATICS DISPATCHED."
    ];
    let currentText = "";
    for (let line of sequence) {
      currentText += line + "\n";
      setTerminalText(currentText);
      await new Promise(r => setTimeout(r, Math.random() * 200 + 150));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    runTerminalSequence();
  };

  const isProcessing = status === 'processing';

  return (
    <div className="w-full">
      {isProcessing ? (
        <div className="p-6 bg-black text-white border-2 border-black tech-shadow min-h-[160px] flex flex-col justify-end relative">
          <div className="font-mono text-[13px] font-bold whitespace-pre-line leading-relaxed text-[var(--paper)]">
            {terminalText}<span className="blinking-cursor bg-[var(--accent)]" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative group">
          <div className="relative w-full tech-border bg-white flex items-center tech-shadow focus-within:border-[var(--accent)] focus-within:shadow-[6px_6px_0px_0px_var(--accent)] transition-all">
            <span className="font-mono font-bold text-[var(--accent)] pl-4 select-none">&gt;</span>
            <input
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              className="flex-1 bg-transparent border-none outline-none shadow-none font-mono text-[14px] font-bold text-black py-4 px-3 focus:outline-none focus:ring-0 w-full"
              style={{ caretColor: 'var(--accent)' }}
              disabled={isProcessing}
              autoComplete="off"
            />
            {!email && !isProcessing && (
              <div className="absolute left-[34px] font-mono text-[14px] text-black/30 pointer-events-none font-bold flex items-center top-1/2 -translate-y-1/2">
                ENTER_EMAIL_ADDRESS<span className="blinking-cursor" />
              </div>
            )}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-black/30 bg-white pl-2 pointer-events-none">
              REQ
            </div>
          </div>

          <MagneticWrapper className="w-full">
            <button type="submit" disabled={!email} className="tech-btn w-full">
              INITIALIZE SEQUENCE →
            </button>
          </MagneticWrapper>
        </form>
      )}
    </div>
  );
};

// --- STICKY VERTICAL PIPELINE ---
const StickyPipeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const phases = [
    { num: 0, name: 'CHARTER', special: true, human: ['Named owner assigned', 'Success metrics defined', 'Failure conditions named'], ai: ['Charter precedes generation'], artifact: 'Design Charter' },
    { num: 1, name: 'FRAME', human: ['Problem framing', 'Constraint definition', 'Tradeoff decisions'], ai: ['Alt framings', 'Stakeholder questions'], artifact: 'Decision Frame' },
    { num: 2, name: 'EVIDENCE', human: ['Evidence synthesis', 'Uncertainty mapping'], ai: ['Interview guides', 'Theme coding'], artifact: 'Evidence Snapshot' },
    { num: 3, name: 'GENERATE', human: ['Constraint guardrails', 'Option evaluation'], ai: ['Rapid variants', 'Microcopy options'], artifact: 'Option Set (3-6)' },
    { num: 4, name: 'DECIDE', human: ['Direction choice', 'Rationale documentation'], ai: ['Content states', 'Error variants'], artifact: 'Decision Log' },
    { num: 5, name: 'EVALUATE', gate: 'ACCESSIBILITY_GATE', human: ['Pass/fail calls', 'Accessibility gate'], ai: ['Edge case lists', 'Test scripts'], artifact: 'Evaluation Report' },
    { num: 6, name: 'LEARN', human: ['Assumption review', 'Iteration planning'], ai: ['Feedback summaries', 'Anomaly tracking'], artifact: 'Post-launch Learnings' }
  ];

  return (
    <div ref={containerRef} className="relative bg-[var(--paper)] mt-16" style={{ height: `${phases.length * 90}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-24">

        {/* Central Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-black/10 -translate-x-1/2 hidden md:block">
          <motion.div className="w-full bg-[var(--accent)]" style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }} />
        </div>

        {/* Dynamic Nodes Mapping */}
        <div className="w-full h-full relative z-10 px-4 lg:px-20">
          {phases.map((phase, i) => {
            const start = (i - 0.4) / phases.length;
            const center = i / phases.length;
            const end = (i + 0.4) / phases.length;

            const opacity = useTransform(scrollYProgress, [start, center, end], [0.1, 1, 0.1]);
            const y = useTransform(scrollYProgress, [start, center, end], [300, 0, -300]);

            // Color routing lines based on scroll position passing the node
            const isActive = useTransform(scrollYProgress, v => v >= center ? "var(--accent)" : "rgba(10,10,10,0.1)");

            return (
              <motion.div key={i} style={{ opacity, y }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-6 md:gap-0 items-center pointer-events-auto">

                  {/* Left: Human (Solid, Clean) */}
                  <div className={`w-full tech-border bg-white p-6 lg:p-8 relative tech-shadow ${phase.special ? 'border-[4px]' : ''}`}>
                    {/* Hardware routing joint */}
                    <motion.div className="absolute right-[-42px] top-1/2 w-[40px] border-b-[4px] hidden md:block" style={{ borderColor: isActive }} />
                    <motion.div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[4px] bg-white hidden md:block" style={{ borderColor: isActive }} />

                    <div className="font-mono text-[11px] font-bold text-black mb-2 uppercase">
                      {phase.special ? 'MUST EXIST FIRST' : 'HUMAN_DECIDES'}
                    </div>
                    <h3 className="neo-grotesque text-[28px] lg:text-[36px] font-[900] mb-6 tracking-tight text-black uppercase">
                      PHASE 0{phase.num}:<br />{phase.name}
                    </h3>
                    <ul className="space-y-3 font-mono text-[12px] font-bold text-black/80">
                      {phase.human.map((item, idx) => (
                        <li key={idx} className="flex gap-3"><div className="w-2 h-2 bg-black mt-1 shrink-0" />{item}</li>
                      ))}
                    </ul>
                    {phase.gate && <div className="mt-6 tech-badge tech-badge-accent">{phase.gate}</div>}
                  </div>

                  {/* Center Node */}
                  <div className="h-[80px] flex justify-center items-center relative z-20 hidden md:flex">
                    <motion.div className="w-[24px] h-[24px] border-[4px] bg-[var(--paper)] rounded-full z-10" style={{ borderColor: isActive }} />
                  </div>

                  {/* Right: AI (Hatched, Dashed, Monospace) */}
                  <div className={`w-full border-[3px] border-black border-dashed p-6 lg:p-8 hatched-bg text-black relative`}>
                    {/* Hardware routing joint */}
                    <motion.div className="absolute left-[-42px] top-1/2 w-[40px] border-b-[4px] border-dashed hidden md:block" style={{ borderColor: isActive }} />
                    <motion.div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[4px] bg-white hidden md:block" style={{ borderColor: isActive }} />

                    <div className="font-mono text-[11px] font-bold text-black/60 mb-2 uppercase">AI_ACCELERATES</div>
                    <h3 className="font-mono text-[20px] lg:text-[24px] font-[800] mb-6 tracking-tight text-black uppercase bg-white px-2 inline-block tech-border">
                      OUTPUT_
                    </h3>
                    <ul className="space-y-3 font-mono text-[12px] font-bold text-black/80">
                      {phase.ai.map((item, idx) => (
                        <li key={idx} className="flex gap-3"><span className="text-[var(--accent)]">&gt;</span> <span>{item}</span></li>
                      ))}
                    </ul>
                    <div className="mt-6 font-mono text-[11px] font-bold border-2 border-black px-3 py-2 inline-block bg-white uppercase">
                      ARTIFACT: {phase.artifact}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default function App() {

  // Force mobile browsers to match the paper background color
  useEffect(() => {
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = "theme-color";
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = "#EFEFE9";
  }, []);

  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <PersistentGrid />

      {/* SECTION 01: HERO */}
      <section className="relative min-h-screen pt-48 pb-24 border-b-[4px] border-black flex flex-col justify-center z-10 overflow-hidden">

        {/* Massive Static Background Schematic */}
        <div className="absolute top-1/2 left-[60%] -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.06] z-0" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none" strokeWidth="0.5">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <rect x="40" y="40" width="20" height="20" stroke="var(--accent)" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-[800px]">
            <FadeIn>
              <div className="flex items-center gap-4 mb-10">
                <div className="tech-badge tech-badge-black">DOC_ID: CD-2026-V1</div>
                <span className="font-mono text-[12px] font-bold tracking-widest uppercase text-black/50">Process_Framework</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="neo-grotesque text-[clamp(64px,10vw,140px)] font-[900] leading-[0.85] text-black mb-10 uppercase tracking-tighter">
                AI Generates.<br />
                <span className="text-[var(--accent)]">Humans Own.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="text-[clamp(18px,2vw,24px)] font-bold leading-[1.4] text-black max-w-[600px] mb-12 pl-6 border-l-[4px] border-black">
                Design isn't the artifact. It's accountability for the outcome. A systematic manual for building with artificial intelligence.
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-wrap items-center gap-4">
              <MagneticWrapper><a href="#framework" className="tech-btn">Read the Manual ↓</a></MagneticWrapper>
              <MagneticWrapper><Link to="/templates" className="tech-btn tech-btn-outline">Access Templates →</Link></MagneticWrapper>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION 02: THE PROBLEM */}
      <section id="the-problem" className="py-32 relative z-10 border-b-[2px] border-black">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">

          {/* Structural Hanging Grid Number */}
          <div className="absolute top-0 -translate-y-6 hidden md:block" style={{ left: '0' }}>
            <span className="neo-grotesque text-[160px] font-[900] text-black/5 leading-none select-none -ml-4">01</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 relative z-10">
            <div>
              <div className="font-mono text-[12px] font-bold tracking-widest text-[var(--accent)] mb-6 uppercase">
                [ DIAGNOSTIC ] // SYSTEM_FAILURE
              </div>
              <h2 className="neo-grotesque text-[clamp(40px,5vw,64px)] font-[900] leading-[1] tracking-tight mb-10 uppercase">
                Every team is moving faster. Nobody knows who owns what happens next.
              </h2>
              <FadeIn>
                <div className="space-y-6 text-[18px] font-medium leading-[1.6] text-black/80">
                  <p>AI makes design outputs look done. Polished interfaces, complete copy, credible flows — generated in seconds by anyone with a prompt and a deadline. It becomes easy to believe the thinking happened. It didn't.</p>
                  <p>The failure modes are not ugly. They are plausible. Interfaces that look right but are wrong for edge cases, accessibility, trust, and the people who needed them most.</p>
                  <p>We call this <strong className="text-[var(--paper)] bg-black px-2 uppercase font-bold text-[14px]">Generated and Forgotten</strong>. It is what happens when AI-assisted work ships without a human who can trace a decision back to its reasoning.</p>
                </div>
              </FadeIn>
            </div>

            <div className="relative flex items-center">
              <FadeIn delay={0.2} className="w-full">
                <div className="tech-border bg-white p-10 relative tech-shadow">
                  <div className="tech-badge tech-badge-accent mb-6">CRITICAL_ERROR</div>
                  <h3 className="neo-grotesque text-2xl font-[900] mb-4 uppercase tracking-tight">Generated & Forgotten</h3>
                  <p className="text-[16px] font-bold mb-8">
                    The practice of shipping AI-assisted design where no human can explain why any decision was made.
                  </p>

                  <div className="border-t-2 border-black pt-6">
                    <div className="font-mono text-[11px] font-bold uppercase mb-4 tracking-widest text-black/50">OBSERVED CONSEQUENCES</div>
                    <ul className="space-y-3 font-mono text-[13px] font-bold text-black/80">
                      {['Beautiful output. No named owner.', 'Decisions nobody can trace.', 'Accountability evaporates at ship.', 'Plausible mistakes at scale.'].map((item, i) => (
                        <li key={i} className="flex gap-3"><span className="text-[var(--accent)] mt-0.5">X</span> {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: THE FRAMEWORK */}
      <section id="framework" className="py-32 border-b-[4px] border-black relative z-10 bg-white">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">

          <div className="absolute top-0 -translate-y-6 hidden md:block right-0">
            <span className="neo-grotesque text-[160px] font-[900] text-black/5 leading-none select-none">02</span>
          </div>

          <div className="text-center max-w-[800px] mx-auto mb-16 relative z-10">
            <div className="font-mono text-[12px] font-bold tracking-widest text-[var(--accent)] mb-6 uppercase">
              [ SCHEMATIC ] // CHARTERED_DESIGN_V1
            </div>
            <h2 className="neo-grotesque text-[clamp(40px,5vw,72px)] font-[900] leading-[1] tracking-tight mb-8 uppercase text-black">
              Seven phases.<br />Explicit machine roles.<br />Named human operators.
            </h2>
          </div>
        </div>

        <StickyPipeline />
      </section>

      {/* SECTION 04: THE TEMPLATES */}
      <section id="templates" className="py-32 border-b-[2px] border-black relative z-10 bg-[var(--paper)]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative">

          <div className="absolute top-0 -translate-y-6 hidden md:block left-[33.33%]">
            <span className="neo-grotesque text-[160px] font-[900] text-black/5 leading-none select-none -ml-4">03</span>
          </div>

          <div className="max-w-[800px] mb-20 relative z-10">
            <div className="font-mono text-[12px] font-bold tracking-widest text-black mb-6 uppercase">
              [ ASSETS ] // FREE_RESOURCES
            </div>
            <h2 className="neo-grotesque text-[clamp(40px,6vw,80px)] font-[900] leading-[0.95] tracking-tight mb-8 uppercase text-black">
              Everything you need<br />to execute on Monday.
            </h2>
            <div className="text-[20px] font-bold leading-[1.5] text-black/70 border-l-[4px] border-[var(--accent)] pl-6">
              Three required artifacts. Built for real teams working in real organizational conditions — not ideal ones.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 relative z-10">
            {[
              { phase: '0', title: 'Design Charter', desc: 'The founding document created before any artifact exists. Names the owner, maps accountability.', field: 'Failure Condition', fieldDesc: '"What would make this a bad outcome?" Named before generation.' },
              { phase: '4', title: 'Decision Log', desc: 'A per-decision audit trail that survives the project. Rationale, constraints, risks, and mitigations.', field: 'Falsifiability Signal', fieldDesc: 'Forces teams to define the exact signal that would prove them wrong.' },
              { phase: '5', title: 'Evaluation Harness', desc: 'Systematic evaluation. Accessibility runs as a strict gate condition before the harness even opens.', field: 'Accessibility Gate', fieldDesc: 'Must clear before anything else runs. Not optional.' }
            ].map((tmpl, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-white tech-border p-8 flex flex-col h-full tech-shadow hover:bg-[var(--accent)] hover:text-white transition-colors group">
                <div className="flex justify-between items-start mb-8">
                  <span className="neo-grotesque text-[48px] font-[900] leading-none tracking-tighter text-black/10 group-hover:text-white/30">0{i + 1}</span>
                  <span className="tech-badge group-hover:bg-white group-hover:text-[var(--accent)] group-hover:border-white">PHASE_{tmpl.phase}</span>
                </div>
                <h3 className="neo-grotesque text-[28px] font-[900] tracking-tight mb-4 uppercase">{tmpl.title}</h3>
                <p className="text-[15px] font-bold leading-[1.6] mb-8 flex-1 text-black/70 group-hover:text-white/90">{tmpl.desc}</p>
                <div className="border-2 border-black bg-[var(--paper)] group-hover:bg-transparent group-hover:border-white p-4 mb-8 text-black group-hover:text-white">
                  <div className="font-mono text-[10px] font-bold mb-2 opacity-50">// KEY_PARAMETER</div>
                  <div className="font-mono text-[13px] font-bold uppercase mb-2">{tmpl.field}</div>
                  <div className="text-[13px] font-bold leading-snug opacity-80">{tmpl.fieldDesc}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div id="email-capture" className="border-[4px] border-black bg-white p-10 lg:p-16 relative z-10 tech-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-center">
              <div>
                <h3 className="neo-grotesque text-[36px] font-[900] tracking-tight mb-4 uppercase">Awaiting Signal.</h3>
                <p className="text-[18px] font-bold leading-[1.5] text-black/70">
                  Notion templates, Figma schematics, and instructional materials. Free. No noise. Link dispatched upon launch.
                </p>
              </div>
              <EmailCapture />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: THE MANIFESTO */}
      <section id="manifesto" className="py-32 bg-black text-[var(--paper)] border-b-[4px] border-white relative z-10">
        <div className="max-w-4xl mx-auto px-6 w-full relative">

          <div className="absolute top-0 -translate-y-6 hidden md:block right-0">
            <span className="neo-grotesque text-[160px] font-[900] text-white/5 leading-none select-none">04</span>
          </div>

          <div className="font-mono text-[12px] font-bold tracking-widest text-[var(--accent)] mb-6 uppercase relative z-10">
            [ DIRECTIVE ] // TEN_AXIOMS
          </div>
          <h2 className="neo-grotesque text-[clamp(40px,5vw,72px)] font-[900] leading-[1] tracking-tight mb-16 uppercase text-white relative z-10">
            Core Axioms.
          </h2>

          <div className="text-[20px] font-bold leading-[1.6] text-white/80 space-y-6 pl-6 border-l-[4px] border-[var(--accent)] mb-20 relative z-10">
            <p>Design is the intentional creation of meaning and experience. We came to this work because of that. Not the deliverables. The moment when something we made helped someone who needed it.</p>
          </div>

          <div className="border-t-2 border-white/20 relative z-10">
            {[
              "Design is the intentional creation of meaning. Not the production of artifacts.",
              "AI can generate. It cannot feel. That distinction is the definition of what makes design irreducibly human.",
              "Every framework we inherited was built for a world that no longer exists.",
              "Incomplete processes produce incomplete accountability.",
              "The most dangerous output in design is not something ugly. It is something plausible.",
              "Constraints are not obstacles. They are the material of real design.",
              "Before any artifact exists, a human must own the outcome. By name.",
              "Design is a conversation. The Decision Log makes it permanent, traceable, and owned.",
              "AI generates candidates. Humans own the consequences. This will not change.",
              "Design must be worthy of the trust it asks for."
            ].map((belief, i) => (
              <div key={i} className="py-8 border-b-2 border-white/10 flex gap-6 sm:gap-10 items-center">
                <span className="neo-grotesque text-[40px] sm:text-[56px] font-[900] text-white/20 tracking-tighter w-12 sm:w-16 shrink-0">
                  {i < 9 ? `0${i + 1}` : i + 1}
                </span>
                <span className="text-[18px] sm:text-[22px] font-bold leading-[1.4] text-white/90">{belief}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06: THE PROOF (The Punchline) */}
      <section className="py-32 bg-[var(--accent)] border-b-[8px] border-black relative z-10 text-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">

          <div className="font-mono text-[12px] font-bold tracking-widest mb-12 uppercase bg-black text-[var(--accent)] px-3 py-1 inline-block">
            [ POST_MORTEM ] // CASE_FILE_01
          </div>

          <h2 className="neo-grotesque text-[clamp(64px,12vw,200px)] font-[900] leading-[0.8] tracking-tighter mb-12 block">
            ~$30,000,000
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12 lg:gap-24 border-t-[4px] border-black pt-12">
            <p className="text-[24px] font-[900] leading-[1.4] max-w-[600px]">
              A unified internal developer platform. Real investment. Three specific moments where accountability was absent. The measurable costs that followed.
            </p>
            <div className="flex flex-col gap-8 border-l-[4px] border-black pl-8">
              <div className="flex flex-col">
                <span className="neo-grotesque text-[clamp(32px,4vw,56px)] font-[900] tracking-tighter leading-none mb-2">2x OVER_BUDGET</span>
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-black/60">PARALLEL INVESTMENT</span>
              </div>
              <MagneticWrapper>
                <a href="/work/chartered-design" className="tech-btn !bg-black !text-[var(--accent)] hover:!bg-[var(--paper)] hover:!text-black" onClick={e => e.preventDefault()}>
                  READ CASE STUDY →
                </a>
              </MagneticWrapper>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 07: FOOTER CTA */}
      <section className="py-40 bg-[var(--paper)] text-center relative overflow-hidden z-10">
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h2 className="neo-grotesque text-[clamp(48px,6vw,80px)] font-[900] leading-[0.9] tracking-tighter mb-8 uppercase flex flex-col items-center text-black">
            <span>START WITH</span>
            <span>ONE QUESTION.</span>
          </h2>
          <p className="text-[24px] font-[900] mb-12 bg-[var(--accent)] text-black p-4 inline-block tracking-tight">
            "Who owns this outcome?"
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <MagneticWrapper><a href="#email-capture" className="tech-btn w-full">DOWNLOAD SCHEMATICS ↓</a></MagneticWrapper>
            <MagneticWrapper><a href="#framework" className="tech-btn tech-btn-outline w-full hover:!bg-black hover:!text-[var(--paper)]">RETURN TO MANUAL ↑</a></MagneticWrapper>
          </div>
          <div className="mt-24 font-mono text-[10px] font-bold tracking-widest uppercase text-black/40">
            SYS.END // ACCOUNTABILITY_BEFORE_ARTIFACTS // 2026
          </div>
        </div>
      </section>
    </>
  );
}
