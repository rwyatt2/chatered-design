import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTemplateStorage } from '../../hooks/useTemplateStorage'
import { TemplateShell } from '../../components/templates/TemplateShell'
import { TemplateSection } from '../../components/templates/TemplateSection'
import { TemplateField } from '../../components/templates/TemplateField'
import { TemplateTextarea } from '../../components/templates/TemplateTextarea'
import { TemplateRadioGroup } from '../../components/templates/TemplateRadioGroup'
import { TemplateVerdictSelector } from '../../components/templates/TemplateVerdictSelector'
import { TemplateGateStatus } from '../../components/templates/TemplateGateStatus'
import { assembleHarness } from '../../utils/assembleHarness'

const GATE_CRITERIA = [
    'KEYBOARD-ONLY NAVIGATION — ALL INTERACTIONS REACHABLE WITHOUT A MOUSE',
    'SCREEN READER LABELS — ALL INTERACTIVE ELEMENTS HAVE ACCURATE LABELS',
    'COLOR CONTRAST — WCAG AA MINIMUM (4.5:1 TEXT, 3:1 UI COMPONENTS)',
    'FOCUS INDICATORS — VISIBLE ON ALL INTERACTIVE ELEMENTS',
    'NO CONTENT CONVEYED BY COLOR ALONE — SECONDARY INDICATOR ALWAYS PRESENT',
    'MOTION — RESPECTS PREFERS-REDUCED-MOTION',
]

const DIMENSIONS = [
    {
        id: 'D-01', name: 'USABILITY', criteria: [
            'TASK COMPLETION ACHIEVABLE WITHOUT ASSISTANCE OR PRIOR KNOWLEDGE',
            'ERROR STATES CLEAR, RECOVERABLE, AND EXPLAIN WHAT HAPPENED',
            'NEW USERS CAN ORIENT WITHIN 60 SECONDS OF ARRIVING',
            'COGNITIVE LOAD MATCHES USER CONTEXT AND CAPABILITY',
        ]
    },
    {
        id: 'D-02', name: 'CLARITY', criteria: [
            'VOCABULARY MATCHES USER MENTAL MODELS — NOT INTERNAL TEAM LANGUAGE',
            'EVERY LABEL, HEADING, AND CTA UNAMBIGUOUS IN ISOLATION',
            'HIERARCHY REFLECTS ACTUAL USER PRIORITY — NOT BUSINESS PRIORITY',
            'EMPTY, LOADING, AND ERROR STATES FULLY SPECIFIED',
        ]
    },
    {
        id: 'D-03', name: 'CONSISTENCY', criteria: [
            'INTERACTION PATTERNS MATCH ESTABLISHED DESIGN SYSTEM',
            'TERMINOLOGY CONSISTENT ACROSS ALL SURFACES AND FLOWS',
            'NO ARBITRARY VARIATIONS IN VISUAL TREATMENT OF SIMILAR COMPONENTS',
            'DEVIATIONS FROM SYSTEM DOCUMENTED AND INTENTIONAL',
        ]
    },
    {
        id: 'D-04', name: 'TRUST + SAFETY', criteria: [
            'NO DARK PATTERNS — CONSENT IS INFORMED, OPT-IN, AND REVOCABLE',
            'SENSITIVE DATA HANDLING TRANSPARENT TO THE USER',
            'FAILURE MODES DO NOT LEAVE USERS IN STATES OF UNCERTAINTY OR HARM',
            'LANGUAGE FREE OF MANIPULATIVE TACTICS, URGENCY, OR COGNITIVE BIAS',
        ]
    },
    {
        id: 'D-05', name: 'PERFORMANCE + TECHNICAL', criteria: [
            'CORE FLOWS WORK ON ALL TARGET DEVICES AND NETWORK CONDITIONS',
            'ANIMATIONS RESPECT PREFERS-REDUCED-MOTION',
            'LOADING STATES PRESENT AND ACCURATE FOR ALL ASYNC OPERATIONS',
            'NO FUNCTIONALITY DEGRADES SILENTLY',
        ]
    },
    {
        id: 'D-06', name: 'EDGE CASES + RESILIENCE', criteria: [
            'EMPTY STATES DESIGNED — NOT LEFT TO DEFAULT SYSTEM BEHAVIOR',
            'ERROR MESSAGES HUMAN-READABLE AND ACTIONABLE',
            'EXTREME DATA CASES TESTED — LONG TEXT, ZERO ITEMS, MAX ITEMS, SPECIAL CHARACTERS',
            'FAILURE PATHS RETURN USERS TO A KNOWN SAFE STATE',
        ]
    },
    {
        id: 'D-07', name: 'DOCUMENTATION + HANDOFF', criteria: [
            'ALL DECISIONS DOCUMENTED IN DECISION LOG BEFORE HANDOFF',
            'DEV ANNOTATIONS PRESENT FOR ALL NON-OBVIOUS INTERACTIONS',
            'ACCESSIBILITY REQUIREMENTS DOCUMENTED PER COMPONENT',
            'POST-LAUNCH REVIEW DATE AND OWNER NAMED BEFORE SHIP',
        ]
    },
]

