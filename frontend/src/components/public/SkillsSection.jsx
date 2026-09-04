import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Layout, Palette, Users, FileCode, Paintbrush, Server, GitBranch, Radio, Cpu } from 'lucide-react';
import { Figma } from '../icons/BrandIcons';

const iconMap = {
  Figma: Figma,
  Users: Users,
  Layout: Layout,
  Palette: Palette,
  Code2: Code2,
  FileCode: FileCode,
  Paintbrush: Paintbrush,
  Sparkles: Sparkles,
  Server: Server,
  GitBranch: GitBranch,
  Radio: Radio,
};

export default function SkillsSection({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'UI/UX Design', 'Frontend Development', 'Tools & Softwares'];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="skills" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Skills & Expertise
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Design Tools & <span className="text-gradient">Technical Stack</span>
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => {
            const IconComponent = iconMap[skill.icon] || Cpu;
            return (
              <motion.div
                key={skill.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{skill.name}</h4>
                      <span className="text-xs text-gray-400 font-medium">{skill.category}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs font-bold text-indigo-300 border border-white/10">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
