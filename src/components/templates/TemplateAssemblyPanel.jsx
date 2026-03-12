import { useState } from 'react'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

export function TemplateAssemblyPanel({ output, templateName, onClear, fieldsComplete, fieldsTotal }) {
    const { copy, copied } = useCopyToClipboard()
    const [confirmClear, setConfirmClear] = useState(false)
    const isEmpty = !output || output.trim() === ''

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${templateName}.md`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div
            className="assembly-panel"
            role="region"
            aria-label="Assembled template output"
            aria-live="polite"
            style={{
                position: 'sticky',
                top: 96,
                border: '2px solid var(--ink)',
                background: '#fff',
                boxShadow: '6px 6px 0px 0px var(--ink)',
            }}
        >
            {/* Header */}
            <div
                className="assembly-panel-header"
                style={{
                    background: 'var(--ink)',
                    padding: '14px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid var(--ink)',
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--paper)',
                    }}
                >
                    [ OUTPUT ] // ASSEMBLED
                </span>
                <span
                    className="font-mono"
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'var(--accent)',
                    }}
                >
                    {fieldsComplete}/{fieldsTotal} COMPLETE
                </span>
            </div>

            {/* Output Area */}
            <div
                className="assembly-output-area"
                style={{
                    background: 'var(--ink)',
                    padding: 20,
                    maxHeight: 380,
                    overflowY: 'auto',
                    borderBottom: '2px solid var(--ink)',
                }}
            >
                {isEmpty ? (
                    <div
                        className="font-mono"
                        style={{
                            fontSize: 11,
                            fontWeight: 400,
                            lineHeight: 1.9,
                            color: 'rgba(239,239,233,0.25)',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {'> FILL IN FIELDS TO GENERATE\n> ASSEMBLED OUTPUT...'}
                        <span className="blinking-cursor" style={{ background: 'var(--paper)' }} />
                    </div>
                ) : (
                    <div
                        className="font-mono"
                        style={{
                            fontSize: 11,
                            fontWeight: 400,
                            lineHeight: 1.9,
                            color: 'var(--paper)',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {output}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div
                className="assembly-panel-actions"
                style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    borderBottom: '2px solid var(--ink)',
                    background: 'var(--paper)',
                }}
            >
                <button
                    className="tech-btn"
                    onClick={() => copy(output)}
                    disabled={isEmpty}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                    style={{
                        width: '100%',
                        ...(isEmpty ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
                        ...(copied ? { background: 'var(--accent)', borderColor: 'var(--accent)', boxShadow: '0 0 0 var(--ink)', transform: 'translate(4px, 4px)' } : {}),
                    }}
                >
                    {copied ? '✓ COPIED' : 'COPY TO CLIPBOARD'}
                </button>
                <button
                    className="tech-btn-outline"
                    onClick={handleDownload}
                    disabled={isEmpty}
                    style={{
                        width: '100%',
                        ...(isEmpty ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {}),
                    }}
                >
                    DOWNLOAD .MD ↓
                </button>
                <button
                    className="tech-btn-outline"
                    onClick={() => window.print()}
                    style={{ width: '100%' }}
                >
                    PRINT / SAVE AS PDF ↓
                </button>
            </div>

            {/* Clear Form */}
            <div style={{ padding: '12px 20px', background: 'var(--paper)' }}>
                {confirmClear ? (
                    <div style={{ textAlign: 'center' }}>
                        <div
                            className="font-mono"
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--accent)',
                                marginBottom: 8,
                            }}
                        >
                            CLEAR ALL? CANNOT BE UNDONE.
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                                onClick={() => setConfirmClear(false)}
                                className="tech-badge"
                                style={{ cursor: 'pointer' }}
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={() => { onClear(); setConfirmClear(false) }}
                                className="tech-badge tech-badge-accent"
                                style={{ cursor: 'pointer' }}
                            >
                                CLEAR
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmClear(true)}
                        className="font-mono"
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'rgba(10,10,10,0.3)',
                            cursor: 'pointer',
                            padding: 8,
                            textAlign: 'center',
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(10,10,10,0.3)'}
                    >
                        CLEAR ALL FIELDS
                    </button>
                )}
            </div>

            {/* Static Download Links */}
            <div
                className="assembly-panel-links"
                style={{
                    padding: '12px 20px',
                    borderTop: '2px solid var(--ink)',
                    background: '#fff',
                }}
            >
                <span
                    className="font-mono"
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'rgba(10,10,10,0.4)',
                        display: 'block',
                        marginBottom: 8,
                    }}
                >
          // STATIC VERSIONS
                </span>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {['NOTION', 'GOOGLE DOC', 'GITHUB'].map((name) => (
                        <a
                            key={name}
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="font-mono"
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'rgba(10,10,10,0.5)',
                                textDecoration: 'none',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(10,10,10,0.5)'}
                        >
                            → {name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
