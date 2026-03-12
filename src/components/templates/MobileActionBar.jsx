export function MobileActionBar({ fieldsComplete, fieldsTotal, onCopy, onDownload, copied, outputEmpty }) {
    return (
        <div
            className="mobile-action-bar lg:hidden"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'var(--paper)',
                borderTop: '2px solid var(--ink)',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
            }}
        >
            <div>
                <div
                    className="font-mono"
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgba(10,10,10,0.4)',
                    }}
                >
                    {fieldsComplete}/{fieldsTotal} DONE
                </div>
                <div
                    style={{
                        width: 80,
                        height: 3,
                        background: 'rgba(10,10,10,0.1)',
                        border: '1px solid rgba(10,10,10,0.2)',
                        marginTop: 4,
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            background: 'var(--accent)',
                            width: `${fieldsTotal > 0 ? (fieldsComplete / fieldsTotal * 100) : 0}%`,
                            transition: 'width 0.3s ease',
                        }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    className="tech-btn"
                    onClick={onCopy}
                    disabled={outputEmpty}
                    style={{
                        padding: '10px 16px',
                        fontSize: 11,
                        opacity: outputEmpty ? 0.4 : 1,
                        pointerEvents: outputEmpty ? 'none' : 'auto',
                    }}
                >
                    {copied ? '✓ COPIED' : 'COPY'}
                </button>
                <button
                    className="tech-btn-outline"
                    onClick={onDownload}
                    disabled={outputEmpty}
                    style={{
                        padding: '10px 16px',
                        fontSize: 11,
                        opacity: outputEmpty ? 0.4 : 1,
                        pointerEvents: outputEmpty ? 'none' : 'auto',
                    }}
                >
                    .MD ↓
                </button>
            </div>
        </div>
    )
}
