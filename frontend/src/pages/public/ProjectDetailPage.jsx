import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Calendar, Layers,
  CheckCircle2, Lightbulb, Target, Users, Layout, Palette, Sparkles, Award
} from 'lucide-react';
import { Github, Figma } from '../../components/icons/BrandIcons';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { fetchProjectBySlug, fetchProfile } from '../../api/client';

const sectionIconMap = {
  overview: Sparkles,
  problem: Target,
  research: Users,
  personas: Users,
  user_journey: Layers,
  information_architecture: Layout,
  user_flow: Layout,
  wireframes: Layout,
  ui_design: Palette,
  design_system: Palette,
  prototype: ExternalLink,
  results: Award,
  learnings: Lightbulb,
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProject = async () => {
      try {
        setLoading(true);
        const [projData, profData] = await Promise.all([
          fetchProjectBySlug(slug),
          fetchProfile().catch(() => null)
        ]);
        setProject(projData);
        if (profData) setProfile(profData);
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError('Project not found or unpublished.');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center p-1">
            <div className="w-full h-full bg-[#0a0d14] rounded-xl"></div>
          </div>
          <span className="text-gray-400 text-sm font-medium">Loading case study...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col justify-between">
        <Navbar profile={profile} />
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6 my-auto pt-32">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold">{error || 'Project Not Found'}</h1>
          <p className="text-gray-400 text-sm">The project case study you requested could not be located.</p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Portfolio
          </Link>
        </div>
        <Footer profile={profile} />
      </div>
    );
  }

  const caseStudySections = Array.isArray(project.full_case_study) ? project.full_case_study : [];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-100 font-sans">
      <Navbar profile={profile} />

      <main className="pt-32 pb-24">
        
        {/* Top Back Link & Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          {/* Project Title Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{project.project_date || '2025'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
              {project.short_description}
            </p>

            {/* Links and Tools row */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-b border-white/10 py-4">
              {/* Tech Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase text-gray-500 font-bold mr-1">Tools:</span>
                {project.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-indigo-300 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {project.figma_url && (
                  <a
                    href={project.figma_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Figma className="w-4 h-4 text-violet-400" /> Figma
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-4 h-4 text-gray-300" /> GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Hero Thumbnail Banner */}
          {project.thumbnail_display_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl"
            >
              <img
                src={project.thumbnail_display_url}
                alt={project.title}
                className="w-full max-h-[500px] object-cover"
              />
            </motion.div>
          )}

          {/* Case Study Sections */}
          {caseStudySections.length > 0 ? (
            <div className="space-y-12 pt-8">
              {caseStudySections.map((sec, idx) => {
                const IconComponent = sectionIconMap[sec.type] || Sparkles;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-4 hover:border-indigo-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-white capitalize">
                        {sec.title || sec.type.replace('_', ' ')}
                      </h2>
                    </div>

                    <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line pl-1 sm:pl-13">
                      {sec.content}
                    </div>

                    {/* Section embedded images */}
                    {sec.images && sec.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {sec.images.map((imgUrl, iIdx) => (
                          <img
                            key={iIdx}
                            src={imgUrl}
                            alt={`${sec.title} screenshot ${iIdx + 1}`}
                            className="rounded-2xl border border-white/10 object-cover w-full h-64 hover:scale-[1.02] transition-transform"
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-2">
              <p className="text-gray-400 text-sm">Full case study breakdown being documented.</p>
            </div>
          )}

          {/* Project Gallery */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-white/10">
              <h3 className="text-2xl font-bold text-white">Project Showcase Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.gallery_images.map((imgUrl, gIdx) => (
                  <div key={gIdx} className="rounded-2xl overflow-hidden border border-white/10 glass-panel">
                    <img src={imgUrl} alt={`Gallery ${gIdx}`} className="w-full h-64 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer profile={profile} />
    </div>
  );
}
