const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'avi', 'mkv'];

/**
 * Gallery media is stored as a bare URL list, so the media type is inferred
 * from the URL. Cloudinary video URLs also carry a /video/upload/ path segment.
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (/\/video\/upload\//.test(url)) return true;
  // Ignore any query string or fragment before reading the extension.
  const path = url.split(/[?#]/)[0];
  const ext = path.split('.').pop()?.toLowerCase();
  return !!ext && VIDEO_EXTENSIONS.includes(ext);
}
