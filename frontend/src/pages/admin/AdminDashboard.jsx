import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Images, Video, MessageSquare, Star,
  Tag, Image, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import AdminOverview from '../../components/admin/AdminOverview'
import AdminGallery from '../../components/admin/AdminGallery'
import AdminVideos from '../../components/admin/AdminVideos'
import AdminTestimonials from '../../components/admin/AdminTestimonials'
import AdminInquiries from '../../components/admin/AdminInquiries'

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/admin/gallery', icon: Images, label: 'Gallery' },
  { path: '/admin/videos', icon: Video, label: 'Videos' },
  { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      {/* Sidebar overlay on mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#111111] border-r border-white/5 z-50 flex flex-col"
            >
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
              <span className="font-['Cormorant_Garamond'] text-2xl gold-text tracking-widest block">INTERIOR</span>
              <span className="text-[9px] tracking-[0.4em] text-white/30 uppercase">Concepts · Admin</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#C9A84C11] text-[#C9A84C] border-l-2 border-[#C9A84C]'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                  <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </nav>

            {/* User + Logout */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C22] border border-[#C9A84C44] flex items-center justify-center text-[#C9A84C] text-xs font-600">
                  {admin?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-white text-xs font-500">{admin?.username || 'Admin'}</p>
                  <p className="text-white/30 text-[10px]">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-white/30 text-sm">Gauri Interiors Admin</span>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="*" element={<AdminOverview />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
