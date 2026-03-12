export function TemplateVerdictSelector({ value, onChange }) {
    const pills = [
        { val: 'pass', label: 'PASS', selectedBg: 'var(--ink)', selectedColor: 'var(--paper)', selectedBorder: 'var(--ink)', selectedShadow: '3px 3px 0px var(--accent)' },
        { val: 'mitigate', label: 'MITIGATE', selectedBg: 'var(--accent)', selectedColor: '#fff', selectedBorder: 'var(--accent)', selectedShadow: '3px 3px 0px var(--ink)' },
        { val: 'fail', label: 'FAIL', selectedBg: 'var(--ink)', selectedColor: 'var(--accent)', selectedBorder: 'var(--ink)', selectedShadow: '3px 3px 0px var(--accent)' },
    ]

    return (
        <div style={{ display: 'flex', gap: 6 }}>
            {pills.map((p) => (
                <button
                    key={p.val}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onChange(value === p.val ? '' : p.val) }}
                    className="font-mono"
                    style={{
                        border: '2px solid var(--ink)',
                        padding: '6px 12px',
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: value === p.val ? p.selectedBg : '#fff',
                        color: value === p.val ? p.selectedColor : 'var(--ink)',
                        borderColor: value === p.val ? p.selectedBorder : 'var(--ink)',
                        boxShadow: value === p.val ? p.selectedShadow : 'none',
                    }}
                >
                    {p.label}
                </button>
            ))}
        </div>
    )
}
