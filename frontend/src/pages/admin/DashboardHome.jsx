import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, CheckCircle2, FileText, Briefcase, Award, Image,
  Plus, Upload, Settings, Eye, Star, EyeOff, ArrowRight
} from 'lucide-react';
import { fetchDashboardStats, toggleProjectPublish, toggleProjectFeature } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const res = await toggleProjectPublish(id);
      showToast(`Project "${res.title}" is now ${res.is_published ? 'Published' : 'Draft'}.`, 'success');
      loadStats();
    } catch (err) {
      showToast('Failed to toggle publish status.', 'error');
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await toggleProjectFeature(id);
      showToast(`Project "${res.title}" featured toggle updated.`, 'success');
      loadStats();
    } catch (err) {
      showToast('Failed to toggle featured status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Projects', value: stats?.total_projects || 0, icon: FolderKanban, color: 'from-indigo-600 to-violet-600' },
    { title: 'Published', value: stats?.published_projects || 0, icon: CheckCircle2, color: 'from-emerald-600 to-teal-600' },
    { title: 'Drafts', value: stats?.draft_projects || 0, icon: FileText, color: 'from-amber-600 to-orange-600' },
    { title: 'Experiences', value: stats?.total_experience || 0, icon: Briefcase, color: 'from-violet-600 to-purple-600' },
    { title: 'Certifications', value: stats?.total_certifications || 0, icon: Award, color: 'from-cyan-600 to-blue-600' },
    { title: 'Media Files', value: stats?.total_media || 0, icon: Image, color: 'from-slate-600 to-gray-700' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white">Dashboard Overview</h2>
            {stats?.database_engine && (
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                stats.database_engine === 'postgresql'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                ● DB: {stats.database_engine.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">Manage all your portfolio content, projects, media, and site settings dynamically.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Project
          </Link>
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all"
          >
            <Upload className="w-4 h-4 text-indigo-400" /> Upload Media
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-white">{card.value}</span>
                <span className="text-xs text-gray-400 font-medium">{card.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity / Projects List */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Projects</h3>
          <Link to="/admin/projects" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/10">
          {stats?.recent_projects?.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No projects found. Click "Add New Project" to get started!</p>
          ) : (
            stats?.recent_projects?.map((proj) => (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {proj.thumbnail_display_url ? (
                    <img src={proj.thumbnail_display_url} alt={proj.title} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      {proj.title.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-white text-base">{proj.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{proj.category}</span>
                      <span>•</span>
                      <span>{proj.project_date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(proj.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      proj.is_published
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {proj.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{proj.is_published ? 'Published' : 'Draft'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeature(proj.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                      proj.is_featured
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>

                  <Link
                    to={`/admin/projects/${proj.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
