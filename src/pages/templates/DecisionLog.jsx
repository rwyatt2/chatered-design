import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTemplateStorage } from '../../hooks/useTemplateStorage'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { TemplateShell } from '../../components/templates/TemplateShell'
import { TemplateSection } from '../../components/templates/TemplateSection'
import { TemplateField } from '../../components/templates/TemplateField'
import { TemplateTextarea } from '../../components/templates/TemplateTextarea'
import { TemplateRadioGroup } from '../../components/templates/TemplateRadioGroup'
import { Toast } from '../../components/templates/Toast'
import { assembleDecisionLog, assembleFullDecisionLog } from '../../utils/assembleDecisionLog'

const INITIAL_ENTRY = {
    id: '', title: '', owner: '', date: '',
    status: '', risk: '', area: '',
    context: '', constraints: '',
    option1: '', option1rejected: '',
    option2: '', option2rejected: '',
    option3: '', option3rejected: '',
    chosen: '', rationale: '',
    risks: '', mitigations: '',
    whatWouldChangeOurMind: '',
    followUpDate: '', followUpReviewer: '',
}

export default function DecisionLog() {
    const [current, setCurrent, clearCurrent] = useTemplateStorage('decision-log-current', INITIAL_ENTRY)
    const [entries, setEntries] = useTemplateStorage('decision-log-entries', [])
    const [activeView, setActiveView] = useState('entry')
    const [editingId, setEditingId] = useState(null)
    const [expandedRow, setExpandedRow] = useState(null)
    const [toast, setToast] = useState({ visible: false, message: '' })
    const { copy } = useCopyToClipboard()

    const update = (key, val) => setCurrent({ ...current, [key]: val })

    const output = useMemo(() => assembleDecisionLog(current), [current])

    const fieldsComplete = useMemo(() => {
        return [
            current.id, current.title, current.owner, current.date,
            current.status, current.risk, current.area,
            current.context, current.constraints,
            current.option1, current.chosen, current.rationale,
            current.whatWouldChangeOurMind,
        ].filter(Boolean).length
    }, [current])

    const showToast = (msg) => setToast({ visible: true, message: msg })

    const saveEntry = () => {
        if (editingId) {
            setEntries(entries.map(e => e.id === editingId ? { ...current } : e))
            showToast(`✓ ${current.id || 'ENTRY'} UPDATED`)
            setEditingId(null)
        } else {
            setEntries([...entries, { ...current }])
            showToast(`✓ ${current.id || 'ENTRY'} SAVED TO LOG`)
        }
        clearCurrent()
        setActiveView('entries')
    }

    const editEntry = (entry) => {
        setCurrent(entry)
        setEditingId(entry.id)
        setActiveView('entry')
    }

    const deleteEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id))
        showToast('✗ ENTRY DELETED')
    }

    const cancelEdit = () => {
        setEditingId(null)
        clearCurrent()
        setActiveView('entries')
    }

    const exportFullLog = () => {
        const text = assembleFullDecisionLog(entries)
        const blob = new Blob([text], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'decision-log-full.md'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <TemplateShell
            phase="DECIDE"
            phaseNumber="SYS.PHASE_4"
            title="DECISION LOG"
            description="A per-decision audit trail with rationale, constraints, risks, and a falsifiability test. Designed to survive the project."
            assembledOutput={output}
            templateName="decision-log"
            onClear={() => { clearCurrent(); setEditingId(null) }}
            fieldsComplete={fieldsComplete}
            fieldsTotal={13}
        >
            {/* View Toggle */}
            <div className="view-toggle" style={{ display: 'flex', border: '2px solid var(--ink)', marginBottom: 32 }}>
                {['entry', 'entries'].map((view) => (
                    <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className="font-mono"
                        style={{
                            flex: 1, padding: '12px 24px',
                            fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
                            background: activeView === view ? 'var(--ink)' : 'var(--paper)',
                            color: activeView === view ? 'var(--paper)' : 'var(--ink)',
                            border: 'none', borderRight: view === 'entry' ? '2px solid var(--ink)' : 'none',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                    >
                        {view === 'entry' ? 'CURRENT ENTRY' : `ALL ENTRIES (${entries.length})`}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'entry' ? (
                    <motion.div key="entry" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        {editingId && (
                            <div style={{
                                border: '2px solid var(--accent)', background: 'var(--paper)',
                                padding: '12px 20px', marginBottom: 24,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <span className="font-mono" style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>
                                    ⚡ EDITING: {current.id} — {current.title}
                                </span>
                                <button onClick={cancelEdit} className="tech-btn-outline" style={{ fontSize: 11, padding: '8px 14px' }}>
                                    CANCEL EDIT ✗
                                </button>
                            </div>
                        )}

                        <EntryForm current={current} update={update} />

                        <button className="tech-btn save-to-log-btn" onClick={saveEntry} style={{ width: '100%', marginTop: 24 }}>
                            {editingId ? 'UPDATE LOG ENTRY →' : 'SAVE TO LOG →'}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="entries" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <EntriesView
                            entries={entries}
                            expandedRow={expandedRow}
                            setExpandedRow={setExpandedRow}
                            onEdit={editEntry}
                            onDelete={deleteEntry}
                            onCopy={(entry) => { copy(assembleDecisionLog(entry)); showToast('✓ ENTRY COPIED TO CLIPBOARD') }}
                            onNewEntry={() => { clearCurrent(); setEditingId(null); setActiveView('entry') }}
                            onExport={exportFullLog}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast message={toast.message} visible={toast.visible} onDismiss={() => setToast(t => ({ ...t, visible: false }))} />
        </TemplateShell>
    )
}

function EntryForm({ current, update }) {
    return (
        <>
            <TemplateSection label="DECISION IDENTITY" sublabel="INTAKE" number="01">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="DECISION ID" placeholder="DEC-001" value={current.id} onChange={(v) => update('id', v)} />
                    <TemplateField label="DATE" placeholder="YYYY-MM-DD" value={current.date} onChange={(v) => update('date', v)} />
                </div>
                <TemplateField label="DECISION TITLE" required prefix=">" hint="STATE THE DECISION IN ONE SENTENCE"
                    value={current.title} onChange={(v) => update('title', v)} />
                <TemplateField label="OWNER (EDO)" required value={current.owner} onChange={(v) => update('owner', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateRadioGroup variant="pills" label="STATUS"
                        options={[
                            { value: 'open', label: 'OPEN' },
                            { value: 'under-review', label: 'UNDER REVIEW' },
                            { value: 'resolved', label: 'RESOLVED' },
                            { value: 'superseded', label: 'SUPERSEDED' },
                        ]}
                        value={current.status} onChange={(v) => update('status', v)} />
                    <TemplateRadioGroup variant="pills" label="RISK LEVEL"
                        options={[
                            { value: 'high', label: 'HIGH' },
                            { value: 'medium', label: 'MEDIUM' },
                            { value: 'low', label: 'LOW' },
                        ]}
                        value={current.risk} onChange={(v) => update('risk', v)} />
                </div>
                <TemplateField label="DECISION AREA" placeholder="NAVIGATION / PERMISSIONS / PRICING / CONTENT / TECHNICAL / ACCESSIBILITY / POLICY"
                    value={current.area} onChange={(v) => update('area', v)} />
            </TemplateSection>

            <TemplateSection label="CONTEXT" sublabel="WHAT_PROMPTED_THIS" number="02">
                <TemplateTextarea label="CONTEXT / PROBLEM" rows={4} required prefix=">"
                    hint="WHAT WAS THE SITUATION OR DESIGN QUESTION THAT MADE THIS DECISION NECESSARY?"
                    value={current.context} onChange={(v) => update('context', v)} />
            </TemplateSection>

            <TemplateSection label="CONSTRAINTS" sublabel="NON_NEGOTIABLES" number="03" variant="key">
                <TemplateTextarea label="CONSTRAINTS FROM DESIGN CHARTER" rows={3} prefix=">"
                    hint="LIST THE CONSTRAINTS THAT APPLIED TO THIS DECISION"
                    value={current.constraints} onChange={(v) => update('constraints', v)} />
            </TemplateSection>

            <TemplateSection label="OPTIONS CONSIDERED" sublabel="WHAT_WAS_REJECTED_AND_WHY" number="04"
                annotation="Document at least 2 options. Fewer than 2 means the decision was made before this log was opened.">
                {[1, 2, 3].map((n) => (
                    <div key={n} style={{ border: '2px solid var(--ink)', padding: 20, background: 'var(--paper)', marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: 10 }}>
                            <span className="font-mono" style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>OPTION {n}</span>
                        </div>
                        <TemplateField label="OPTION DESCRIPTION" placeholder="DESCRIBE THIS OPTION"
                            value={current[`option${n}`]} onChange={(v) => update(`option${n}`, v)} />
                        <TemplateField label="WHY REJECTED" placeholder="WHY WAS THIS NOT CHOSEN?"
                            value={current[`option${n}rejected`]} onChange={(v) => update(`option${n}rejected`, v)} />
                    </div>
                ))}
            </TemplateSection>

            <TemplateSection label="THE DECISION" sublabel="CHOSEN_DIRECTION" number="05" variant="gate">
                <TemplateTextarea label="CHOSEN OPTION" required rows={2} prefix=">" hint="STATE THE DECISION. ONE SENTENCE."
                    value={current.chosen} onChange={(v) => update('chosen', v)} />
                <TemplateTextarea label="RATIONALE (EVIDENCE-BACKED)" rows={4} required
                    hint="WHAT EVIDENCE OR REASONING SUPPORTS THIS CHOICE OVER THE ALTERNATIVES?"
                    value={current.rationale} onChange={(v) => update('rationale', v)} />
            </TemplateSection>

            <TemplateSection label="RISK + MITIGATION" sublabel="WHAT_CAN_GO_WRONG" number="06">
                <TemplateTextarea label="RISKS AND FAILURE MODES" rows={3} prefix="✗" hint="LIST EACH RISK ON A NEW LINE"
                    value={current.risks} onChange={(v) => update('risks', v)} />
                <TemplateTextarea label="MITIGATIONS" rows={3} prefix=">" hint="HOW WILL EACH RISK BE ADDRESSED?"
                    value={current.mitigations} onChange={(v) => update('mitigations', v)} />
            </TemplateSection>

            <TemplateSection label="WHAT WOULD CHANGE OUR MIND" sublabel="KEY_FIELD" number="07" variant="key"
                annotation="The most important field. The specific signal or evidence that would cause this decision to be reversed.">
                <div style={{ border: '2px solid var(--accent)', background: 'var(--paper)', padding: 24, boxShadow: '6px 6px 0px var(--accent)' }}>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgba(10,10,10,0.5)', fontStyle: 'italic', marginBottom: 16 }}>
                        &quot;NOT &apos;IF USERS DON&apos;T LIKE IT&apos; — BUT &apos;IF TASK COMPLETION DROPS BELOW X% IN THE FIRST 30 DAYS.&apos;&quot;
                    </div>
                    <TemplateTextarea label="WHAT WOULD CHANGE OUR MIND" rows={3} required prefix=">"
                        value={current.whatWouldChangeOurMind} onChange={(v) => update('whatWouldChangeOurMind', v)} />
                </div>
            </TemplateSection>

            <TemplateSection label="FOLLOW-UP" sublabel="CLOSE_THE_LOOP" number="08">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="FOLLOW-UP DATE" placeholder="YYYY-MM-DD" value={current.followUpDate} onChange={(v) => update('followUpDate', v)} />
                    <TemplateField label="WHO REVIEWS" value={current.followUpReviewer} onChange={(v) => update('followUpReviewer', v)} />
                </div>
            </TemplateSection>
        </>
    )
}

function EntriesView({ entries, expandedRow, setExpandedRow, onEdit, onDelete, onCopy, onNewEntry, onExport }) {
    return (
        <>
            <div style={{
                border: '2px solid var(--ink)', borderBottom: 0, padding: '16px 24px',
                background: 'var(--paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span className="font-mono" style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                    {entries.length} DECISIONS LOGGED
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={onExport} className="tech-btn-outline" disabled={entries.length === 0}
                        style={{ padding: '10px 16px', fontSize: 11, opacity: entries.length === 0 ? 0.4 : 1 }}>
                        EXPORT LOG ↓
                    </button>
                    <button onClick={onNewEntry} className="tech-btn-outline" style={{ padding: '10px 16px', fontSize: 11 }}>
                        + NEW DECISION
                    </button>
                </div>
            </div>

            {entries.length === 0 ? (
                <div style={{
                    border: '2px solid var(--ink)', padding: '48px 24px', textAlign: 'center',
                    background: '#fff',
                }}>
                    <div className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: 'rgba(10,10,10,0.3)', textTransform: 'uppercase' }}>
                        NO DECISIONS LOGGED YET
                    </div>
                </div>
            ) : (
                <div style={{ border: '2px solid var(--ink)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                        <thead>
                            <tr style={{ background: 'var(--ink)', borderBottom: '2px solid var(--ink)' }}>
                                {['ID', 'DECISION', 'OWNER', 'RISK', 'STATUS', 'DATE', '↕'].map((h) => (
                                    <th key={h} className="font-mono" style={{
                                        padding: '12px 16px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                                        color: 'var(--paper)', letterSpacing: '0.1em', textAlign: 'left',
                                        borderRight: '1px solid rgba(239,239,233,0.15)',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <EntryRow
                                    key={entry.id || Math.random()}
                                    entry={entry}
                                    isExpanded={expandedRow === entry.id}
                                    onToggle={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onCopy={onCopy}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

function EntryRow({ entry, isExpanded, onToggle, onEdit, onDelete, onCopy }) {
    const statusColors = { open: 'var(--accent)', resolved: 'var(--ink)', superseded: 'rgba(10,10,10,0.2)', 'under-review': 'rgba(10,10,10,0.5)' }
    const borderColor = statusColors[entry.status] || 'rgba(10,10,10,0.2)'

    return (
        <>
            <tr
                onClick={onToggle}
                style={{
                    borderBottom: '1px solid rgba(10,10,10,0.08)',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: isExpanded ? 'var(--paper)' : '#fff',
                    borderLeft: `4px solid ${borderColor}`,
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = 'var(--paper)' }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = '#fff' }}
            >
                <td className="font-mono" style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: 'var(--accent)' }}>{entry.id || '—'}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700 }}>{entry.title || '—'}</td>
                <td className="font-mono" style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, color: 'rgba(10,10,10,0.5)' }}>{entry.owner || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                    <span className="tech-badge" style={entry.risk === 'high' ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } : {}}>{entry.risk?.toUpperCase() || '—'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}><span className="tech-badge">{entry.status?.toUpperCase() || '—'}</span></td>
                <td className="font-mono" style={{ padding: '14px 16px', fontSize: 11, fontWeight: 700, color: 'rgba(10,10,10,0.5)' }}>{entry.date || '—'}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>↕</span>
                </td>
            </tr>
            <AnimatePresence>
                {isExpanded && (
                    <tr>
                        <td colSpan={7} style={{ padding: 0 }}>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 } }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ background: 'var(--paper)', borderBottom: '2px solid var(--ink)', padding: '24px 20px 24px 24px' }}>
                                    {[
                                        ['CONTEXT', entry.context],
                                        ['CHOSEN', entry.chosen],
                                        ['RATIONALE', entry.rationale],
                                        ['WHAT WOULD CHANGE OUR MIND', entry.whatWouldChangeOurMind],
                                        ['FOLLOW-UP', `${entry.followUpDate || '—'} // ${entry.followUpReviewer || '—'}`],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ marginBottom: 12 }}>
                                            <div className="font-mono" style={{ fontSize: 9, color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 2 }}>{label}</div>
                                            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 500 }}>{val || '—'}</div>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(entry) }} className="tech-btn-outline" style={{ fontSize: 11, padding: '8px 14px' }}>EDIT</button>
                                        <button onClick={(e) => { e.stopPropagation(); onCopy(entry) }} className="tech-btn-outline" style={{ fontSize: 11, padding: '8px 14px' }}>COPY TEXT</button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                                            className="font-mono" style={{ fontSize: 11, fontWeight: 800, padding: '8px 14px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', transition: 'color 0.15s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(10,10,10,0.4)'}
                                        >
                                            DELETE ✗
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    )
}
