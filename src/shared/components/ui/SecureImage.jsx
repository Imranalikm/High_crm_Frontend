import React, { useState, useEffect } from 'react';

const isPdfUrl = (url) => /\.pdf($|\?)/i.test(url || '');

/**
 * Renders a protected upload (image or PDF).
 * The file is fetched with the auth token and shown from a same-origin blob: URL,
 * so it works even when the API sends X-Frame-Options / sits on another origin.
 * PDFs are detected by content type (or .pdf extension) and shown in an iframe,
 * because an <img> tag cannot display a PDF (it would only show the alt text).
 */
export function SecureImage({ src, alt, className, referrerPolicy, style, ...props }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(isPdfUrl(src));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setIsPdf(isPdfUrl(src));

    if (!src) {
      setBlobUrl(null);
      return;
    }

    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setBlobUrl(src);
      setIsPdf(src.startsWith('data:application/pdf'));
      return;
    }

    let active = true;
    let createdUrl = null;
    setLoading(true);
    setBlobUrl(null);

    (async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch(src, {
          headers,
          referrerPolicy: referrerPolicy || 'no-referrer',
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const pdf = contentType.includes('application/pdf') || isPdfUrl(src);
        let blob = await response.blob();
        if (pdf && blob.type !== 'application/pdf') {
          blob = new Blob([blob], { type: 'application/pdf' });
        }
        if (!active) return;

        createdUrl = URL.createObjectURL(blob);
        setIsPdf(pdf);
        setBlobUrl(createdUrl);
      } catch (err) {
        console.warn('Failed to load secure file:', err);
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src, referrerPolicy]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted-surface/10 rounded-[10px]">
        <span className="text-[9px] text-text-muted/40 font-bold uppercase tracking-wider">Loading...</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-center">
        <span className="text-[12px] font-semibold text-text-muted">Unable to load {alt || 'file'}</span>
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand hover:underline">
          Open in new tab
        </a>
      </div>
    );
  }

  if (!blobUrl) return null;

  if (isPdf) {
    return (
      <div className="w-full h-full flex flex-col gap-1.5">
        <iframe
          src={blobUrl}
          title={alt || 'Document'}
          className="w-full flex-1 min-h-0 rounded-[6px] border-0 bg-white"
        />
        <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-brand hover:underline self-end">
          Open PDF in new tab
        </a>
      </div>
    );
  }

  return <img src={blobUrl} alt={alt} className={className} style={style} {...props} />;
}

export default SecureImage;
