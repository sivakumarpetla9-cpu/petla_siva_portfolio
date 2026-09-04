import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ profile }) {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#070910] text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name ? profile.full_name.charAt(0) : 'A'}
            </div>
            <div>
              <p className="font-bold text-white text-base">{profile?.full_name || 'Petla Siva Kumar'}</p>
              <p className="text-xs text-gray-500">UI/UX Designer & Frontend Developer (Fresher)</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Admin CMS
            </Link>
          </div>

          <div className="text-xs text-gray-500 text-center md:text-right">
            <p>© {new Date().getFullYear()} {profile?.full_name || 'Petla Siva Kumar'}. All rights reserved.</p>
            <p className="mt-1 flex items-center justify-center md:justify-end gap-1">
              Built with React, Vite & Django REST Framework
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
