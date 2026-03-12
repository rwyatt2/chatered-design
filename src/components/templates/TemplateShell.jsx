import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FilmGrain } from './FilmGrain'
import { GridOverlay } from './GridOverlay'
import { TemplateAssemblyPanel } from './TemplateAssemblyPanel'
import { MobileActionBar } from './MobileActionBar'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

export function TemplateShell({
    phase,
    phaseNumber,
    title,
    description,
    assembledOutput,
    templateName,
    onClear,
    fieldsComplete,
    fieldsTotal,
    children,
}) {
    const shouldReduce = useReducedMotion()
    const { copy, copied } = useCopyToClipboard()
    const isEmpty = !assembledOutput || assembledOutput.trim() === ''

    const handleDownload = () => {
        const blob = new Blob([assembledOutput], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${templateName}.md`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ background: 'var(--paper)', minHeight: '100vh', position: 'relative' }}>
            <FilmGrain />
            <GridOverlay />

            <div
                id="main-form"
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '96px 24px 128px',
                }}
                className="lg:px-12 pb-20 lg:pb-32"
            >
                {/* Page Header */}
                <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 48, marginBottom: 64 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <Link
                            to="/templates"
                            className="breadcrumb font-mono"
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--ink)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink)'}
                        >
                            ← TEMPLATES
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%',
                                animation: 'pulse 2s ease-in-out infinite',
                            }} />
                            <span
                                className="font-mono"
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'rgba(10,10,10,0.4)',
                                }}
                            >
                                AUTOSAVED
                            </span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.3, delay: 0.05 }}
                    >
                        <span className="tech-badge tech-badge-accent" style={{ marginBottom: 16, display: 'inline-flex' }}>
                            {phaseNumber} // {phase}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.5, delay: 0.1 }}
                        className="neo-grotesque"
                        style={{
                            fontSize: 'clamp(40px, 5vw, 72px)',
                            fontWeight: 900,
                            letterSpacing: '-0.05em',
                            lineHeight: 0.95,
                            textTransform: 'uppercase',
                            color: 'var(--ink)',
                            marginBottom: 16,
                            marginTop: 16,
                        }}
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.4, delay: 0.2 }}
                    >
                        <p style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: 18,
                            fontWeight: 500,
                            lineHeight: 1.6,
                            color: 'rgba(10,10,10,0.6)',
                            maxWidth: 560,
                        }}>
                            {description}
                        </p>

                        {/* Progress */}
                        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 200, height: 4,
                                background: 'rgba(10,10,10,0.1)',
                                border: '1px solid var(--ink)',
                            }}>
                                <div style={{
                                    height: '100%',
                                    background: 'var(--accent)',
                                    width: `${fieldsTotal > 0 ? (fieldsComplete / fieldsTotal * 100) : 0}%`,
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                            <span
                                className="font-mono"
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'rgba(10,10,10,0.5)',
                                }}
                            >
                                {fieldsComplete} / {fieldsTotal} FIELDS
                            </span>
                        </div>
                    </motion.div>
                </header>

                {/* Two-Column Layout */}
                <div
                    style={{
                        display: 'grid',
                        gap: 48,
                        alignItems: 'start',
                    }}
                    className="grid-cols-1 lg:grid-cols-[1fr_380px]"
                >
                    <div className="template-form">{children}</div>
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.5, delay: 0.3 }}
                        className="hidden lg:block"
                    >
                        <TemplateAssemblyPanel
                            output={assembledOutput}
                            templateName={templateName}
                            onClear={onClear}
                            fieldsComplete={fieldsComplete}
                            fieldsTotal={fieldsTotal}
                        />
                    </motion.div>
                </div>

                {/* Mobile Output Preview */}
                <div className="lg:hidden" style={{ marginTop: 32 }}>
                    <div style={{
                        border: '2px solid var(--ink)',
                        background: 'var(--ink)',
                        padding: 20,
                    }}>
                        <div className="font-mono" style={{
                            fontSize: 10, fontWeight: 800, color: 'var(--accent)',
                            textTransform: 'uppercase', marginBottom: 12,
                        }}>
                            [ OUTPUT ] // TAP TO EXPAND
                        </div>
                        <div className="font-mono" style={{
                            fontSize: 11, color: 'var(--paper)',
                            lineHeight: 1.8, whiteSpace: 'pre-wrap',
                            maxHeight: 96, overflow: 'hidden',
                        }}>
                            {assembledOutput || '> FILL IN FIELDS TO GENERATE\n> ASSEMBLED OUTPUT...'}
                        </div>
                    </div>
                </div>
            </div>

            <MobileActionBar
                fieldsComplete={fieldsComplete}
                fieldsTotal={fieldsTotal}
                onCopy={() => copy(assembledOutput)}
                onDownload={handleDownload}
                copied={copied}
                outputEmpty={isEmpty}
            />

            {/* Pulse animation for autosave dot */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (min-width: 1024px) {
          .grid-cols-1.lg\\:grid-cols-\\[1fr_380px\\] {
            grid-template-columns: 1fr 380px;
          }
        }
      `}</style>
        </div>
    )
}
