import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Compass, Cpu, Layers, Sparkles, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '../icons/BrandIcons';
import { getFullImageUrl } from '../../api/client';

export default function AboutSection({ profile }) {
  const principles = [
    {
      icon: UserCheck,
      title: 'User-Centered Design',
      desc: 'Grounding product decisions in user research, wireframing, and continuous usability testing.',
    },
    {
      icon: Layers,
      title: 'Design Systems',
      desc: 'Building reusable, tokenized component libraries that bridge design and engineering teams.',
    },
    {
      icon: Cpu,
      title: 'Performant Code',
      desc: 'Writing clean, modern React & TypeScript with accessible HTML and optimized rendering pipelines.',
    },
    {
      icon: Compass,
      title: 'Motion & Interaction',
      desc: 'Crafting thoughtful micro-interactions with Framer Motion that elevate user engagement.',
    },
  ];

  const profileAvatar = getFullImageUrl(profile?.avatar_display_url || profile?.avatar_url) || '/petla_siva_kumar.jpg';

  return (
    <section id="about" className="py-24 relative border-t border-white/5 bg-[#0b0e17]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fresher in <span className="text-gradient">Design & Engineering</span>
          </h2>
        </div>

        {/* Feature Grid with Profile Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column - Framed Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Outer glow ring */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-40 blur-xl"></div>
              
              <div className="relative glass-panel rounded-3xl p-4 border border-white/10 overflow-hidden group">
                <img
                  src={profileAvatar}
                  alt={profile?.full_name || "Petla Siva Kumar"}
                  className="w-full aspect-[4/5] object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/petla_siva_kumar.jpg';
                  }}
                />
                
                {/* Floating overlay details */}
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{profile?.full_name || 'Petla Siva Kumar'}</h3>
                    <p className="text-xs text-indigo-400 font-medium">UI/UX Designer & Frontend Developer</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {profile?.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profile?.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Bio Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Passionate about turning complex ideas into <span className="text-gradient">intuitive digital products</span>
            </h3>

            <p className="text-gray-300 text-base leading-relaxed">
              {profile?.bio || "I am a motivated fresher designer and frontend developer focused on crafting clean user interfaces, modern responsive websites, and intuitive design systems. I combine aesthetic design thinking with hands-on coding skills in React, Tailwind CSS, and Python/Django."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl glass-panel border border-white/10">
                <span className="block text-2xl font-extrabold text-white">Fresher</span>
                <span className="text-xs text-gray-400 font-medium">Ready for Full-time Roles</span>
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/10">
                <span className="block text-2xl font-extrabold text-indigo-400">10+</span>
                <span className="text-xs text-gray-400 font-medium">Projects & Case Studies</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={profile?.linkedin_url || "https://www.linkedin.com/in/siva-kumar-33b206377/"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={profile?.github_url || "https://github.com/sivakumarpetla9-cpu"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-semibold text-sm transition-all"
              >
                <Github className="w-4 h-4 text-indigo-400" />
                <span>GitHub Repositories</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 border border-white/5"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
