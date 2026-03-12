import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export function TemplateSection({ label, sublabel, annotation, variant = 'default', number, children }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-10%' })
    const shouldReduce = useReducedMotion()

    const baseStyle = {
        background: '#fff',
        border: '2px solid var(--ink)',
        padding: 32,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
    }

    const variants = {
        default: baseStyle,
        gate: {
            ...baseStyle,
            borderColor: 'var(--accent)',
            boxShadow: '6px 6px 0px 0px var(--accent)',
            background: 'var(--paper)',
        },
        key: {
            ...baseStyle,
            borderLeft: '6px solid var(--accent)',
        },
        ai: {
            ...baseStyle,
            border: '3px dashed var(--ink)',
            background: undefined,
        },
    }

    const style = variants[variant] || baseStyle

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduce ? 0.01 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={style}
            className={variant === 'ai' ? 'hatched-bg' : ''}
        >
            {number && (
                <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontFamily: "'Archivo', sans-serif",
                        fontSize: 80,
                        fontWeight: 900,
                        color: 'rgba(10,10,10,0.04)',
                        lineHeight: 1,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                    className="hidden lg:block"
                >
                    {number}
                </div>
            )}

            {variant === 'ai' && (
                <div
                    className="font-mono"
                    style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'rgba(10,10,10,0.35)',
                        marginBottom: 12,
                    }}
                >
                    &gt; AI-ACCELERATED
                </div>
            )}

            <div style={{ marginBottom: 24, borderBottom: '2px solid var(--ink)', paddingBottom: 16 }}>
                <div
                    className="font-mono"
                    style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--accent)',
                        marginBottom: 4,
                    }}
                >
                    [ {label} ] {sublabel ? `// ${sublabel}` : ''}
                </div>
                {annotation && (
                    <div
                        style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontSize: 15,
                            fontWeight: 500,
                            color: 'rgba(10,10,10,0.55)',
                            lineHeight: 1.5,
                            marginTop: 4,
                        }}
                    >
                        {annotation}
                    </div>
                )}
            </div>

            {children}
        </motion.div>
    )
}
