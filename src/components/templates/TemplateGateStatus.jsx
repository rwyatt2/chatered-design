export function TemplateGateStatus({ status }) {
    const config = {
        cleared: {
            bg: 'var(--ink)',
            color: 'var(--paper)',
            icon: '✓',
            text: 'ACCESSIBILITY GATE CLEARED — HARNESS IS OPEN',
        },
        failed: {
            bg: 'var(--accent)',
            color: '#fff',
            icon: '✗',
            text: 'GATE FAILED — RESOLVE BEFORE PROCEEDING',
        },
        incomplete: {
            bg: 'var(--paper)',
            color: 'var(--ink)',
            icon: '○',
            text: 'COMPLETE ACCESSIBILITY GATE TO UNLOCK DIMENSIONS',
        },
    }

    const c = config[status] || config.incomplete

    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                borderBottom: '2px solid var(--ink)',
                background: c.bg,
                transition: 'background 0.2s ease',
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                <span
                    className="font-mono"
                    style={{ fontSize: 16, color: c.color }}
                >
                    {c.icon}
                </span>
                <span
                    className="font-mono"
                    style={{
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: c.color,
                    }}
                >
                    {c.text}
                </span>
            </div>
        </div>
    )
}
