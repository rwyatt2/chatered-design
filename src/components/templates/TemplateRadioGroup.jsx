export function TemplateRadioGroup({ label, options, value, onChange, variant = 'pills' }) {
    return (
        <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: 20 }}>
            {label && (
                <legend
                    className="font-mono"
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--ink)',
                        marginBottom: 10,
                    }}
                >
                    {label}
                </legend>
            )}
            {variant === 'pills' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className="font-mono"
                            style={{
                                border: '2px solid var(--ink)',
                                padding: '8px 14px',
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                background: value === opt.value ? 'var(--ink)' : '#fff',
                                color: value === opt.value ? 'var(--paper)' : 'var(--ink)',
                                boxShadow: value === opt.value ? '3px 3px 0px 0px var(--accent)' : 'none',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            style={{
                                border: '2px solid var(--ink)',
                                padding: '14px 16px',
                                cursor: 'pointer',
                                background: value === opt.value ? 'var(--paper)' : '#fff',
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                textAlign: 'left',
                                borderColor: value === opt.value ? 'var(--ink)' : 'var(--ink)',
                                boxShadow: value === opt.value ? '4px 4px 0px 0px var(--ink)' : 'none',
                            }}
                        >
                            <div
                                style={{
                                    width: 14,
                                    height: 14,
                                    border: '2px solid var(--ink)',
                                    flexShrink: 0,
                                    marginTop: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 0,
                                }}
                            >
                                {value === opt.value && (
                                    <div style={{ width: 8, height: 8, background: 'var(--accent)' }} />
                                )}
                            </div>
                            <div>
                                <div
                                    className="font-mono"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: 'var(--ink)',
                                    }}
                                >
                                    {opt.label}
                                </div>
                                {opt.description && (
                                    <div
                                        style={{
                                            fontFamily: "'Archivo', sans-serif",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: 'rgba(10,10,10,0.5)',
                                            marginTop: 2,
                                        }}
                                    >
                                        {opt.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </fieldset>
    )
}
