export function TemplateField({ label, value, onChange, placeholder, hint, required, prefix }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label
                    className="font-mono"
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--ink)',
                    }}
                >
                    {label}
                </label>
                {required && (
                    <span
                        className="font-mono"
                        style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: 'var(--accent)',
                            textTransform: 'uppercase',
                        }}
                    >
                        REQUIRED
                    </span>
                )}
            </div>
            <div style={{ position: 'relative' }}>
                {prefix && (
                    <span
                        className="font-mono"
                        style={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--accent)',
                            pointerEvents: 'none',
                        }}
                    >
                        {prefix}
                    </span>
                )}
                <input
                    className="tech-input"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-required={required || undefined}
                    style={prefix ? { paddingLeft: 36 } : undefined}
                />
            </div>
            {hint && (
                <div
                    className="font-mono"
                    style={{
                        marginTop: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(10,10,10,0.35)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}
                >
                    {hint}
                </div>
            )}
        </div>
    )
}
