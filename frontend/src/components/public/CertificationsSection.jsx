import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, CheckCircle, Sparkles, Eye, X } from 'lucide-react';
import { getFullImageUrl } from '../../api/client';

export default function CertificationsSection({ certifications = [] }) {
  const [selectedCertImage, setSelectedCertImage] = useState(null);

  return (
    <section id="certifications" className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Accomplishments
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified <span className="text-gradient">Certifications</span>
          </h2>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{cert.name}</h3>
                  <p className="text-sm font-semibold text-indigo-300">{cert.organization}</p>
                  <p className="text-xs text-gray-400 mt-1">Issued: {cert.issue_date}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                {(cert.certificate_image_display_url || cert.certificate_image_url) ? (
                  <button
                    onClick={() => setSelectedCertImage(getFullImageUrl(cert.certificate_image_display_url || cert.certificate_image_url))}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Document
                  </button>
                ) : (
                  <span className="text-xs text-gray-500">ID: {cert.credential_id || 'N/A'}</span>
                )}

                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Certificate Image Modal */}
      {selectedCertImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#0f1422] rounded-3xl border border-white/10 p-4 space-y-4 overflow-hidden">
            <div className="flex justify-between items-center px-4 pt-2">
              <h4 className="text-sm font-bold text-white">Certificate Preview</h4>
              <button
                onClick={() => setSelectedCertImage(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-auto rounded-2xl">
              <img src={selectedCertImage} alt="Certificate" className="w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
