import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Download, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFullImageUrl } from '../../api/client';

export default function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0d14]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Available badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              {(profile?.avatar_display_url || profile?.avatar_url) ? (
                <img
                  src={getFullImageUrl(profile.avatar_display_url || profile.avatar_url)}
                  alt={profile?.full_name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.full_name ? profile.full_name.charAt(0) : 'A'
              )}
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                {profile?.full_name || 'Petla Siva Kumar'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Available for work
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions & Admin Button */}
          <div className="hidden lg:flex items-center gap-3">
            {profile?.resume_display_url && (
              <a
                href={profile.resume_display_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                Resume
              </a>
            )}

            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-200" />
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 text-indigo-400 bg-white/5 rounded-xl border border-white/10"
              title="Admin Panel"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white bg-white/5 rounded-xl border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1320] border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {profile?.resume_display_url && (
              <a
                href={profile.resume_display_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-200 bg-white/5 border border-white/10 rounded-xl"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                Download Resume
              </a>
            )}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAuthenticated ? 'Go to Admin Dashboard' : 'Admin Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
