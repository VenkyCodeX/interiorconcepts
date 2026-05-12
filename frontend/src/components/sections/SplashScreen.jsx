import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sofa, Bed, Bath, Leaf, Blinds, Home } from 'lucide-react'

const ICONS = [
  { Icon: Sofa,   label: 'Living Room' },
  { Icon: Bed,    label: 'Bedroom'     },
  { Icon: Bath,   label: 'Bathroom'    },
  { Icon: Leaf,   label: 'Decor'       },
  { Icon: Blinds, label: 'Blinds'      },
]

// How long each icon stays centered before sliding left
const HOLD_MS    = 900
// Slide transition duration
const SLIDE_MS   = 600
// Total per icon cycle
const CYCLE_MS   = HOLD_MS + SLIDE_MS   // 1500ms
// All icons done at: 5 * 1500 = 7500ms — too long, cap at 5500
const TOTAL_MS   = 5500
const SAFETY_MS  = 6200
const BRAND_START_MS = CYCLE_MS * ICONS.length  // show brand after last icon

const GOLD = '#C9A84C'

const CORNERS = [
  { top: 16,    left: 16,  borderTop: true,    borderLeft: true   },
  { top: 16,    right: 16, borderTop: true,    borderRight: true  },
  { bottom: 16, left: 16,  borderBottom: true, borderLeft: true   },
  { bottom: 16, right: 16, borderBottom: true, borderRight: true  },
]

// Position slots relative to center:
// slot -2: far left (hidden/tiny)
// slot -1: left (small)
// slot  0: center (big)
// slot +1: right (small)
// slot +2: far right (hidden/tiny)

function getSlotStyle(slot) {
  switch (slot) {
    case 0:  return { x: 0,    scale: 1,    opacity: 1,   zIndex: 10 }
    case -1: return { x: -180, scale: 0.55, opacity: 0.4, zIndex: 5  }
    case 1:  return { x: 180,  scale: 0.55, opacity: 0.4, zIndex: 5  }
    case -2: return { x: -320, scale: 0.3,  opacity: 0,   zIndex: 1  }
    case 2:  return { x: 320,  scale: 0.3,  opacity: 0,   zIndex: 1  }
    default: return { x: slot < 0 ? -400 : 400, scale: 0.2, opacity: 0, zIndex: 0 }
  }
}

export default function SplashScreen({ onComplete }) {
  // activeIndex = which icon is currently centered
  const [activeIndex, setActiveIndex] = useState(0)
  const [showBrand, setShowBrand] = useState(false)

  // Safety fallback
  useEffect(() => {
    const safety = setTimeout(() => onComplete?.(), SAFETY_MS)
    return () => clearTimeout(safety)
  }, []) // eslint-disable-line

  // Advance carousel every CYCLE_MS
  useEffect(() => {
    const timers = []

    ICONS.forEach((_, i) => {
      if (i === 0) return // starts at 0
      timers.push(setTimeout(() => setActiveIndex(i), i * CYCLE_MS))
    })

    // Show brand after all icons
    timers.push(setTimeout(() => setShowBrand(true), BRAND_START_MS))

    // onComplete
    timers.push(setTimeout(() => onComplete?.(), TOTAL_MS))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {CORNERS.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', width: 18, height: 18,
          top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          borderTop:    c.borderTop    ? `1px solid rgba(201,168,76,0.3)` : 'none',
          borderBottom: c.borderBottom ? `1px solid rgba(201,168,76,0.3)` : 'none',
          borderLeft:   c.borderLeft   ? `1px solid rgba(201,168,76,0.3)` : 'none',
          borderRight:  c.borderRight  ? `1px solid rgba(201,168,76,0.3)` : 'none',
        }} />
      ))}

      {/* Carousel stage */}
      {!showBrand && (
        <div style={{ position: 'relative', width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ICONS.map(({ Icon, label }, i) => {
            const slot = i - activeIndex  // relative position to center
            const { x, scale, opacity, zIndex } = getSlotStyle(slot)

            return (
              <motion.div
                key={i}
                animate={{ x, scale, opacity }}
                transition={{ duration: SLIDE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12,
                  zIndex,
                  pointerEvents: 'none',
                }}
              >
              <div style={{
                  width: slot === 0 ? 110 : 70,
                  height: slot === 0 ? 110 : 70,
                  borderRadius: '50%',
                  border: slot === 0 ? '1px solid rgba(201,168,76,0.25)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon
                    size={slot === 0 ? 52 : 32}
                    color={slot === 0 ? GOLD : 'rgba(201,168,76,0.4)'}
                    strokeWidth={1.2}
                  />
                </div>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: slot === 0 ? 12 : 10,
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  color: slot === 0 ? 'rgba(201,168,76,0.75)' : 'rgba(201,168,76,0.25)',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>

              </motion.div>
            )
          })}

          {/* Center indicator line */}
          <div style={{
            position: 'absolute',
            bottom: -20,
            display: 'flex', gap: 6,
          }}>
            {ICONS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? 24 : 6,
                  background: i === activeIndex ? GOLD : 'rgba(201,168,76,0.2)',
                }}
                transition={{ duration: 0.3 }}
                style={{ height: 2, borderRadius: 2 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Brand reveal */}
      <AnimatePresence>
        {showBrand && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 130, height: 130, borderRadius: '50%',
                border: '0.5px solid rgba(201,168,76,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Home size={44} color={GOLD} strokeWidth={1.2} />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
              style={{
                fontFamily: 'Georgia, serif', fontSize: 24,
                letterSpacing: '8px', textTransform: 'uppercase',
                color: '#f0ead6', margin: 0,
              }}
            >
              Interior Concepts
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
              style={{ height: 1, background: 'rgba(201,168,76,0.5)' }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              style={{
                fontSize: 11, letterSpacing: '5px',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.7)', margin: 0,
              }}
            >
              Premium Luxury Design
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 32,
        left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 1,
        background: 'rgba(201,168,76,0.15)',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: TOTAL_MS / 1000, ease: 'linear' }}
          style={{ height: '100%', background: GOLD }}
        />
      </div>
    </motion.div>
  )
}
