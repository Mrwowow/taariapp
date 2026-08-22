'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageCropperProps {
  /** Object URL of the image being cropped. */
  src: string;
  /** Target width / height. The crop box is locked to this ratio. */
  aspectRatio: number;
  /** Original filename, reused for the cropped output. */
  fileName: string;
  onCancel: () => void;
  onCropped: (file: File) => void;
}

type Rect = { x: number; y: number; width: number; height: number };
type DragMode = 'move' | 'nw' | 'ne' | 'sw' | 'se';

const MIN_SIZE = 40; // px, in displayed-image space
/** Longest edge of the exported image — keeps uploads reasonable without visible loss. */
const MAX_OUTPUT = 2400;

const HANDLES: { mode: DragMode; className: string; cursor: string }[] = [
  { mode: 'nw', className: '-top-1.5 -left-1.5', cursor: 'nwse-resize' },
  { mode: 'ne', className: '-top-1.5 -right-1.5', cursor: 'nesw-resize' },
  { mode: 'sw', className: '-bottom-1.5 -left-1.5', cursor: 'nesw-resize' },
  { mode: 'se', className: '-bottom-1.5 -right-1.5', cursor: 'nwse-resize' },
];

/** Largest rect of `ratio` that fits inside width x height, centered. */
function fitRect(width: number, height: number, ratio: number): Rect {
  let w = width;
  let h = w / ratio;
  if (h > height) {
    h = height;
    w = h * ratio;
  }
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

function clampToBounds(rect: Rect, bounds: { width: number; height: number }): Rect {
  return {
    ...rect,
    x: Math.min(Math.max(rect.x, 0), Math.max(0, bounds.width - rect.width)),
    y: Math.min(Math.max(rect.y, 0), Math.max(0, bounds.height - rect.height)),
  };
}

export default function ImageCropper({
  src,
  aspectRatio,
  fileName,
  onCancel,
  onCropped,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  // Displayed size of the <img>, which is what crop coordinates are expressed in.
  const [display, setDisplay] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState<Rect | null>(null);
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<{ mode: DragMode; startX: number; startY: number; origin: Rect } | null>(null);

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const { width, height } = img.getBoundingClientRect();
    if (!width || !height) return;
    setDisplay({ width, height });
    setCrop((prev) => {
      // Keep the crop proportional across resizes rather than resetting it.
      if (!prev || !display.width || !display.height) return fitRect(width, height, aspectRatio);
      const scale = width / display.width;
      return clampToBounds(
        { x: prev.x * scale, y: prev.y * scale, width: prev.width * scale, height: prev.height * scale },
        { width, height },
      );
    });
  }, [aspectRatio, display.width, display.height]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  // Pointer drag is tracked on window so the gesture survives leaving the crop box.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const drag = dragRef.current;
      if (!drag || !display.width) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const o = drag.origin;

      if (drag.mode === 'move') {
        setCrop(clampToBounds({ ...o, x: o.x + dx, y: o.y + dy }, display));
        return;
      }

      // Resize from the corner opposite the dragged handle, ratio locked.
      const anchorX = drag.mode === 'nw' || drag.mode === 'sw' ? o.x + o.width : o.x;
      const anchorY = drag.mode === 'nw' || drag.mode === 'ne' ? o.y + o.height : o.y;
      const dirX = drag.mode === 'ne' || drag.mode === 'se' ? 1 : -1;
      const dirY = drag.mode === 'sw' || drag.mode === 'se' ? 1 : -1;

      let width = Math.max(MIN_SIZE, o.width + dirX * dx);
      // Constrain to the image edges the crop is growing toward.
      const maxWidth = dirX === 1 ? display.width - anchorX : anchorX;
      const maxHeight = dirY === 1 ? display.height - anchorY : anchorY;
      width = Math.min(width, maxWidth, maxHeight * aspectRatio);
      const height = width / aspectRatio;

      setCrop({
        x: dirX === 1 ? anchorX : anchorX - width,
        y: dirY === 1 ? anchorY : anchorY - height,
        width,
        height,
      });
    }

    function onUp() {
      dragRef.current = null;
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [aspectRatio, display]);

  function startDrag(mode: DragMode, e: React.PointerEvent) {
    if (!crop) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { mode, startX: e.clientX, startY: e.clientY, origin: crop };
  }

  async function handleApply() {
    const img = imgRef.current;
    if (!img || !crop || !display.width) return;
    setBusy(true);
    try {
      // Map the displayed crop back onto the image's intrinsic pixels.
      const scale = img.naturalWidth / display.width;
      const sx = crop.x * scale;
      const sy = crop.y * scale;
      const sw = crop.width * scale;
      const sh = crop.height * scale;

      const outWidth = Math.round(Math.min(sw, MAX_OUTPUT));
      const outHeight = Math.round(outWidth / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outWidth, outHeight);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92),
      );
      if (!blob) throw new Error('Could not render crop');

      const name = fileName.replace(/\.[^.]+$/, '') || 'image';
      onCropped(new File([blob], `${name}.jpg`, { type: 'image/jpeg' }));
    } catch {
      alert('Could not crop this image. Try uploading it without cropping.');
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Crop image"
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-[#1A1A1A]">Crop image</h2>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Drag to reposition, or pull a corner to resize. The crop is locked to the shape this
            image is displayed in.
          </p>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center min-h-0">
          <div className="relative inline-block select-none max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              onLoad={measure}
              draggable={false}
              className="block max-w-full max-h-[60vh] w-auto h-auto"
            />

            {crop && (
              <>
                {/* Dim everything outside the crop box. */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x}px ${crop.y}px, ${crop.x}px ${crop.y + crop.height}px, ${crop.x + crop.width}px ${crop.y + crop.height}px, ${crop.x + crop.width}px ${crop.y}px, ${crop.x}px ${crop.y}px)`,
                    background: 'rgba(0,0,0,0.5)',
                  }}
                />
                <div
                  onPointerDown={(e) => startDrag('move', e)}
                  className="absolute border-2 border-white cursor-move touch-none"
                  style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height }}
                >
                  {/* Rule-of-thirds guides */}
                  <div className="absolute inset-0 pointer-events-none opacity-50">
                    <div className="absolute top-1/3 left-0 right-0 border-t border-white/70" />
                    <div className="absolute top-2/3 left-0 right-0 border-t border-white/70" />
                    <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/70" />
                    <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/70" />
                  </div>
                  {HANDLES.map((h) => (
                    <div
                      key={h.mode}
                      onPointerDown={(e) => startDrag(h.mode, e)}
                      style={{ cursor: h.cursor }}
                      className={`absolute w-3 h-3 bg-white border border-gray-400 rounded-sm touch-none ${h.className}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={busy || !crop}
            className="px-4 py-2 text-sm font-medium bg-[#C9A84C] text-white rounded-lg hover:bg-[#9A7A2E] transition-colors disabled:opacity-50"
          >
            {busy ? 'Cropping…' : 'Crop & upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
