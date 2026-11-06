'use client';

import React, { useState } from 'react';
import { Library, Plus, X, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AddLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLibraryModal: React.FC<AddLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addSavedLibrary } = useApp();

  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [ecosystem, setEcosystem] = useState<'npm' | 'PyPI'>('npm');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !version.trim()) return;

    addSavedLibrary({
      name: name.trim(),
      version: version.trim(),
      ecosystem,
      description: description.trim() || 'Custom tracked project dependency',
    });

    setName('');
    setVersion('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-electric-500/20 text-cyan-400 flex items-center justify-center">
              <Library className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              Track New Library
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. zod, express, pydantic"
              className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Pinned Version *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 3.23.8"
                className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Ecosystem
              </label>
              <select
                value={ecosystem}
                onChange={(e) => setEcosystem(e.target.value as any)}
                className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="npm">npm (Node.js)</option>
                <option value="PyPI">PyPI (Python)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Purpose of this library in the application..."
              className="mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-electric-600/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Saved</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

