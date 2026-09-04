import React, { useState, useEffect } from 'react';
import { Save, Upload, User, Mail, MapPin, FileText } from 'lucide-react';
import { Github, Linkedin, Twitter, Figma, Dribbble } from '../../components/icons/BrandIcons';
import { fetchProfile, updateProfile, uploadMedia } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function SettingsManager() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', 'Avatar Profile');
      const uploaded = await uploadMedia(data);
      setFormData({ ...formData, avatar_url: uploaded.file_display_url });
      showToast('Avatar image uploaded!', 'success');
    } catch (err) {
      showToast('Avatar upload failed.', 'error');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', 'Resume Document');
      const uploaded = await uploadMedia(data);
      setFormData({ ...formData, resume_url: uploaded.file_display_url });
      showToast('Resume PDF uploaded!', 'success');
    } catch (err) {
      showToast('Resume upload failed.', 'error');
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Avatar Profile Image</label>
            <div className="flex items-center gap-4">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xl">
                  {formData.full_name.charAt(0)}
                </div>
              )}

              <label className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white cursor-pointer">
                Upload New Avatar
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Resume PDF Document</label>
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-indigo-300 cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>Upload Resume PDF</span>
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
              {formData.resume_url && (
                <p className="text-[11px] text-emerald-400 truncate">Resume attached: {formData.resume_url}</p>
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
