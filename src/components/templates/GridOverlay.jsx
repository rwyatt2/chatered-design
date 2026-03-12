export function GridOverlay() {
    return (
        <div
            className="grid-overlay"
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                padding: '0 24px',
            }}
        >
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        borderLeft: '1px solid rgba(10,10,10,0.08)',
                        height: '100%',
                        ...(i === 4 ? { borderRight: '1px solid rgba(10,10,10,0.08)' } : {}),
                    }}
                />
            ))}
        </div>
    )
}
