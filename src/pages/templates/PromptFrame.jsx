import { useMemo, useState } from 'react'
import { useTemplateStorage } from '../../hooks/useTemplateStorage'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { TemplateShell } from '../../components/templates/TemplateShell'
import { TemplateSection } from '../../components/templates/TemplateSection'
import { TemplateField } from '../../components/templates/TemplateField'
import { TemplateTextarea } from '../../components/templates/TemplateTextarea'
import { assemblePromptFrame } from '../../utils/assemblePromptFrame'

const INITIAL = {
    who: '', what: '', mustNot: '', technical: '',
    tone: '', toneNot: '',
    examplesRight: '', examplesWrong: '', variants: '',
}

export default function PromptFrame() {
    const [state, setState, clearState] = useTemplateStorage('prompt-frame', INITIAL)
    const [showReminder, setShowReminder] = useState(false)
    const { copy, copied } = useCopyToClipboard()
    const s = state

    const update = (key, val) => setState({ ...s, [key]: val })

    const output = useMemo(() => assemblePromptFrame(s), [s])

    const fieldsComplete = useMemo(() => {
        return [s.who, s.what, s.mustNot, s.technical, s.tone, s.toneNot, s.examplesRight, s.examplesWrong, s.variants].filter(Boolean).length
    }, [s])

    const handleCopy = () => {
        copy(output)
        setShowReminder(true)
        setTimeout(() => setShowReminder(false), 4000)
    }

    return (
        <TemplateShell
            phase="GENERATE"
            phaseNumber="SYS.PHASE_3"
            title="PROMPT FRAME"
            description="Redefines AI prompting as constraint specification. The assembled prompt is ready to paste into any AI tool."
            assembledOutput={output}
            templateName="prompt-frame"
            onClear={clearState}
            fieldsComplete={fieldsComplete}
            fieldsTotal={9}
        >
            {/* AI Intro Card */}
            <div style={{
                border: '3px dashed var(--ink)',
                padding: '24px 28px',
                marginBottom: 32,
            }}
                className="hatched-bg"
            >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <span className="font-mono" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>&gt;</span>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                        AI-ASSISTED — HOW TO USE THIS TEMPLATE
                    </span>
                </div>
                <p style={{
                    fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 500,
                    color: 'rgba(10,10,10,0.6)', lineHeight: 1.6,
                }}>
                    Fill in all seven fields. The assembled prompt appears in real time in the panel on the right.
                    When complete, copy it and paste directly into Claude, GPT, Gemini, or any AI tool.
                    All output that follows must enter Phase 4 — Decide. Nothing ships without a Decision Log entry.
                </p>
            </div>

            {/* Section 1 */}
            <TemplateSection label="WHO IS THIS FOR" sublabel="SPECIFIC_USER_IN_CONTEXT" number="01"
                annotation="Specific user in a specific context. Not a persona name. Include what they are doing, what they already know, and what would make this experience fail them.">
                <TemplateTextarea label="USER AND CONTEXT" rows={3} required prefix=">"
                    hint="INCLUDE: WHO, WHAT THEY'RE DOING, WHAT THEY KNOW, WHAT WOULD FAIL THEM"
                    value={s.who} onChange={(v) => update('who', v)} />
            </TemplateSection>

            {/* Section 2 */}
            <TemplateSection label="PRIMARY JOB" sublabel="ONE_THING_ONLY" number="02"
                annotation="One primary job. If you list more than one, you have not finished framing yet.">
                <TemplateTextarea label="WHAT MUST THIS ACCOMPLISH" rows={2} required prefix=">"
                    hint="ONE SENTENCE. IF YOU CANNOT SAY IT IN ONE SENTENCE — KEEP FRAMING."
                    value={s.what} onChange={(v) => update('what', v)} />
            </TemplateSection>

            {/* Section 3 */}
            <TemplateSection label="WHAT MUST THIS NOT DO" sublabel="KEY_FIELD // NON_NEGOTIABLES" number="03" variant="key"
                annotation="The most important field. Pull from your Design Charter. One constraint per line.">
                <div style={{
                    border: '2px solid var(--accent)', padding: 24,
                    background: 'var(--paper)', boxShadow: '6px 6px 0px var(--accent)',
                }}>
                    <div style={{
                        fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700,
                        fontStyle: 'italic', color: 'rgba(10,10,10,0.5)', marginBottom: 16,
                    }}>
                        &ldquo;Constraints before generation. Every time. Without exception.&rdquo;
                    </div>
                    <TemplateTextarea label="CONSTRAINTS (ONE PER LINE)" rows={5} required
                        placeholder={'MUST MEET WCAG 2.1 AA\nMUST NOT SURFACE MARGIN TRADING\nMUST WORK ON 375PX VIEWPORT\nMUST NOT REQUIRE FINANCIAL LITERACY\nABOVE 6TH GRADE READING LEVEL'}
                        value={s.mustNot} onChange={(v) => update('mustNot', v)} />
                </div>
            </TemplateSection>

            {/* Section 4 */}
            <TemplateSection label="TECHNICAL CONSTRAINTS" sublabel="WHAT_AI_CANNOT_IGNORE" number="04" variant="ai"
                annotation="Platform. Component library. Performance target. Data available.">
                <TemplateTextarea label="PLATFORM, COMPONENTS, PERFORMANCE, DATA" rows={3} prefix=">"
                    value={s.technical} onChange={(v) => update('technical', v)} />
            </TemplateSection>

            {/* Section 5 */}
            <TemplateSection label="TONE AND VOICE" sublabel="HOW_IT_SOUNDS" number="05"
                annotation="Not adjectives. Describe how this sounds if a person says it out loud.">
                <TemplateTextarea label="TONE (DESCRIBE HOW IT SOUNDS)" rows={2} prefix=">"
                    value={s.tone} onChange={(v) => update('tone', v)} />
                <TemplateField label="MUST NOT SOUND LIKE" prefix="✗" hint="ONE EXAMPLE OF TONE TO AVOID"
                    value={s.toneNot} onChange={(v) => update('toneNot', v)} />
            </TemplateSection>

            {/* Section 6 */}
            <TemplateSection label="EXAMPLES + REFERENCES" sublabel="CLOSE_TO_RIGHT_AND_WRONG" number="06">
                <TemplateTextarea label="CLOSE TO RIGHT" rows={2} prefix="✓"
                    value={s.examplesRight} onChange={(v) => update('examplesRight', v)} />
                <TemplateTextarea label="CLOSE TO WRONG" rows={2} prefix="✗"
                    value={s.examplesWrong} onChange={(v) => update('examplesWrong', v)} />
            </TemplateSection>

            {/* Section 7 */}
            <TemplateSection label="VARIANTS" sublabel="MINIMUM_3" number="07"
                annotation="Minimum 3. Recommended 5-6. Fewer than 3 is selection — not generation.">
                <TemplateField label="NUMBER OF DISTINCT VARIANTS" placeholder="5"
                    hint="EACH MUST MAKE A DIFFERENT CONSTRAINT TRADEOFF EXPLICIT"
                    value={s.variants} onChange={(v) => update('variants', v)} />
            </TemplateSection>
        </TemplateShell>
    )
}
