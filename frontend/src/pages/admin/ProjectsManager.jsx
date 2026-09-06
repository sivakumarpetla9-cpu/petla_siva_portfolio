import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, Plus, Search, Eye, EyeOff, Star, Edit, Trash2,
  AlertTriangle, ExternalLink, ArrowRight
} from 'lucide-react';
import { fetchProjects, deleteProject, toggleProjectPublish, toggleProjectFeature, getFullImageUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { showToast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const res = await toggleProjectPublish(id);
      showToast(`Status updated to ${res.is_published ? 'Published' : 'Draft'}.`, 'success');
      loadProjects();
    } catch (err) {
      showToast('Error toggling publish state', 'error');
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await toggleProjectFeature(id);
      showToast('Featured toggle updated.', 'success');
      loadProjects();
    } catch (err) {
      showToast('Error toggling feature state', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      showToast('Project deleted successfully.', 'success');
      setDeleteConfirmId(null);
      loadProjects();
    } catch (err) {
      showToast('Failed to delete project.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Project Manager</h2>
          <p className="text-sm text-gray-400">Add, edit, publish, and structure portfolio case studies.</p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'UI/UX Design', 'Frontend Development', 'Full Stack'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-white/10">
          <FolderKanban className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No projects found</h3>
          <p className="text-gray-400 text-sm">Click "Add Project" above to create your first portfolio entry.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <tr>
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {(proj.thumbnail_display_url || proj.thumbnail_url) ? (
                          <>
                            <img
                              src={getFullImageUrl(proj.thumbnail_display_url || proj.thumbnail_url)}
                              alt={proj.title}
                              className="w-12 h-12 rounded-xl object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement?.querySelector('.proj-initial-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="proj-initial-fallback hidden w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center font-bold text-indigo-400">
                              {proj.title.charAt(0)}
                            </div>
                          </>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                            {proj.title.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-base">{proj.title}</h4>
                          <span className="text-xs text-gray-500 block truncate max-w-xs">{proj.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-xs text-indigo-300">
                      {proj.category}
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-gray-400">
                      {proj.project_date || 'N/A'}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(proj.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                          proj.is_published
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {proj.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{proj.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeature(proj.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                          proj.is_featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
                          title="Preview Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/projects/${proj.id}`}
                          className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                          title="Edit Project & Case Study"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center gap-4 text-rose-400">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Project</h3>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              Are you sure you want to permanently delete this project and its case study data?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/25"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
