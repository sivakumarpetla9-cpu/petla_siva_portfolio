import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Code, Palette, MapPin } from 'lucide-react';
import { Github, Linkedin, Twitter, Dribbble, Figma } from '../icons/BrandIcons';

export default function HeroSection({ profile }) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{profile?.title || 'UI/UX Designer & Frontend Developer'}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
            >
              {profile?.hero_headline ? (
                <span>{profile.hero_headline}</span>
              ) : (
                <>
                  Designing intuitive interfaces. <br />
                  <span className="text-gradient">Engineering performant web apps.</span>
                </>
              )}
            </motion.h1>

            {/* Subheading / Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 max-w-2xl font-normal leading-relaxed"
            >
              {profile?.hero_subheading || profile?.bio || 'Specializing in end-to-end product design, scalable frontend architecture, and interactive design systems.'}
            </motion.p>

            {/* Location & Contact fast info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center gap-4 text-sm text-gray-400"
            >
              {profile?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-violet-400" />
                  <span>{profile.email}</span>
                </div>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 transition-all hover:scale-105"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-semibold text-base backdrop-blur-md transition-all"
              >
                <span>Get in Touch</span>
              </a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex items-center gap-3 text-gray-400"
            >
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mr-2">Connect:</span>
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub Profile" className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.figma_url && (
                <a href={profile.figma_url} target="_blank" rel="noreferrer" aria-label="Figma Profile" className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-colors">
                  <Figma className="w-4 h-4" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noreferrer" aria-label="Twitter Profile" className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile?.dribbble_url && (
                <a href={profile.dribbble_url} target="_blank" rel="noreferrer" aria-label="Dribbble Profile" className="p-2.5 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl border border-white/10 transition-colors">
                  <Dribbble className="w-4 h-4" />
                </a>
              )}
            </motion.div>

          </div>

          {/* Right Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-30 blur-xl"></div>

              {/* Glass Card Container */}
              <div className="relative glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10">
                
                {/* Profile Header Image/Avatar */}
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                  <div className="relative">
                    <img
                      src={profile?.avatar_display_url || profile?.avatar_url || '/petla_siva_kumar.jpg'}
                      alt={profile?.full_name || 'Petla Siva Kumar'}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/50"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/petla_siva_kumar.jpg'; }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0a0d14] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{profile?.full_name || 'Petla Siva Kumar'}</h3>
                    <p className="text-sm text-indigo-400 font-medium">{profile?.title || 'UI/UX & Frontend Developer (Fresher)'}</p>
                    <p className="text-xs text-gray-400 mt-1">Fresher Crafting Digital Experiences</p>
                  </div>
                </div>

                {/* Floating Skill Badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-medium">Design Systems</span>
                      <span className="text-sm font-bold text-white">Figma & UX</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 font-medium">Frontend Stack</span>
                      <span className="text-sm font-bold text-white">React & TypeScript</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Pill */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-violet-950/40 border border-indigo-500/20 flex justify-between items-center text-center">
                  <div>
                    <span className="block text-xl font-extrabold text-white">10+</span>
                    <span className="text-xs text-gray-400 font-medium">Projects Built</span>
                  </div>
                  <div className="h-8 w-px bg-white/10"></div>
                  <div>
                    <span className="block text-xl font-extrabold text-indigo-400">100%</span>
                    <span className="text-xs text-gray-400 font-medium">Dedication</span>
                  </div>
                  <div className="h-8 w-px bg-white/10"></div>
                  <div>
                    <span className="block text-xl font-extrabold text-violet-400">Fresher</span>
                    <span className="text-xs text-gray-400 font-medium">Entry Level</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
