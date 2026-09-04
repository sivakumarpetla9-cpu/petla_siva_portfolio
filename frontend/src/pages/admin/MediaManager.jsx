import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, Trash2, Eye, X, FileText } from 'lucide-react';
import { fetchMedia, uploadMedia, deleteMedia } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { showToast } = useToast();

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await fetchMedia();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        await uploadMedia(formData);
      }
      showToast(`${files.length} file(s) uploaded successfully!`, 'success');
      loadMedia();
    } catch (err) {
      showToast('Media upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file from the media library?')) return;
    try {
      await deleteMedia(id);
      showToast('Media file deleted.', 'success');
      if (selectedMedia?.id === id) setSelectedMedia(null);
      loadMedia();
    } catch (err) {
      showToast('Failed to delete media file.', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Media Library</h2>
          <p className="text-sm text-gray-400">Upload, preview, and manage images & document assets.</p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Drag and Drop Zone */}
      <label className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 cursor-pointer bg-white/5 transition-all text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <ImageIcon className="w-7 h-7" />
        </div>
        <div>
          <span className="text-base font-bold text-white block">Drag & Drop files here, or click to browse</span>
          <span className="text-xs text-gray-400 mt-1 block">Supports PNG, JPG, WEBP, SVG, PDF up to 10MB</span>
        </div>
        <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
      </label>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 border border-white/10">
          <ImageIcon className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Media Library is Empty</h3>
          <p className="text-gray-400 text-sm">Upload your project thumbnails, wireframes, and case study assets here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => (
            <div key={item.id} className="group glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              
              <div className="relative aspect-square bg-gray-950 overflow-hidden cursor-pointer" onClick={() => setSelectedMedia(item)}>
                {item.file_display_url && item.file_type?.includes('image') ? (
                  <img src={item.file_display_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-400">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    <span className="text-[10px] truncate max-w-full mt-1 font-bold">{item.title}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedMedia(item); }}
                    className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30"
                    title="View File"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopyLink(item.file_display_url, item.id); }}
                    className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                    title="Copy Link"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-xs space-y-1">
                <p className="font-bold text-white truncate" title={item.title}>{item.title}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>{formatBytes(item.file_size)}</span>
                  <span>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white truncate max-w-md">{selectedMedia.title}</h3>
              <button onClick={() => setSelectedMedia(null)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto rounded-2xl bg-black flex items-center justify-center">
              <img src={selectedMedia.file_display_url} alt={selectedMedia.title} className="max-h-[60vh] object-contain rounded-2xl" />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-gray-300">
              <span>Size: {formatBytes(selectedMedia.file_size)}</span>
              <button
                onClick={() => handleCopyLink(selectedMedia.file_display_url, selectedMedia.id)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Image URL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
