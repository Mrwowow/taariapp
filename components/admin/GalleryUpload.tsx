'use client';

import { useRef, useState } from 'react';
import { isVideoUrl } from '@/lib/media';

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  /** Called when an item's "set as featured" star is clicked. Omit to hide the star. */
  onSetFeatured?: (url: string) => void;
}

export default function GalleryUpload({
  value,
  onChange,
  folder = 'taari',
  label = 'Gallery',
  onSetFeatured,
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) return null;
      return data.url as string;
    } catch {
      return null;
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const accepted = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
    );
    if (accepted.length !== files.length) {
      alert('Some files were skipped — only images and videos can be added.');
    }
    if (!accepted.length) return;

    setUploading(accepted.length);
    // Upload together, then append in the order they were picked.
    const results = await Promise.all(accepted.map(uploadOne));
    const urls = results.filter((u): u is string => Boolean(u));
    if (urls.length < accepted.length) {
      alert(`${accepted.length - urls.length} file(s) failed to upload.`);
    }
    if (urls.length) onChange([...value, ...urls]);
    setUploading(0);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...value, url]);
    setUrlDraft('');
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}
        {value.length > 0 && (
          <span className="ml-1 font-normal text-[#6B6B6B]">({value.length})</span>
        )}
      </label>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group">
              <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {isVideoUrl(url) ? (
                  <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                )}
              </div>

              {isVideoUrl(url) && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium pointer-events-none">
                  Video
                </span>
              )}

              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSetFeatured && !isVideoUrl(url) && (
                  <button
                    type="button"
                    onClick={() => onSetFeatured(url)}
                    title="Set as featured image"
                    className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs flex items-center justify-center hover:bg-white shadow-sm"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  title="Remove"
                  className="w-7 h-7 rounded-full bg-red-500/90 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow-sm"
                >
                  ✕
                </button>
              </div>

              {/* Reordering controls — gallery order is persisted as sort_order. */}
              <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  title="Move earlier"
                  className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs flex items-center justify-center hover:bg-white shadow-sm disabled:opacity-30"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === value.length - 1}
                  title="Move later"
                  className="w-7 h-7 rounded-full bg-white/90 text-gray-700 text-xs flex items-center justify-center hover:bg-white shadow-sm disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`
          border-2 border-dashed rounded-lg py-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${dragOver ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-gray-200 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-7 h-7 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin" />
            <span className="text-sm text-[#6B6B6B]">
              Uploading {uploading} file{uploading > 1 ? 's' : ''}…
            </span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <p className="text-sm text-[#6B6B6B]">
              <span className="font-medium text-[#C9A84C]">Add photos or videos</span> — or drag and drop
            </p>
            <p className="text-xs text-[#9A9A9A] mt-1">You can select several files at once</p>
          </>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
          placeholder="Or paste an image/video URL..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-gray-400 outline-none focus:border-[#C9A84C] transition-colors"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlDraft.trim()}
          className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-[#1A1A1A] hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
        className="hidden"
      />
    </div>
  );
}
