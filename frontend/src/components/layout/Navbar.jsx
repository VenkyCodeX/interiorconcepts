import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home',     href: '#home',     route: '/' },
  { label: 'Products', href: '#products', route: '/' },
  { label: 'Gallery',  href: null,        route: '/gallery' },
  { label: 'Videos',   href: null,        route: '/videos' },
  { label: 'About',    href: '#about',    route: '/' },
  { label: 'Contact',  href: '#contact',  route: '/' },
]

export default function Navbar({ isPage = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    // On non-home pages start scrolled so glass shows immediately
    if (!isHome) setScrolled(true)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const handleNav = (link) => {
    setOpen(false)
    // Dedicated route (e.g. /gallery)
    if (!link.href) {
      navigate(link.route)
      return
    }
    // Hash link — if already on home just scroll, else navigate then scroll
    if (isHome) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(link.route + link.href)
    }
  }

  const handleLogo = () => {
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? 'glass-dark py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'py-5 bg-transparent'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={handleLogo}
            className="flex flex-col leading-none text-left"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-['Cormorant_Garamond'] text-2xl font-600 gold-text tracking-widest">INTERIOR</span>
            <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase">Concepts</span>
          </motion.button>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = !link.href && location.pathname === link.route
              return (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link)}
                    className={`relative text-xs tracking-widest uppercase transition-colors duration-300 group ${
                      isActive ? 'text-[#C9A84C]' : 'text-white/70 hover:text-[#C9A84C]'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px bg-[#C9A84C] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </button>
                </li>
              )
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => handleNav({ href: '#contact', route: '/' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-xs tracking-widest uppercase border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
            >
              Book Consultation
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99] bg-[#0A0A0A] flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNav(link)}
                className={`font-['Cormorant_Garamond'] text-4xl transition-colors ${
                  !link.href && location.pathname === link.route
                    ? 'text-[#C9A84C]'
                    : 'text-white/80 hover:text-[#C9A84C]'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleNav({ href: '#contact', route: '/' })}
              className="mt-4 px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-sm tracking-widest uppercase"
            >
              Book Consultation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
