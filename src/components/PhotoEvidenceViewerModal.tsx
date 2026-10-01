import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Camera, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { getStageDetails } from '../utils/formatters';

export const PhotoEvidenceViewerModal: React.FC = () => {
  const { isPhotoViewerOpen, closePhotoViewer, selectedPhoto, activeProject } = useApp();

  if (!isPhotoViewerOpen || !selectedPhoto) return null;

  const stageInfo = getStageDetails(selectedPhoto.stage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl text-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {selectedPhoto.title}
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  {selectedPhoto.tag}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {activeProject?.year} {activeProject?.make} {activeProject?.model} ({activeProject?.trackingRef})
              </p>
            </div>
          </div>
          <button
            onClick={closePhotoViewer}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Photo Container */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[350px] max-h-[60vh] overflow-hidden p-2">
          <img
            src={selectedPhoto.imageUrl}
            alt={selectedPhoto.title}
            className="max-h-[58vh] max-w-full object-contain rounded-lg shadow-inner"
          />
        </div>

        {/* Photo Metadata Footer */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {selectedPhoto.timestamp}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Verified by: <strong className="text-white">{selectedPhoto.photographer}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Stage: <strong className="text-white">{stageInfo.label}</strong>
              </span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
            {selectedPhoto.description}
          </p>
        </div>
      </div>
    </div>
  );
};
