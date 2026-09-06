import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { Linkedin, Github, Twitter, Figma } from '../icons/BrandIcons';

export default function ContactSection({ profile }) {
  const email = profile?.email || 'sivakumarpetla9@gmail.com';
  const location = profile?.location || 'India';
  const phone = profile?.phone || '';
  const linkedin = profile?.linkedin_url || 'https://www.linkedin.com/in/siva-kumar-33b206377/';
  const github = profile?.github_url || 'https://github.com/sivakumarpetla9-cpu';
  const figma = profile?.figma_url || '';

  return (
    <section id="contact" className="py-24 relative border-t border-white/5 bg-[#080b12] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Get In Touch
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let's create something <span className="text-gradient">extraordinary together</span>
          </h2>
          
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you have a design challenge, frontend engineering opportunity, or just want to connect, feel free to reach out directly through any channel below.
          </p>
        </div>

        {/* Primary Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Direct Email Card */}
          <motion.a
            href={`mailto:${email}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">Direct Email</span>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {email}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Available for inquiries, collaborations, and discussions</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 pt-2 border-t border-white/5">
              <span>Send an Email</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.a>

          {/* LinkedIn Card */}
          {linkedin && (
            <motion.a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="group glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">LinkedIn Network</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Connect on LinkedIn
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Professional background, endorsements, and networking</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 pt-2 border-t border-white/5">
                <span>View Profile</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          )}

          {/* GitHub Card */}
          {github && (
            <motion.a
              href={github}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="group glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block mb-1">GitHub Repositories</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                    Explore Code & Projects
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Open source contributions, architectures, and experiments</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 pt-2 border-t border-white/5">
                <span>Visit GitHub</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          )}

          {/* Location & Availability Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">Location & Work Mode</span>
                <h3 className="text-lg font-bold text-white">
                  {location}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Open to Remote, Hybrid, and On-site opportunities</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-2 border-t border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for Hire</span>
            </div>
          </motion.div>

          {/* Phone Card (if present) */}
          {phone ? (
            <motion.a
              href={`tel:${phone}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="group glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">Direct Phone</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {phone}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Direct telephone calls & instant messaging</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 pt-2 border-t border-white/5">
                <span>Call Directly</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.a>
          ) : (
            /* Figma Design Portfolio Card */
            figma && (
              <motion.a
                href={figma}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="group glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                    <Figma className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block mb-1">Figma Community</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                      Figma Design Files
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Interactive prototypes, wireframes, and design systems</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 group-hover:text-violet-300 pt-2 border-t border-white/5">
                  <span>View on Figma</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.a>
            )
          )}

        </div>

      </div>
    </section>
  );
}

