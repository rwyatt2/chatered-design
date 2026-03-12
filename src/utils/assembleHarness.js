const DIMENSION_NAMES = [
    'USABILITY',
    'CLARITY',
    'CONSISTENCY',
    'TRUST + SAFETY',
    'PERFORMANCE + TECHNICAL',
    'EDGE CASES + RESILIENCE',
    'DOCUMENTATION + HANDOFF',
]

export function assembleHarness(state) {
    const gateItems = state.gate || []
    const gateLabels = [
        'KEYBOARD-ONLY NAVIGATION',
        'SCREEN READER LABELS',
        'COLOR CONTRAST',
        'FOCUS INDICATORS',
        'NO CONTENT CONVEYED BY COLOR ALONE',
        'MOTION — RESPECTS PREFERS-REDUCED-MOTION',
    ]

    const gateStatus = (() => {
        const vals = gateItems.map(g => g.value || '')
        if (vals.every(v => v === 'pass' || v === 'na')) return 'CLEARED'
        if (vals.some(v => v === 'fail')) return 'FAILED'
        return 'INCOMPLETE'
    })()

    let passCount = 0, mitigateCount = 0, failCount = 0
    const dimensions = state.dimensions || []
    dimensions.forEach(d => {
        if (d.verdict === 'pass') passCount++
        else if (d.verdict === 'mitigate') mitigateCount++
        else if (d.verdict === 'fail') failCount++
    })

    const dimensionLines = dimensions.map((d, i) => {
        const lines = [`D-0${i + 1} ${DIMENSION_NAMES[i]}: ${d.verdict?.toUpperCase() || '___'}`]
        if (d.notes) lines.push(`NOTES: ${d.notes}`)
        if (d.verdict === 'mitigate') {
            lines.push(`MITIGATION: ${d.mitigation || '___'}`)
            lines.push(`OWNER: ${d.mitigationOwner || '___'}`)
            lines.push(`REVIEW: ${d.mitigationDate || '___'}`)
        }
        return lines.join('\n')
    }).join('\n\n')

    return [
        'CHARTERED DESIGN — EVALUATION HARNESS',
        'SYS.PHASE_5 // SYSTEMATIC_NOT_VIBES',
        '─'.repeat(40),
        '',
        `PROJECT: ${state.project || '___'}`,
        `EVALUATOR: ${state.evaluator || '___'}`,
        `DATE: ${state.date || '___'}`,
        '',
        '═'.repeat(40),
        '★ ACCESSIBILITY GATE',
        '═'.repeat(40),
        ...gateItems.map((item, i) =>
            `${item.value === 'pass' ? '✓' : item.value === 'fail' ? '✗' : '○'} ${gateLabels[i] || item.label || ''}`
        ),
        '',
        `GATE: ${gateStatus}`,
        `CLEARED BY: ${state.gateClearedBy || '___'}`,
        `DATE: ${state.gateDate || '___'}`,
        '',
        '═'.repeat(40),
        'EVALUATION DIMENSIONS',
        '═'.repeat(40),
        '',
        dimensionLines,
        '',
        '═'.repeat(40),
        'SUMMARY',
        '═'.repeat(40),
        `✓ PASS: ${passCount}`,
        `⚡ MITIGATE: ${mitigateCount}`,
        `✗ FAIL: ${failCount}`,
        '',
        `OVERALL VERDICT: ${state.overallVerdict?.toUpperCase().replace(/-/g, ' ') || '___'}`,
        '',
        'RATIONALE:',
        state.verdictRationale || '___',
        '',
        `EVALUATOR: ${state.evaluator || '___'}`,
        `PM SIGN-OFF: ${state.pmSignoff || '___'}`,
        `DATE: ${state.date || '___'}`,
        '',
        '─'.repeat(40),
        '// CHARTERED_DESIGN // EVALUATION_HARNESS_V1',
        '// AI GENERATES CANDIDATES.',
        '// HUMANS OWN THE CONSEQUENCES.',
    ].join('\n')
}
