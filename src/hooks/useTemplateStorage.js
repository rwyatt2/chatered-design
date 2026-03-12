import { useState } from 'react'

export function useTemplateStorage(key, initial) {
    const [state, setState] = useState(() => {
        const stored = localStorage.getItem(`cd_template_${key}`)
        if (stored) {
            try { return JSON.parse(stored) }
            catch { return initial }
        }
        return initial
    })

    const set = (val) => {
        setState(val)
        localStorage.setItem(`cd_template_${key}`, JSON.stringify(val))
    }

    const clear = () => {
        setState(initial)
        localStorage.removeItem(`cd_template_${key}`)
    }

    return [state, set, clear]
}
