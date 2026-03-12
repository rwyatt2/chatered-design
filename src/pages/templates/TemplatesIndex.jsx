import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FilmGrain } from '../../components/templates/FilmGrain'
import { GridOverlay } from '../../components/templates/GridOverlay'

const cards = [
    {
        phase: '00', phaseName: 'CHARTER',
        name: 'DESIGN CHARTER',
        description: 'The founding document created before any artifact exists. Names the owner, defines constraints, and declares what would make this outcome fail.',
        keyField: 'FAILURE CONDITION',
        route: '/templates/design-charter',
        formats: ['BROWSER', 'MARKDOWN', 'PDF'],
    },
    {
        phase: '04', phaseName: 'DECIDE',
        name: 'DECISION LOG',
        description: 'A per-decision audit trail with rationale, constraints, risks, and a falsifiability test. Designed to survive the project.',
        keyField: 'WHAT WOULD CHANGE OUR MIND',
        route: '/templates/decision-log',
        formats: ['BROWSER', 'MARKDOWN', 'PDF'],
    },
    {
        phase: '05', phaseName: 'EVALUATE',
        name: 'EVALUATION HARNESS',
        description: 'Seven-dimension systematic evaluation. Accessibility runs as a gate condition — not one of seven equal dimensions.',
        keyField: 'ACCESSIBILITY GATE',
        route: '/templates/evaluation-harness',
        formats: ['BROWSER', 'MARKDOWN', 'PDF'],
    },
    {
        phase: '03', phaseName: 'GENERATE',
        name: 'PROMPT FRAME',
        description: 'Redefines AI prompting as constraint specification. The assembled prompt is ready to paste into any AI tool.',
        keyField: 'WHAT MUST THIS NOT DO',
        route: '/templates/prompt-frame',
        formats: ['BROWSER', 'MARKDOWN', 'PDF'],
    },
]

export default function TemplatesIndex() {
    const shouldReduce = useReducedMotion()

    return (
        <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
            <FilmGrain />
            <GridOverlay />

            {/* Hero */}
            <section style={{
                borderBottom: '4px solid var(--ink)',
                padding: '128px 0 64px',
                position: 'relative',
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative' }} className="lg:px-12">
                    <div
                        style={{
                            position: 'absolute', top: 0, left: 24,
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: 160, fontWeight: 900,
                            color: 'rgba(10,10,10,0.04)',
                            lineHeight: 1, userSelect: 'none',
                        }}
                        aria-hidden="true"
                    >
                        §
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.4 }}
                    >
                        <div
                            className="font-mono"
                            style={{
                                fontSize: 12, fontWeight: 800,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: 'var(--accent)', marginBottom: 24,
                            }}
                        >
                            [ TOOLKIT ] // FOUR_TEMPLATES
                        </div>

                        <h1
                            className="neo-grotesque"
                            style={{
                                fontSize: 'clamp(56px, 8vw, 120px)',
                                fontWeight: 900,
                                letterSpacing: '-0.05em',
                                lineHeight: 0.9,
                                textTransform: 'uppercase',
                                color: 'var(--ink)',
                                marginBottom: 24,
                            }}
                        >
                            CHARTERED DESIGN<br />TOOLKIT
                        </h1>

                        <p style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: 'clamp(18px, 2vw, 24px)',
                            fontWeight: 700,
                            lineHeight: 1.4,
                            color: 'rgba(10,10,10,0.6)',
                            maxWidth: 560,
                        }}>
                            Four templates. Free to use. Fillable in your browser, downloadable as Markdown, printable as PDF.
                            Start with the Design Charter.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cards */}
            <section style={{ padding: '64px 0 128px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }} className="lg:px-12">
                    <div
                        style={{
                            display: 'grid',
                            gap: 2,
                            border: '2px solid var(--ink)',
                        }}
                        className="grid-cols-1 md:grid-cols-2"
                    >
                        {cards.map((card, index) => (
                            <TemplateCard key={card.route} card={card} index={index} shouldReduce={shouldReduce} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section style={{
                borderTop: '4px solid var(--ink)',
                padding: '48px 0',
            }}>
                <div
                    style={{
                        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 16,
                    }}
                    className="lg:px-12"
                >
                    <span
                        className="font-mono"
                        style={{
                            fontSize: 12, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'rgba(10,10,10,0.4)',
                        }}
                    >
            // START WITH PHASE 0
                    </span>
                    <Link to="/templates/design-charter">
                        <button className="tech-btn">START WITH DESIGN CHARTER →</button>
                    </Link>
                </div>
            </section>

            <style>{`
        @media (min-width: 768px) {
          .grid-cols-1.md\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
        </div>
    )
}

function TemplateCard({ card, index, shouldReduce }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: shouldReduce ? 0.01 : 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                to={card.route}
                style={{
                    background: '#fff',
                    border: '1px solid var(--ink)',
                    padding: 40,
                    textDecoration: 'none',
                    display: 'block',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.15s cubic-bezier(0.16,1,0.3,1)',
                    color: 'var(--ink)',
                }}
                className="template-card"
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--ink)'
                    e.currentTarget.style.color = 'var(--paper)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff'
                    e.currentTarget.style.color = 'var(--ink)'
                }}
            >
                {/* Ghost number */}
                <div
                    style={{
                        position: 'absolute', top: 16, right: 24,
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: 120, fontWeight: 900,
                        color: 'rgba(10,10,10,0.04)',
                        lineHeight: 1,
                        transition: 'color 0.15s',
                    }}
                    aria-hidden="true"
                >
                    {card.phase}
                </div>

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative', zIndex: 2 }}>
                    <span className="tech-badge">{card.phase} // {card.phaseName}</span>
                    <span style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: 24, fontWeight: 900,
                        transition: 'transform 0.15s',
                    }}>
                        →
                    </span>
                </div>

                {/* Name */}
                <div
                    className="neo-grotesque"
                    style={{
                        fontSize: 32, fontWeight: 900,
                        textTransform: 'uppercase', letterSpacing: '-0.04em',
                        lineHeight: 1, marginBottom: 12,
                        transition: 'color 0.15s',
                        position: 'relative', zIndex: 2,
                    }}
                >
                    {card.name}
                </div>

                {/* Description */}
                <div style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 15, fontWeight: 500,
                    lineHeight: 1.6, marginBottom: 24,
                    opacity: 0.6, transition: 'opacity 0.15s',
                    position: 'relative', zIndex: 2,
                }}>
                    {card.description}
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '2px solid rgba(10,10,10,0.1)',
                    marginBottom: 16, transition: 'border-color 0.15s',
                    position: 'relative', zIndex: 2,
                }} />

                {/* Key field */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 2 }}>
                    <span className="font-mono" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)' }}>
                        KEY FIELD:
                    </span>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                        {card.keyField}
                    </span>
                </div>

                {/* Format tags */}
                <div style={{ display: 'flex', gap: 6, marginTop: 16, position: 'relative', zIndex: 2 }}>
                    {card.formats.map((f) => (
                        <span key={f} className="tech-badge" style={{ fontSize: 9 }}>{f}</span>
                    ))}
                </div>
            </Link>
        </motion.div>
    )
}
