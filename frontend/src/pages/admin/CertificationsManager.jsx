import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit, Trash2, ExternalLink, X, Upload } from 'lucide-react';
import { fetchCertifications, createCertification, updateCertification, deleteCertification, uploadMedia } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issue_date: '',
    credential_id: '',
    verification_url: '',
    certificate_image_url: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchCertifications();
      setCertifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      organization: 'Google / Coursera',
      issue_date: '2024',
      credential_id: '',
      verification_url: '',
      certificate_image_url: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      organization: item.organization || '',
      issue_date: item.issue_date || '',
      credential_id: item.credential_id || '',
      verification_url: item.verification_url || '',
      certificate_image_url: item.certificate_image_display_url || item.certificate_image_url || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete certification?')) return;
    try {
      await deleteCertification(id);
      showToast('Certification deleted.', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete certification.', 'error');
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', `Cert - ${formData.name}`);
      const uploaded = await uploadMedia(data);
      setFormData({ ...formData, certificate_image_url: uploaded.file_display_url });
      showToast('Certificate document uploaded!', 'success');
    } catch (err) {
      showToast('Upload failed.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateCertification(editingItem.id, formData);
        showToast('Certification updated.', 'success');
      } else {
        await createCertification(formData);
        showToast('Certification added.', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save certification.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Certifications Manager</h2>
          <p className="text-sm text-gray-400">Professional certificates, credentials, and verification URLs.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{cert.name}</h3>
                  <p className="text-xs font-semibold text-indigo-400">{cert.organization}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Issued: {cert.issue_date}</p>
                </div>
              </div>

              {cert.verification_url && (
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-500">ID: {cert.credential_id || 'N/A'}</span>
                  <a href={cert.verification_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white font-semibold flex items-center gap-1">
                    <span>Verify</span> <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Google UX Design Professional Certificate"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Google / Meta"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Issue Date / Year</label>
                  <input
                    type="text"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    placeholder="2024"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Credential ID (Optional)</label>
                <input
                  type="text"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  placeholder="GUX-9482-302"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Verification URL</label>
                <input
                  type="url"
                  value={formData.verification_url}
                  onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Upload Certificate File/Image</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleUploadImage}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
                {formData.certificate_image_url && (
                  <p className="text-[11px] text-emerald-400 mt-1 truncate">Uploaded: {formData.certificate_image_url}</p>
                )}
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
