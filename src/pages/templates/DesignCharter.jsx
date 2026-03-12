import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTemplateStorage } from '../../hooks/useTemplateStorage'
import { TemplateShell } from '../../components/templates/TemplateShell'
import { TemplateSection } from '../../components/templates/TemplateSection'
import { TemplateField } from '../../components/templates/TemplateField'
import { TemplateTextarea } from '../../components/templates/TemplateTextarea'
import { TemplateCheckbox } from '../../components/templates/TemplateCheckbox'
import { TemplateRadioGroup } from '../../components/templates/TemplateRadioGroup'
import { assembleCharter } from '../../utils/assembleCharter'

const INITIAL = {
    tier: 'full',
    projectName: '', product: '', timeline: '', date: '',
    edoName: '', edoRole: '', escalation: '',
    enforcement: { authority: false, dod: false, sprint: false },
    users: '', atRisk: '', voiceMechanism: '',
    businessMetric: '', businessEscalation: '',
    compliance: '', complianceReviewer: '',
    operations: '', opsNotify: '',
    accessibility: '',
    accessNeeds: '', testingMethod: '',
    userConstraints: '', businessConstraints: '',
    technicalConstraints: '', operationalConstraints: '',
    primaryMetric: '', leadingIndicator: '',
    timeframe: '', metricReviewer: '',
    criticalFailure: '', userHarm: '',
    orgRisk: '', wrongSignal: '',
    gate: { edo: false, accountability: false, accessibility: false, constraints: false, metrics: false },
    // Micro fields
    what: '', constraint: '', successSignal: '', failureSignal: '', naReason: '',
}

export default function DesignCharter() {
    const [state, setState, clearState] = useTemplateStorage('design-charter', INITIAL)
    const s = state

    const update = (key, val) => setState({ ...s, [key]: val })
    const updateEnf = (key, val) => setState({ ...s, enforcement: { ...s.enforcement, [key]: val } })
    const updateGate = (key, val) => setState({ ...s, gate: { ...s.gate, [key]: val } })

    const output = useMemo(() => assembleCharter(s), [s])

    const fieldsComplete = useMemo(() => {
        if (s.tier === 'micro') {
            return [s.edoName, s.what, s.constraint, s.successSignal, s.failureSignal, s.accessibility].filter(Boolean).length
        }
        return [
            s.projectName, s.product, s.timeline, s.date,
            s.edoName, s.edoRole, s.escalation,
            s.users, s.atRisk, s.voiceMechanism,
            s.businessMetric, s.businessEscalation,
            s.accessibility, s.accessNeeds, s.testingMethod,
            s.userConstraints, s.businessConstraints, s.technicalConstraints, s.operationalConstraints,
            s.primaryMetric, s.leadingIndicator, s.timeframe, s.metricReviewer,
            s.criticalFailure, s.userHarm, s.orgRisk, s.wrongSignal,
        ].filter(Boolean).length
    }, [s])

    const fieldsTotal = s.tier === 'micro' ? 6 : 27

    const allGateCleared = s.gate && Object.values(s.gate).every(Boolean)
    const gateCount = s.gate ? Object.values(s.gate).filter(Boolean).length : 0

    return (
        <TemplateShell
            phase="CHARTER"
            phaseNumber="SYS.PHASE_0"
            title="DESIGN CHARTER"
            description="The founding document of every project. Created before any artifact exists. Names the owner, defines constraints, and declares what would make this outcome fail."
            assembledOutput={output}
            templateName="design-charter"
            onClear={clearState}
            fieldsComplete={fieldsComplete}
            fieldsTotal={fieldsTotal}
        >
            {/* Tier Selector */}
            <TemplateSection
                label="SELECT TIER"
                sublabel="SCOPE"
                annotation="Choose the right tier for your project scope. Full Charter for new products. Sprint Charter for feature work. Micro Charter for single components."
            >
                <TemplateRadioGroup
                    variant="pills"
                    options={[
                        { value: 'full', label: 'FULL CHARTER' },
                        { value: 'sprint', label: 'SPRINT CHARTER' },
                        { value: 'micro', label: 'MICRO CHARTER' },
                    ]}
                    value={s.tier}
                    onChange={(v) => update('tier', v)}
                />
                <div
                    className="font-mono"
                    style={{
                        marginTop: 16, border: '2px solid var(--ink)',
                        background: 'var(--paper)', padding: '14px 16px',
                        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                    }}
                >
                    {s.tier === 'full' && '> COMPLETE ALL SECTIONS. ALL GATES RUN. ALLOW 2-4 HOURS FOR PHASE 0.'}
                    {s.tier === 'sprint' && '> SECTIONS 1-5. ACCESSIBILITY GATE NEVER COMPRESSES. ALLOW 30 MINUTES.'}
                    {s.tier === 'micro' && '> 5 FIELDS ONLY. ONE SLACK MESSAGE. 90 SECONDS.'}
                </div>
            </TemplateSection>

            <AnimatePresence mode="wait">
                {s.tier === 'micro' ? (
                    <motion.div key="micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <MicroFields s={s} update={update} />
                    </motion.div>
                ) : (
                    <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        <FullFields s={s} update={update} updateEnf={updateEnf} updateGate={updateGate} allGateCleared={allGateCleared} gateCount={gateCount} />
                    </motion.div>
                )}
            </AnimatePresence>
        </TemplateShell>
    )
}

