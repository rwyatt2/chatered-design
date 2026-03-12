export function TemplateCheckbox({ label, checked, onChange, variant = 'default' }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked) } }}
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid rgba(10,10,10,0.08)',
                cursor: 'pointer',
                transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10,10,10,0.02)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <div
                style={{
                    width: 20,
                    height: 20,
                    border: '2px solid var(--ink)',
                    background: checked
                        ? variant === 'gate' ? 'var(--accent)' : 'var(--ink)'
                        : '#fff',
                    flexShrink: 0,
                    marginTop: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    borderColor: checked && variant === 'gate' ? 'var(--accent)' : 'var(--ink)',
                }}
            >
                {checked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M2 6L5 9L10 3"
                            stroke={variant === 'gate' ? 'white' : 'var(--paper)'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            <span
                style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: checked ? 'rgba(10,10,10,0.4)' : 'var(--ink)',
                    lineHeight: 1.4,
                    userSelect: 'none',
                    textDecoration: checked ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(10,10,10,0.2)',
                }}
            >
                {label}
            </span>
        </div>
    )
}
