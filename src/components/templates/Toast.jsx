import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Toast({ message, visible, onDismiss }) {
    useEffect(() => {
        if (visible) {
            const t = setTimeout(onDismiss, 3000)
            return () => clearTimeout(t)
        }
    }, [visible, onDismiss])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 16, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 8, x: '-50%' }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        left: '50%',
                        zIndex: 99999,
                        background: 'var(--ink)',
                        color: 'var(--paper)',
                        border: '2px solid var(--ink)',
                        boxShadow: '4px 4px 0px 0px var(--accent)',
                        padding: '12px 24px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                    }}
                    onClick={onDismiss}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