function MicroFields({ s, update }) {
    return (
        <TemplateSection label="MICRO CHARTER" sublabel="TIER_C // 90_SECONDS" variant="gate"
            annotation="Complete these five fields. This is your Slack message or Notion comment. Takes 90 seconds.">
            <TemplateField label="OWNER (EDO)" required prefix=">" value={s.edoName} onChange={(v) => update('edoName', v)} />
            <TemplateTextarea label="WHAT CHANGES FOR WHOM" rows={2} required prefix=">"
                hint="ONE SENTENCE. SPECIFIC USER, SPECIFIC OUTCOME."
                value={s.what} onChange={(v) => update('what', v)} />
            <TemplateField label="TOP CONSTRAINT" required hint="WHAT CANNOT THIS DESIGN VIOLATE?"
                value={s.constraint} onChange={(v) => update('constraint', v)} />
            <TemplateField label="SUCCESS SIGNAL" required hint="HOW WILL YOU KNOW IT WORKED?"
                value={s.successSignal} onChange={(v) => update('successSignal', v)} />
            <TemplateField label="FAILURE SIGNAL" required hint="WHAT WOULD TELL YOU IT WENT WRONG?"
                value={s.failureSignal} onChange={(v) => update('failureSignal', v)} />
            <TemplateRadioGroup variant="pills" label="ACCESSIBILITY"
                options={[
                    { value: 'wcag21aa', label: 'WCAG 2.1 AA' },
                    { value: 'wcag22aa', label: 'WCAG 2.2 AA' },
                    { value: 'na', label: 'N/A + REASON' },
                ]}
                value={s.accessibility} onChange={(v) => update('accessibility', v)} />
            {s.accessibility === 'na' && (
                <TemplateField label="REASON FOR N/A" value={s.naReason} onChange={(v) => update('naReason', v)} />
            )}
        </TemplateSection>
    )
}