const INITIAL = {
    project: '', evaluator: '', date: '',
    gate: GATE_CRITERIA.map(() => ({ value: '' })),
    gateClearedBy: '', gateDate: '',
    dimensions: DIMENSIONS.map(() => ({
        verdict: '', notes: '',
        criteria: DIMENSIONS[0].criteria.map(() => ''),
        mitigation: '', mitigationOwner: '', mitigationDate: '',
    })),
    overallVerdict: '', verdictRationale: '', pmSignoff: '',
}

// Fix: initialize dimensions properly
function getInitial() {
    return {
        ...INITIAL,
        dimensions: DIMENSIONS.map((d) => ({
            verdict: '', notes: '',
            criteria: d.criteria.map(() => ''),
            mitigation: '', mitigationOwner: '', mitigationDate: '',
        })),
    }
}

export default function EvaluationHarness() {
    const [state, setState, clearState] = useTemplateStorage('evaluation-harness', getInitial())
    const [openDim, setOpenDim] = useState(null)
    const shouldReduce = useReducedMotion()
    const s = state

    const update = (key, val) => setState({ ...s, [key]: val })
    const updateGate = (index, val) => {
        const newGate = [...s.gate]
        newGate[index] = { ...newGate[index], value: val }
        setState({ ...s, gate: newGate })
    }
    const updateDim = (index, key, val) => {
        const newDims = [...s.dimensions]
        newDims[index] = { ...newDims[index], [key]: val }
        setState({ ...s, dimensions: newDims })
    }
    const toggleCriteria = (dimIndex, critIndex) => {
        const newDims = [...s.dimensions]
        const crit = [...newDims[dimIndex].criteria]
        crit[critIndex] = crit[critIndex] === 'pass' ? 'fail' : crit[critIndex] === 'fail' ? '' : 'pass'
        newDims[dimIndex] = { ...newDims[dimIndex], criteria: crit }
        setState({ ...s, dimensions: newDims })
    }

    const gateStatus = useMemo(() => {
        const vals = s.gate.map(g => g.value || '')
        if (vals.every(v => v === 'pass' || v === 'na')) return 'cleared'
        if (vals.some(v => v === 'fail')) return 'failed'
        return 'incomplete'
    }, [s.gate])

    const output = useMemo(() => assembleHarness(s), [s])

    const { passCount, mitigateCount, failCount } = useMemo(() => {
        let p = 0, m = 0, f = 0
        s.dimensions.forEach(d => {
            if (d.verdict === 'pass') p++
            else if (d.verdict === 'mitigate') m++
            else if (d.verdict === 'fail') f++
        })
        return { passCount: p, mitigateCount: m, failCount: f }
    }, [s.dimensions])

    const fieldsComplete = useMemo(() => {
        return [s.project, s.evaluator, s.date, ...s.gate.map(g => g.value),
        ...s.dimensions.map(d => d.verdict), s.overallVerdict].filter(Boolean).length
    }, [s])

    return (
        <TemplateShell
            phase="EVALUATE"
            phaseNumber="SYS.PHASE_5"
            title="EVALUATION HARNESS"
            description="Seven-dimension systematic evaluation. Accessibility runs as a gate condition — not one of seven equal dimensions."
            assembledOutput={output}
            templateName="evaluation-harness"
            onClear={clearState}
            fieldsComplete={fieldsComplete}
            fieldsTotal={20}
        >
            <TemplateGateStatus status={gateStatus} />

            {/* Section 0: Context */}
            <TemplateSection label="EVALUATION CONTEXT" sublabel="PROJECT_DETAILS">
                <TemplateField label="PROJECT / EXPERIENCE" value={s.project} onChange={(v) => update('project', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="EVALUATOR (EDO)" value={s.evaluator} onChange={(v) => update('evaluator', v)} />
                    <TemplateField label="DATE" placeholder="YYYY-MM-DD" value={s.date} onChange={(v) => update('date', v)} />
                </div>
            </TemplateSection>

            {/* Section 1: Accessibility Gate */}
            <TemplateSection label="★ ACCESSIBILITY GATE" sublabel="PREREQUISITE_NOT_A_DIMENSION" variant="gate"
                annotation="All six items must pass before the harness opens. This is a gate condition. Not one of seven equal dimensions.">
                {GATE_CRITERIA.map((criterion, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between',
                        padding: '14px 0', borderBottom: '1px solid rgba(10,10,10,0.08)',
                        flexWrap: 'wrap',
                    }}>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 500, flex: 1, minWidth: 200 }}>
                            {criterion}
                        </span>
                        <TemplateRadioGroup variant="pills"
                            options={[
                                { value: 'pass', label: 'PASS' },
                                { value: 'fail', label: 'FAIL' },
                                { value: 'na', label: 'N/A' },
                            ]}
                            value={s.gate[i]?.value || ''}
                            onChange={(v) => updateGate(i, v)}
                        />
                    </div>
                ))}
                <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 16, marginTop: 8 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <TemplateField label="GATE CLEARED BY" value={s.gateClearedBy} onChange={(v) => update('gateClearedBy', v)} />
                        <TemplateField label="DATE" value={s.gateDate} onChange={(v) => update('gateDate', v)} />
                    </div>
                </div>
            </TemplateSection>

            {/* 7 Dimension Panels */}
            <div style={{
                ...(gateStatus !== 'cleared' ? { opacity: 0.35, pointerEvents: 'none', position: 'relative' } : {}),
            }}
                aria-disabled={gateStatus !== 'cleared'}
            >
                {gateStatus !== 'cleared' && (
                    <div style={{
                        border: '2px solid var(--ink)', background: 'var(--paper)',
                        padding: '16px 24px', marginBottom: 24,
                    }}>
                        <span className="font-mono" style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                            ○ COMPLETE ACCESSIBILITY GATE TO UNLOCK DIMENSIONS
                        </span>
                    </div>
                )}

                {DIMENSIONS.map((dim, i) => (
                    <DimensionPanel
                        key={dim.id}
                        dim={dim}
                        index={i}
                        data={s.dimensions[i]}
                        isOpen={openDim === i}
                        onToggle={() => setOpenDim(openDim === i ? null : i)}
                        onVerdictChange={(v) => updateDim(i, 'verdict', v)}
                        onNotesChange={(v) => updateDim(i, 'notes', v)}
                        onCriteriaToggle={(ci) => toggleCriteria(i, ci)}
                        onMitigationChange={(key, v) => updateDim(i, key, v)}
                        shouldReduce={shouldReduce}
                    />
                ))}
            </div>

            {/* Harness Summary */}
            <TemplateSection label="HARNESS SUMMARY" sublabel="OVERALL_VERDICT" variant="gate">
                <div style={{
                    border: '2px solid var(--ink)', display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24,
                }}>
                    {[
                        { count: passCount, label: 'PASS', color: 'var(--ink)' },
                        { count: mitigateCount, label: 'MITIGATE', color: 'var(--accent)' },
                        { count: failCount, label: 'FAIL', color: 'var(--accent)' },
                    ].map((item, i) => (
                        <div key={item.label} style={{
                            padding: '20px 24px', textAlign: 'center',
                            borderRight: i < 2 ? '2px solid var(--ink)' : 'none',
                        }}>
                            <span className="neo-grotesque" style={{
                                fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900,
                                letterSpacing: '-0.05em', display: 'block', color: item.color,
                            }}>
                                {item.count}
                            </span>
                            <span className="font-mono" style={{
                                fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                                display: 'block', marginTop: 4, color: 'rgba(10,10,10,0.5)',
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <TemplateRadioGroup variant="cards"
                    options={[
                        { value: 'ship', label: '✓ SHIP', description: 'ALL DIMENSIONS PASS. NO UNRESOLVED FAILS.' },
                        { value: 'ship-mitigations', label: '⚡ SHIP WITH MITIGATIONS', description: 'ALL FAILS HAVE NAMED MITIGATIONS AND OWNERS.' },
                        { value: 'do-not-ship', label: '✗ DO NOT SHIP', description: 'UNRESOLVED FAILS PRESENT. WORK MUST CONTINUE.' },
                    ]}
                    value={s.overallVerdict} onChange={(v) => update('overallVerdict', v)} />

                <TemplateTextarea label="VERDICT RATIONALE" rows={3}
                    hint="ONE PARAGRAPH. ATTACH TO DECISION LOG."
                    value={s.verdictRationale} onChange={(v) => update('verdictRationale', v)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="EVALUATOR (EDO)" value={s.evaluator} onChange={(v) => update('evaluator', v)} />
                    <TemplateField label="PM SIGN-OFF" value={s.pmSignoff} onChange={(v) => update('pmSignoff', v)} />
                </div>
            </TemplateSection>
        </TemplateShell>
    )
}

function DimensionPanel({ dim, index, data, isOpen, onToggle, onVerdictChange, onNotesChange, onCriteriaToggle, onMitigationChange, shouldReduce }) {
    const borderColors = { pass: 'var(--ink)', mitigate: 'var(--accent)', fail: 'var(--accent)' }
    const leftBorder = borderColors[data.verdict] || 'rgba(10,10,10,0.2)'

    return (
        <div style={{
            border: '2px solid var(--ink)', marginBottom: 12,
            borderLeft: `4px solid ${leftBorder}`,
            transition: 'border-color 0.15s',
            ...(data.verdict === 'fail' ? { borderColor: 'var(--accent)' } : {}),
        }}>
            <div
                onClick={onToggle}
                style={{
                    padding: '16px 20px', background: 'var(--paper)',
                    borderBottom: isOpen ? '2px solid var(--ink)' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10,10,10,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--paper)'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="tech-badge">{dim.id}</span>
                    <span className="neo-grotesque" style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
                        {dim.name}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TemplateVerdictSelector value={data.verdict} onChange={onVerdictChange} />
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="font-mono"
                        style={{ fontSize: 16 }}
                    >
                        ↕
                    </motion.span>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: shouldReduce ? 0.01 : 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: shouldReduce ? 0.01 : 0.25, delay: isOpen ? 0.05 : 0 },
                        }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '24px 20px', background: '#fff' }}>
                            {dim.criteria.map((criterion, ci) => (
                                <div
                                    key={ci}
                                    onClick={() => onCriteriaToggle(ci)}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 12,
                                        padding: '10px 0', borderBottom: '1px solid rgba(10,10,10,0.06)',
                                        cursor: 'pointer', transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--paper)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: 20, height: 20, border: '2px solid var(--ink)',
                                        flexShrink: 0, marginTop: 1, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        background: data.criteria[ci] === 'pass' ? 'var(--ink)' : data.criteria[ci] === 'fail' ? 'var(--accent)' : '#fff',
                                        transition: 'all 0.15s',
                                    }}>
                                        {data.criteria[ci] === 'pass' && <span style={{ color: 'var(--paper)', fontSize: 12, fontWeight: 800 }}>✓</span>}
                                        {data.criteria[ci] === 'fail' && <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>✗</span>}
                                    </div>
                                    <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>
                                        {criterion}
                                    </span>
                                </div>
                            ))}

                            <div style={{ marginTop: 16, borderTop: '1px solid rgba(10,10,10,0.08)', paddingTop: 16 }}>
                                <TemplateTextarea label="EVALUATOR NOTES" rows={2}
                                    value={data.notes} onChange={onNotesChange} />
                            </div>

                            <AnimatePresence>
                                {data.verdict === 'mitigate' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: shouldReduce ? 0.01 : 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            borderTop: '2px solid var(--accent)', paddingTop: 16, marginTop: 16,
                                            background: 'var(--paper)', padding: 16,
                                        }}>
                                            <div className="font-mono" style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, fontWeight: 800 }}>
                                                [ MITIGATION REQUIRED ]
                                            </div>
                                            <TemplateTextarea label="MITIGATION PLAN" rows={2}
                                                value={data.mitigation} onChange={(v) => onMitigationChange('mitigation', v)} />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                                <TemplateField label="MITIGATION OWNER"
                                                    value={data.mitigationOwner} onChange={(v) => onMitigationChange('mitigationOwner', v)} />
                                                <TemplateField label="REVIEW DATE"
                                                    value={data.mitigationDate} onChange={(v) => onMitigationChange('mitigationDate', v)} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
