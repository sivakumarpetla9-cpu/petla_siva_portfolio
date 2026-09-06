import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, User, Mail, MapPin, FileText, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Github, Linkedin, Twitter, Figma, Dribbble } from '../../components/icons/BrandIcons';
import {
  fetchProfile, updateProfile, uploadMedia,
  getFullImageUrl, validateImageFile
} from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function SettingsManager() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    hero_headline: '',
    hero_subheading: '',
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    figma_url: '',
    dribbble_url: '',
    avatar_url: '',
    resume_url: '',
  });

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          title: data.title || '',
          bio: data.bio || '',
          hero_headline: data.hero_headline || '',
          hero_subheading: data.hero_subheading || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          figma_url: data.figma_url || '',
          dribbble_url: data.dribbble_url || '',
          avatar_url: data.avatar_display_url || data.avatar_url || '',
          resume_url: data.resume_display_url || data.resume_url || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      return;
    }

    const tempBlobUrl = URL.createObjectURL(file);
    setAvatarPreview(tempBlobUrl);
    setAvatarUploading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', `Avatar - ${formData.full_name || 'Profile'}`);
      const uploaded = await uploadMedia(data);
      const permanentUrl = uploaded.file_display_url || uploaded.file || '';
      setFormData((prev) => ({ ...prev, avatar_url: permanentUrl }));
      showToast('Avatar image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Avatar upload error:', err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.file?.[0] ||
        'Avatar upload failed. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      URL.revokeObjectURL(tempBlobUrl);
      setAvatarPreview(null);
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a PDF document for resume.', 'error');
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      return;
    }

    setResumeUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', `Resume - ${formData.full_name || 'Petla Siva Kumar'}`);
      const uploaded = await uploadMedia(data);
      const permanentUrl = uploaded.file_display_url || uploaded.file || '';
      setFormData((prev) => ({ ...prev, resume_url: permanentUrl }));
      showToast('Resume PDF uploaded successfully!', 'success');
    } catch (err) {
      showToast('Resume upload failed.', 'error');
    } finally {
      setResumeUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profile?.id) {
        await updateProfile(profile.id, formData);
        showToast('Profile settings updated successfully!', 'success');
        loadProfileData();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Profile & Site Settings</h2>
          <p className="text-sm text-gray-400">Manage hero headlines, contact details, avatar, and resume PDF.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Personal & Hero Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Professional Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Hero Headline</label>
          <input
            type="text"
            value={formData.hero_headline}
            onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
            placeholder="Designing intuitive interfaces. Engineering performant web apps."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Hero Subheading / Bio Summary</label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Avatar & Resume Upload Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Avatar & Resume Media</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Avatar Profile Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Avatar Profile Image
            </label>

            <input
              ref={avatarInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-5">
              {/* Clickable Avatar Area */}
              <div
                role="button"
                tabIndex={0}
                title="Click to change avatar image"
                onClick={() => !avatarUploading && avatarInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    avatarInputRef.current?.click();
                  }
                }}
                className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer ring-2 ring-indigo-500/40 hover:ring-indigo-500 transition-all group shrink-0 bg-[#0f1422]"
              >
                {(avatarPreview || formData.avatar_url) ? (
                  <img
                    src={avatarPreview || getFullImageUrl(formData.avatar_url)}
                    alt="Profile Avatar"
                    className={`w-full h-full object-cover transition-opacity ${avatarUploading ? 'opacity-30' : 'group-hover:scale-105'}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-600/30 to-violet-600/30 flex items-center justify-center text-indigo-300 font-bold text-2xl">
                    {formData.full_name?.charAt(0) || 'A'}
                  </div>
                )}

                {avatarUploading ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Upload className="w-5 h-5 text-indigo-300" />
                    <span className="text-[10px] font-semibold mt-1">Change</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Help text */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {(avatarPreview || formData.avatar_url) ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Change Avatar</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Avatar</span>
                      </>
                    )}
                  </button>

                  {(avatarPreview || formData.avatar_url) && (
                    <button
                      type="button"
                      disabled={avatarUploading}
                      onClick={() => {
                        setFormData({ ...formData, avatar_url: '' });
                        setAvatarPreview(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  PNG, JPG, JPEG, or WEBP (Max 10MB).
                </p>
              </div>
            </div>
          </div>

          {/* Resume PDF Document */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Resume PDF Document
            </label>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
            <div className="space-y-2">
              <button
                type="button"
                disabled={resumeUploading}
                onClick={() => resumeInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-indigo-300 hover:text-white transition-all cursor-pointer"
              >
                {resumeUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Uploading PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>{formData.resume_url ? 'Replace Resume PDF' : 'Upload Resume PDF'}</span>
                  </>
                )}
              </button>
              {formData.resume_url && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 truncate">
                  <span>Attached:</span>
                  <a
                    href={getFullImageUrl(formData.resume_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-emerald-300 truncate"
                  >
                    {formData.resume_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Social Profiles</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Figma URL</label>
            <input
              type="url"
              value={formData.figma_url}
              onChange={(e) => setFormData({ ...formData, figma_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Twitter URL</label>
            <input
              type="url"
              value={formData.twitter_url}
              onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>
        </div>
      </div>

    </form>
  );
}