function FullFields({ s, update, updateEnf, updateGate, allGateCleared, gateCount }) {
    return (
        <>
            {/* Section 1 */}
            <TemplateSection label="PROJECT IDENTITY" sublabel="INTAKE" number="01">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="PROJECT NAME" required value={s.projectName} onChange={(v) => update('projectName', v)} />
                    <TemplateField label="PRODUCT / EXPERIENCE" value={s.product} onChange={(v) => update('product', v)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="TIMELINE" value={s.timeline} onChange={(v) => update('timeline', v)} />
                    <TemplateField label="DATE" placeholder="YYYY-MM-DD" value={s.date} onChange={(v) => update('date', v)} />
                </div>
            </TemplateSection>

            {/* Section 2 */}
            <TemplateSection label="EXPERIENCE DECISION OWNER" sublabel="EDO" number="02" variant="gate"
                annotation="One named human. Not a team. The person who accepts full accountability for this outcome.">
                <TemplateField label="EDO NAME" required prefix=">" hint="THE PERSON — NOT THE TEAM"
                    value={s.edoName} onChange={(v) => update('edoName', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <TemplateField label="ROLE / TITLE" required value={s.edoRole} onChange={(v) => update('edoRole', v)} />
                    <TemplateField label="ESCALATION PATH" value={s.escalation} onChange={(v) => update('escalation', v)} />
                </div>
                <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 20, marginTop: 20 }}>
                    <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, letterSpacing: '0.08em' }}>
                        [ ENFORCEMENT MODEL ] // SELECT_ONE_OR_MORE
                    </div>
                    <TemplateCheckbox label="EDO AUTHORITY — EDO SIGNS OFF BEFORE WORK BEGINS"
                        checked={s.enforcement.authority} onChange={(v) => updateEnf('authority', v)} />
                    <TemplateCheckbox label="DEFINITION OF DONE — CHARTER REQUIRED TO MOVE TICKET TO IN PROGRESS"
                        checked={s.enforcement.dod} onChange={(v) => updateEnf('dod', v)} />
                    <TemplateCheckbox label="SPRINT PLANNING GATE — CHARTER COMPLETED AS FIRST SPRINT ITEM"
                        checked={s.enforcement.sprint} onChange={(v) => updateEnf('sprint', v)} />
                </div>
            </TemplateSection>

            {/* Section 3 */}
            <TemplateSection label="ACCOUNTABILITY MAP" sublabel="WHO_ANSWERS_TO_WHOM" number="03"
                annotation="The EDO is accountable to all of the following. Complete every row.">
                <div style={{ borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: 16, marginBottom: 16 }}>
                    <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>USERS</div>
                    <TemplateTextarea label="PRIMARY USER POPULATION" rows={2} required prefix=">"
                        value={s.users} onChange={(v) => update('users', v)} />
                    <TemplateTextarea label="USERS MOST AT RISK IF THIS FAILS" rows={2} required prefix=">"
                        value={s.atRisk} onChange={(v) => update('atRisk', v)} />
                    <TemplateField label="HOW THEIR VOICE ENTERS THIS PROCESS"
                        value={s.voiceMechanism} onChange={(v) => update('voiceMechanism', v)} />
                </div>
                <div style={{ borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: 16, marginBottom: 16 }}>
                    <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>BUSINESS</div>
                    <TemplateField label="SUCCESS METRIC AND OWNER" value={s.businessMetric} onChange={(v) => update('businessMetric', v)} />
                    <TemplateField label="ESCALATION IF RECOMMENDATION IS OVERRIDDEN" value={s.businessEscalation} onChange={(v) => update('businessEscalation', v)} />
                </div>
                <div style={{ borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: 16, marginBottom: 16 }}>
                    <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>COMPLIANCE / LEGAL</div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'rgba(10,10,10,0.5)', marginBottom: 12 }}>// COMPLETE IF REGULATED CONTEXT</div>
                    <TemplateField label="APPLICABLE STANDARDS" value={s.compliance} onChange={(v) => update('compliance', v)} />
                    <TemplateField label="NAMED COMPLIANCE REVIEWER" value={s.complianceReviewer} onChange={(v) => update('complianceReviewer', v)} />
                </div>
                <div>
                    <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>OPERATIONS / SUPPORT</div>
                    <TemplateField label="WHO HANDLES POST-LAUNCH FAILURES" value={s.operations} onChange={(v) => update('operations', v)} />
                    <TemplateField label="HOW OPS IS NOTIFIED BEFORE SHIP" value={s.opsNotify} onChange={(v) => update('opsNotify', v)} />
                </div>
            </TemplateSection>

            {/* Section 4 */}
            <TemplateSection label="ACCESSIBILITY STANDARD" sublabel="DECLARE_BEFORE_GENERATION" number="04" variant="gate"
                annotation="Declare before anything is generated. This is a gate condition — not a checklist item.">
                <TemplateRadioGroup variant="cards"
                    options={[
                        { value: 'wcag21aa', label: 'WCAG 2.1 AA', description: 'Minimum standard for most products' },
                        { value: 'wcag22aa', label: 'WCAG 2.2 AA', description: 'Recommended for new products built today' },
                        { value: 'wcag21aaa', label: 'WCAG 2.1 AAA', description: 'When required by policy or regulation' },
                    ]}
                    value={s.accessibility} onChange={(v) => update('accessibility', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4" style={{ marginTop: 20 }}>
                    <TemplateField label="KNOWN ACCESS NEEDS IN USER POPULATION" value={s.accessNeeds} onChange={(v) => update('accessNeeds', v)} />
                    <TemplateField label="TESTING METHOD" hint="AUTOMATED TOOL + MANUAL WITH ASSISTIVE TECH" value={s.testingMethod} onChange={(v) => update('testingMethod', v)} />
                </div>
            </TemplateSection>

            {/* Section 5 */}
            <TemplateSection label="CONSTRAINTS" sublabel="NON_NEGOTIABLES" number="05" variant="key"
                annotation="Define what this design cannot violate. Pull from user, business, technical, and operational realities.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        ['USER CONSTRAINTS', 'userConstraints'],
                        ['BUSINESS CONSTRAINTS', 'businessConstraints'],
                        ['TECHNICAL CONSTRAINTS', 'technicalConstraints'],
                        ['OPERATIONAL CONSTRAINTS', 'operationalConstraints'],
                    ].map(([label, key]) => (
                        <div key={key} style={{ border: '2px solid var(--ink)', background: '#fff', padding: 20 }}>
                            <div className="font-mono" style={{
                                fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                                borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: 10, marginBottom: 16,
                            }}>
                                {label}
                            </div>
                            <TemplateTextarea rows={3} required label={label} value={s[key]} onChange={(v) => update(key, v)} />
                        </div>
                    ))}
                </div>
            </TemplateSection>

            {/* Section 6 */}
            <TemplateSection label="SUCCESS + FAILURE" sublabel="DEFINE_BOTH_BEFORE_BUILDING" number="06">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div style={{ border: '2px solid var(--ink)', padding: 24, background: 'var(--paper)' }}>
                        <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>WHAT SUCCESS LOOKS LIKE</div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'rgba(10,10,10,0.5)', marginBottom: 16 }}>// MEASURABLE. SPECIFIC. OWNED.</div>
                        <TemplateField label="PRIMARY METRIC" required value={s.primaryMetric} onChange={(v) => update('primaryMetric', v)} />
                        <TemplateField label="LEADING INDICATOR" value={s.leadingIndicator} onChange={(v) => update('leadingIndicator', v)} />
                        <TemplateField label="TIMEFRAME TO ASSESS" value={s.timeframe} onChange={(v) => update('timeframe', v)} />
                        <TemplateField label="WHO REVIEWS RESULTS" value={s.metricReviewer} onChange={(v) => update('metricReviewer', v)} />
                    </div>
                    <div style={{ border: '2px solid var(--ink)', borderLeft: '6px solid var(--accent)', padding: 24, background: 'var(--paper)', boxShadow: '4px 4px 0px 0px var(--accent)' }}>
                        <div className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>WHAT WOULD MAKE THIS A BAD OUTCOME</div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 16 }}>// NAME FAILURE BEFORE YOU BUILD</div>
                        <TemplateField label="CRITICAL FAILURE MODE" required value={s.criticalFailure} onChange={(v) => update('criticalFailure', v)} />
                        <TemplateField label="USER HARM SCENARIO" required value={s.userHarm} onChange={(v) => update('userHarm', v)} />
                        <TemplateField label="ORGANIZATIONAL RISK" value={s.orgRisk} onChange={(v) => update('orgRisk', v)} />
                        <TemplateField label="SIGNAL WE WERE WRONG" hint="SPECIFIC EVIDENCE THAT WOULD PROVE THIS DECISION WRONG" value={s.wrongSignal} onChange={(v) => update('wrongSignal', v)} />
                    </div>
                </div>
            </TemplateSection>

            {/* Section 7 */}
            <TemplateSection label="GATE TO PROCEED" sublabel="ALL_ITEMS_REQUIRED" number="07" variant="gate"
                annotation="All items must be checked before work begins. Unchecked items require an Uncharter Notice instead of proceeding.">
                <TemplateCheckbox variant="gate" label="NAMED EDO CONFIRMED WITH ENFORCEMENT MODEL"
                    checked={s.gate.edo} onChange={(v) => updateGate('edo', v)} />
                <TemplateCheckbox variant="gate" label="ACCOUNTABILITY MAP COMPLETE (ALL ROWS FILLED)"
                    checked={s.gate.accountability} onChange={(v) => updateGate('accountability', v)} />
                <TemplateCheckbox variant="gate" label="ACCESSIBILITY STANDARD DECLARED"
                    checked={s.gate.accessibility} onChange={(v) => updateGate('accessibility', v)} />
                <TemplateCheckbox variant="gate" label="ALL FOUR CONSTRAINT BUCKETS ADDRESSED"
                    checked={s.gate.constraints} onChange={(v) => updateGate('constraints', v)} />
                <TemplateCheckbox variant="gate" label="SUCCESS METRICS AND FAILURE CONDITIONS NAMED"
                    checked={s.gate.metrics} onChange={(v) => updateGate('metrics', v)} />

                <div style={{
                    marginTop: 20, border: '2px solid var(--ink)', padding: '16px 20px',
                    background: allGateCleared ? 'var(--ink)' : 'var(--paper)',
                    boxShadow: allGateCleared ? '4px 4px 0 var(--accent)' : 'none',
                    transition: 'all 0.25s ease',
                }}>
                    <div className="font-mono" style={{
                        fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
                        color: allGateCleared ? 'var(--paper)' : gateCount > 0 ? 'var(--accent)' : 'var(--ink)',
                    }}>
                        {allGateCleared ? '✓ GATE CLEARED — WORK MAY PROCEED'
                            : gateCount > 0 ? `○ ${gateCount} / 5 ITEMS CLEARED`
                                : '○ GATE NOT YET CLEARED'}
                    </div>
                </div>
            </TemplateSection>
        </>
    )
}
