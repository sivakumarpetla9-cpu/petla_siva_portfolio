import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react';

export function formatExperienceMeta(exp) {
  const dateStr = `${exp.start_date || ''} — ${exp.is_current ? 'Present' : (exp.end_date || 'Present')}`;
  let mode = exp.work_mode;
  if (mode === 'Onsite') mode = 'On-site';
  if (!mode) mode = 'Remote';

  const rawLoc = exp.location?.trim() || '';
  const isDefaultOrRemote = !rawLoc || rawLoc.toLowerCase() === 'remote' || rawLoc.toLowerCase().includes('san francisco');
  const loc = isDefaultOrRemote ? '' : rawLoc;

  if (mode === 'On-site') {
    return loc ? `${dateStr} · On-site · ${loc}` : `${dateStr} · On-site`;
  }
  if (mode === 'Hybrid') {
    return loc ? `${dateStr} · Hybrid · ${loc}` : `${dateStr} · Hybrid`;
  }
  // Remote
  return `${dateStr} · Remote`;
}

export default function ExperienceSection({ experiences = [] }) {
  return (
    <section id="experience" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Career History
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience & <span className="text-gradient">Leadership</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 border-l border-white/10 space-y-12">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-[#0a0d14] group-hover:scale-125 transition-transform" />

              {/* Experience Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 hover:border-indigo-500/30 transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mt-0.5">
                      <Briefcase className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {formatExperienceMeta(exp)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
