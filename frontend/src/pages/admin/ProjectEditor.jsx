import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Upload, Sparkles, Image,
  Layers, Target, Users, Layout, Palette, ExternalLink, Award, Lightbulb
} from 'lucide-react';
import { Github, Figma } from '../../components/icons/BrandIcons';
import { fetchProjectById, createProject, updateProject, uploadMedia } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const CASE_STUDY_SECTION_TYPES = [
  { id: 'overview', label: 'Project Overview' },
  { id: 'problem', label: 'Problem Statement' },
  { id: 'research', label: 'User Research & Insights' },
  { id: 'personas', label: 'Personas & Journeys' },
  { id: 'information_architecture', label: 'Information Architecture' },
  { id: 'wireframes', label: 'Wireframes & Low-Fi' },
  { id: 'ui_design', label: 'UI Design & Visuals' },
  { id: 'design_system', label: 'Design System & Tokens' },
  { id: 'prototype', label: 'Interactive Prototype' },
  { id: 'results', label: 'Results & Impact' },
  { id: 'learnings', label: 'Learnings & Next Steps' },
];

export default function ProjectEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'UI/UX Design',
    short_description: '',
    project_date: '2025',
    live_url: '',
    github_url: '',
    figma_url: '',
    is_featured: false,
    is_published: true,
    thumbnail_url: '',
    technologies: ['Figma', 'React', 'Tailwind CSS'],
    full_case_study: [
      { type: 'overview', title: 'Project Overview', content: 'Comprehensive overview of the product vision and key objectives.' },
      { type: 'problem', title: 'Problem Statement', content: 'Key user pain points identified during initial discovery.' }
    ],
    gallery_images: [],
  });

  const [techInput, setTechInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const loadProject = async () => {
        try {
          const data = await fetchProjectById(id);
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || 'UI/UX Design',
            short_description: data.short_description || '',
            project_date: data.project_date || '',
            live_url: data.live_url || '',
            github_url: data.github_url || '',
            figma_url: data.figma_url || '',
            is_featured: data.is_featured || false,
            is_published: data.is_published || false,
            thumbnail_url: data.thumbnail_display_url || data.thumbnail_url || '',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            full_case_study: Array.isArray(data.full_case_study) ? data.full_case_study : [],
            gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          });
        } catch (err) {
          console.error('Failed to load project:', err);
          showToast('Failed to load project details.', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadProject();
    }
  }, [id, isEditing]);

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleAddCaseSection = (typeId) => {
    const sectionDef = CASE_STUDY_SECTION_TYPES.find((s) => s.id === typeId);
    const newSection = {
      type: typeId,
      title: sectionDef ? sectionDef.label : typeId,
      content: '',
      images: [],
    };
    setFormData({
      ...formData,
      full_case_study: [...formData.full_case_study, newSection],
    });
  };

  const handleUpdateCaseSection = (index, field, value) => {
    const updated = [...formData.full_case_study];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, full_case_study: updated });
  };

  const handleRemoveCaseSection = (index) => {
    setFormData({
      ...formData,
      full_case_study: formData.full_case_study.filter((_, idx) => idx !== index),
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', `Thumbnail for ${formData.title}`);
      const uploaded = await uploadMedia(data);
      setFormData({ ...formData, thumbnail_url: uploaded.file_display_url });
      showToast('Thumbnail uploaded to media library!', 'success');
    } catch (err) {
      showToast('Thumbnail upload failed.', 'error');
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        const uploaded = await uploadMedia(data);
        uploadedUrls.push(uploaded.file_display_url);
      }
      setFormData({
        ...formData,
        gallery_images: [...formData.gallery_images, ...uploadedUrls],
      });
      showToast(`${files.length} gallery image(s) uploaded!`, 'success');
    } catch (err) {
      showToast('Gallery upload failed.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateProject(id, formData);
        showToast('Project updated successfully!', 'success');
      } else {
        await createProject(formData);
        showToast('New project created successfully!', 'success');
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error('Save project error:', err);
      showToast('Failed to save project. Please check form inputs.', 'error');
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              {isEditing ? `Edit Project: ${formData.title}` : 'Create New Project'}
            </h2>
            <p className="text-sm text-gray-400">Build project metadata and structured case study sections.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Project Metadata</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. UrbanNest Smart Home Ecosystem"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="urbannest-smart-home (auto-generated if empty)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0f1422] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Design System">Design System</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Project Date / Year</label>
            <input
              type="text"
              value={formData.project_date}
              onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
              placeholder="2025"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Short Description</label>
          <textarea
            rows={3}
            required
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief summary for portfolio cards..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* URLs & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Live Project URL</label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Figma URL</label>
            <input
              type="url"
              value={formData.figma_url}
              onChange={(e) => setFormData({ ...formData, figma_url: e.target.value })}
              placeholder="https://figma.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>
        </div>

        {/* Technologies Tag Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Technologies & Tools</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              placeholder="Add tool (e.g. React, TypeScript, Figma)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-rose-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status Toggles */}
        <div className="flex items-center gap-8 pt-4 border-t border-white/10">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-0"
            />
            <span className="text-sm font-bold text-white">Published on Website</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-0"
            />
            <span className="text-sm font-bold text-white">Featured Project Badge</span>
          </label>
        </div>

      </div>

      {/* Thumbnail & Gallery Media Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Project Media</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Thumbnail Image</label>
            {formData.thumbnail_url ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10]">
                <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 cursor-pointer bg-white/5 transition-all text-center space-y-2">
                <Upload className="w-8 h-8 text-indigo-400" />
                <span className="text-xs text-gray-300 font-semibold">Click to Upload Thumbnail Image</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
            )}
            <input
              type="text"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="Or paste image URL directly..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
            />
          </div>

          {/* Gallery Images */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Project Gallery Images</label>
            <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 cursor-pointer bg-white/5 transition-all text-center space-y-2">
              <Image className="w-8 h-8 text-violet-400" />
              <span className="text-xs text-gray-300 font-semibold">Upload Multiple Gallery Images</span>
              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
            </label>

            {formData.gallery_images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {formData.gallery_images.map((imgUrl, gIdx) => (
                  <div key={gIdx} className="relative rounded-xl overflow-hidden border border-white/10 aspect-square group">
                    <img src={imgUrl} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        gallery_images: formData.gallery_images.filter((_, i) => i !== gIdx)
                      })}
                      className="absolute top-1 right-1 p-1 bg-black/80 rounded-md text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Study Section Builder */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Full Case Study Builder</h3>
            <p className="text-xs text-gray-400">Add detailed case study sections (Problem, Research, Wireframes, UI Design, Results, etc.)</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CASE_STUDY_SECTION_TYPES.slice(0, 5).map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleAddCaseSection(sec.id)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-indigo-300 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Case Study Sections */}
        <div className="space-y-6">
          {formData.full_case_study.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-white/10 rounded-2xl">
              No case study sections added yet. Click one of the buttons above to start building.
            </div>
          ) : (
            formData.full_case_study.map((section, sIdx) => (
              <div key={sIdx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative">
                
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => handleUpdateCaseSection(sIdx, 'title', e.target.value)}
                      placeholder="Section Title"
                      className="font-bold text-white text-base bg-transparent border-b border-white/20 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCaseSection(sIdx)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Section Content</label>
                  <textarea
                    rows={4}
                    value={section.content || ''}
                    onChange={(e) => handleUpdateCaseSection(sIdx, 'content', e.target.value)}
                    placeholder="Write section narrative, methodologies, key findings, or impact..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </form>
  );
}
