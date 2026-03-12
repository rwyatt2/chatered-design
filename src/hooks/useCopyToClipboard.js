import { useState } from 'react'

export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false)

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch {
            const el = document.createElement('textarea')
            el.value = text
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return { copy, copied }
}
