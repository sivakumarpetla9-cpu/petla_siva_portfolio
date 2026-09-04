import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Sparkles } from 'lucide-react';

export default function EducationSection({ education = [] }) {
  return (
    <section id="education" className="py-24 relative border-t border-white/5 bg-[#080b12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Academics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & <span className="text-gradient">Academic Background</span>
          </h2>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-indigo-400">{edu.institution}</p>
                  {edu.field_of_study && (
                    <p className="text-xs text-gray-400 mt-1">Specialization: {edu.field_of_study}</p>
                  )}
                </div>

                {edu.description && (
                  <p className="text-sm text-gray-300 leading-relaxed pt-2">
                    {edu.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
                <span>{edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
