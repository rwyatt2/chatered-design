export function assemblePromptFrame(state) {
    const constraints = state.mustNot
        ? state.mustNot
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => `- ${line.trim()}`)
            .join('\n')
        : '- ___'

    return [
        `Design ${state.what || '[PRIMARY JOB]'} for ${state.who || '[USER AND CONTEXT]'}.`,
        '',
        'PRIMARY JOB',
        state.what || '___',
        '',
        'THIS MUST NOT:',
        constraints,
        '',
        'TECHNICAL CONSTRAINTS',
        state.technical || '___',
        '',
        'TONE',
        state.tone || '___',
        `Must not sound like: ${state.toneNot || '___'}`,
        '',
        'REFERENCES',
        `Close to right: ${state.examplesRight || '___'}`,
        `Close to wrong: ${state.examplesWrong || '___'}`,
        '',
        `Generate ${state.variants || '5'} distinct variants.`,
        '',
        'Each variant must:',
        '- Make a different constraint tradeoff explicit',
        '- Be labeled with the primary tradeoff it prioritizes',
        '- Include one sentence on who it serves best',
        '',
        '─'.repeat(40),
        '// CHARTERED_DESIGN // PROMPT_FRAME_V1',
        '// ALL OUTPUT ENTERS PHASE 4 — DECIDE',
        '// NO AI OUTPUT SHIPS WITHOUT A',
        '// DECISION LOG ENTRY',
    ].join('\n')
}
