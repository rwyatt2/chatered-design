import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const NAV_LINKS = [
    { label: 'FRAMEWORK', to: '/#framework', type: 'anchor' },
    { label: 'TEMPLATES', to: '/templates', type: 'route' },
    { label: 'ABOUT', to: '/#about', type: 'anchor' },
]

export function Nav() {
    const location = useLocation()
    const navigate = useNavigate()
    const shouldReduce = useReducedMotion()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile menu on route change
    const prevPathRef = useRef(location.pathname)
    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            setMobileOpen(false)
            prevPathRef.current = location.pathname
        }
    })

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const handleAnchorClick = (e, to) => {
        e.preventDefault()
        const [path, hash] = to.split('#')
        if (location.pathname === '/' || location.pathname === path) {
            // Same page — smooth scroll
            const el = document.getElementById(hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else {
            // Navigate to landing page then scroll
            navigate('/')
            setTimeout(() => {
                const el = document.getElementById(hash)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }
        setMobileOpen(false)
    }

    const isActive = (link) => {
        if (link.type === 'route') {
            return location.pathname === link.to || location.pathname.startsWith(link.to + '/')
        }
        return false
    }

    return (
        <>
            <a
                href="#main-form"
                className="font-mono"
                style={{
                    position: 'fixed',
                    top: -100,
                    left: 16,
                    zIndex: 99999,
                    background: 'var(--accent)',
                    color: '#fff',
                    padding: '12px 24px',
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    border: '2px solid var(--ink)',
                }}
                onFocus={(e) => e.currentTarget.style.top = '16px'}
                onBlur={(e) => e.currentTarget.style.top = '-100px'}
            >
                SKIP TO CONTENT
            </a>

            <nav
                role="navigation"
                aria-label="Main navigation"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9000,
                    background: 'var(--paper)',
                    borderBottom: '2px solid var(--ink)',
                    transition: 'box-shadow 0.2s ease',
                    boxShadow: scrolled ? '0 4px 0 var(--ink)' : 'none',
                }}
            >
                <div
                    style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: '0 24px',
                        height: 72,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* Wordmark */}
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            color: 'var(--ink)',
                        }}
                    >
                        <div style={{
                            width: 10,
                            height: 10,
                            background: 'var(--accent)',
                            flexShrink: 0,
                        }} />
                        <span
                            className="neo-grotesque"
                            style={{
                                fontSize: 'clamp(14px, 2vw, 18px)',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '-0.04em',
                                lineHeight: 1,
                            }}
                        >
                            CHARTERED DESIGN
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div
                        className="nav-desktop-links"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 32,
                        }}
                    >
                        {NAV_LINKS.map((link) => {
                            const active = isActive(link)
                            const commonStyle = {
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 11,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                textDecoration: 'none',
                                color: active ? 'var(--accent)' : 'var(--ink)',
                                position: 'relative',
                                padding: '4px 0',
                                transition: 'color 0.15s',
                            }

                            const underline = active ? {
                                position: 'absolute',
                                bottom: -2,
                                left: 0,
                                right: 0,
                                height: 3,
                                background: 'var(--accent)',
                            } : null

                            if (link.type === 'anchor') {
                                return (
                                    <a
                                        key={link.label}
                                        href={link.to}
                                        onClick={(e) => handleAnchorClick(e, link.to)}
                                        style={commonStyle}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                                    >
                                        {link.label}
                                        {underline && <span style={underline} />}
                                    </a>
                                )
                            }
                            return (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    style={commonStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                                >
                                    {link.label}
                                    {underline && <span style={underline} />}
                                </Link>
                            )
                        })}

                        <Link to="/templates" className="tech-btn" style={{ padding: '10px 18px', fontSize: 11 }}>
                            ACCESS TOOLKIT →
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="nav-mobile-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 8,
                            width: 40,
                            height: 40,
                            position: 'relative',
                        }}
                    >
                        <span style={{
                            display: 'block',
                            width: 24,
                            height: 2,
                            background: 'var(--ink)',
                            position: 'absolute',
                            left: 8,
                            transition: 'all 0.2s ease',
                            ...(mobileOpen
                                ? { top: 19, transform: 'rotate(45deg)' }
                                : { top: 12 }),
                        }} />
                        <span style={{
                            display: 'block',
                            width: 24,
                            height: 2,
                            background: 'var(--ink)',
                            position: 'absolute',
                            left: 8,
                            top: 19,
                            transition: 'opacity 0.2s ease',
                            opacity: mobileOpen ? 0 : 1,
                        }} />
                        <span style={{
                            display: 'block',
                            width: 24,
                            height: 2,
                            background: 'var(--ink)',
                            position: 'absolute',
                            left: 8,
                            transition: 'all 0.2s ease',
                            ...(mobileOpen
                                ? { top: 19, transform: 'rotate(-45deg)' }
                                : { top: 26 }),
                        }} />
                    </button>
                </div>
            </nav>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduce ? 0.01 : 0.2 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 8999,
                            background: 'var(--paper)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            paddingTop: 72,
                        }}
                    >
                        {NAV_LINKS.map((link, i) => {
                            const active = isActive(link)
                            const el = link.type === 'anchor' ? (
                                <a
                                    key={link.label}
                                    href={link.to}
                                    onClick={(e) => handleAnchorClick(e, link.to)}
                                    className="neo-grotesque"
                                    style={{
                                        fontSize: 'clamp(40px, 8vw, 64px)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '-0.04em',
                                        textDecoration: 'none',
                                        color: active ? 'var(--accent)' : 'var(--ink)',
                                        transition: 'color 0.15s',
                                        lineHeight: 1.2,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="neo-grotesque"
                                    style={{
                                        fontSize: 'clamp(40px, 8vw, 64px)',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '-0.04em',
                                        textDecoration: 'none',
                                        color: active ? 'var(--accent)' : 'var(--ink)',
                                        transition: 'color 0.15s',
                                        lineHeight: 1.2,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--ink)' }}
                                >
                                    {link.label}
                                </Link>
                            )

                            return (
                                <motion.div
                                    key={link.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: shouldReduce ? 0 : i * 0.06, duration: shouldReduce ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {el}
                                </motion.div>
                            )
                        })}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: shouldReduce ? 0 : 0.25, duration: shouldReduce ? 0.01 : 0.3 }}
                            style={{ marginTop: 32 }}
                        >
                            <Link
                                to="/templates"
                                className="tech-btn"
                                onClick={() => setMobileOpen(false)}
                                style={{ padding: '16px 32px', fontSize: 13 }}
                            >
                                ACCESS TOOLKIT →
                            </Link>
                        </motion.div>

                        {/* Bottom tag */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="font-mono"
                            style={{
                                position: 'absolute',
                                bottom: 32,
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'rgba(10,10,10,0.25)',
                            }}
                        >
              // AI GENERATES. HUMANS OWN.
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive styles */}
            <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
        </>
    )
}
