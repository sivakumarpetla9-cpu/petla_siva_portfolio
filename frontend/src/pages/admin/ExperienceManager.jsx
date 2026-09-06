import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Calendar, MapPin, Save, X } from 'lucide-react';
import { fetchExperiences, createExperience, updateExperience, deleteExperience } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    work_mode: 'Remote',
    location: '',
    employment_type: 'Full-time',
    start_date: '',
    end_date: 'Present',
    is_current: false,
    description: '',
    order: 0,
  });

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await fetchExperiences();
      setExperiences(data);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      work_mode: 'Remote',
      location: '',
      employment_type: 'Full-time',
      start_date: new Date().getFullYear().toString(),
      end_date: 'Present',
      is_current: true,
      description: '',
      order: experiences.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    let mode = item.work_mode;
    if (mode === 'Onsite') mode = 'On-site';
    if (!mode) mode = 'Remote';

    setFormData({
      company: item.company || '',
      role: item.role || '',
      work_mode: mode,
      location: item.location && item.location.toLowerCase() !== 'remote' ? item.location : (item.work_mode && item.location ? item.location : ''),
      employment_type: item.employment_type || 'Full-time',
      start_date: item.start_date || '',
      end_date: item.end_date || 'Present',
      is_current: item.is_current || false,
      description: item.description || '',
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this work experience entry?')) return;
    try {
      await deleteExperience(id);
      showToast('Experience deleted.', 'success');
      loadExperiences();
    } catch (err) {
      showToast('Failed to delete experience.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((formData.work_mode === 'On-site' || formData.work_mode === 'Hybrid') && !formData.location?.trim()) {
      showToast(`Location is required for ${formData.work_mode} work mode.`, 'error');
      return;
    }
    try {
      if (editingItem) {
        await updateExperience(editingItem.id, formData);
        showToast('Experience updated successfully.', 'success');
      } else {
        await createExperience(formData);
        showToast('Experience entry created.', 'success');
      }
      setModalOpen(false);
      loadExperiences();
    } catch (err) {
      const errMsg = err.response?.data?.location?.[0] || err.response?.data?.work_mode?.[0] || 'Failed to save experience.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Experience Manager</h2>
          <p className="text-sm text-gray-400">Manage work history, company roles, and positions.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-sm font-semibold text-indigo-300">{exp.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400 pl-13">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20 text-[11px]">
                    {exp.work_mode || 'Remote'}
                  </span>
                  {exp.location && exp.location.toLowerCase() !== 'remote' && (
                    <span className="inline-flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {exp.location}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-300 pl-13 pt-1">{exp.description}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Experience' : 'Add Experience Entry'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Job Role / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior UI/UX Designer"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nexus Digital"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="2023"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="Present"
                    disabled={formData.is_current}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600"
                />
                <label htmlFor="is_current" className="text-xs font-semibold text-gray-300 cursor-pointer">
                  Currently Working Here
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Work Mode <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.work_mode}
                    onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0f1422] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote" className="bg-[#0f1422] text-white">Remote</option>
                    <option value="On-site" className="bg-[#0f1422] text-white">On-site</option>
                    <option value="Hybrid" className="bg-[#0f1422] text-white">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Location {formData.work_mode !== 'Remote' ? (
                      <span className="text-rose-400">*</span>
                    ) : (
                      <span className="text-gray-500 font-normal">(optional)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required={formData.work_mode === 'On-site' || formData.work_mode === 'Hybrid'}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={formData.work_mode === 'Remote' ? 'Leave empty or enter city, state/country' : 'Enter city, state/country (e.g. Hyderabad, Telangana, India)'}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description / Key Achievements</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your responsibilities, team size, tech stack..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
