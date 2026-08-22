'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ImageCropper from './ImageCropper';

/** Turn a Tailwind aspect class ("aspect-video", "aspect-[3/4]") into a numeric ratio. */
function ratioFromAspect(aspect: string): number {
  if (aspect === 'aspect-square') return 1;
  if (aspect === 'aspect-video') return 16 / 9;
  const custom = /^aspect-\[(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\]$/.exec(aspect);
  if (custom) {
    const w = parseFloat(custom[1]);
    const h = parseFloat(custom[2]);
    if (w > 0 && h > 0) return w / h;
  }
  return 16 / 9;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: string;
  /** Crop images to `aspect` before uploading. Videos always skip cropping. */
  crop?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'taari',
  label = 'Image',
  aspect = 'aspect-video',
  crop = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState<{ src: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = ratioFromAspect(aspect);

  // Object URLs for the crop preview must be revoked once the modal closes.
  useEffect(() => {
    return () => { if (pending) URL.revokeObjectURL(pending.src); };
  }, [pending]);

  function closeCropper() {
    setPending((p) => {
      if (p) URL.revokeObjectURL(p.src);
      return null;
    });
  }

  /** Re-open the cropper on an image that is already uploaded. */
  async function recropExisting() {
    if (!value.trim()) return;
    setUploading(true);
    try {
      // Cropping reads pixels from a canvas, so the source must be CORS-readable.
      const res = await fetch(value, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) throw new Error('not an image');
      setPending({ src: URL.createObjectURL(blob), name: 'recrop' });
    } catch {
      alert('Could not load this image for cropping. Upload a new file instead.');
    } finally {
      setUploading(false);
    }
  }

  /** Entry point for a picked/dropped file: crop images first, upload videos directly. */
  function handleFile(file: File) {
    const isImage = file.type.startsWith('image/');
    if (!isImage && !file.type.startsWith('video/')) {
      alert('Please select an image or video file');
      return;
    }
    // SVGs have no raster pixels to crop and would be rasterized by canvas.
    if (crop && isImage && file.type !== 'image/svg+xml') {
      setPending({ src: URL.createObjectURL(file), name: file.name });
      return;
    }
    handleUpload(file);
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.url) {
        alert(data.error || 'Upload failed — no URL returned');
        return;
      }

      onChange(data.url);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so picking the same file again still fires onChange.
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</label>

      {value && value.trim() ? (
        <div className="relative group">
          <div className={`relative ${aspect} overflow-hidden rounded-lg border border-gray-200`}>
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
              sizes="400px"
              unoptimized
            />
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-[#1A1A1A] text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Replace
            </button>
            {crop && (
              <button
                type="button"
                onClick={recropExisting}
                className="bg-white text-[#1A1A1A] text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Crop
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            ${aspect} border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragOver ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-gray-200 hover:border-gray-400'}
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin" />
              <span className="text-sm text-[#6B6B6B]">Uploading...</span>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              <p className="text-sm text-[#6B6B6B]">
                <span className="font-medium text-[#C9A84C]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#9A9A9A] mt-1">PNG, JPG, WebP up to 10MB</p>
            </>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-gray-400 outline-none focus:border-[#C9A84C] transition-colors"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {pending && (
        <ImageCropper
          src={pending.src}
          fileName={pending.name}
          aspectRatio={aspectRatio}
          onCancel={closeCropper}
          onCropped={(file) => {
            closeCropper();
            handleUpload(file);
          }}
        />
      )}
    </div>
  );
}
