import React, { useState, useEffect } from 'react';

export function SecureImage({ src, alt, className, referrerPolicy, ...props }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src) {
      setBlobUrl(null);
      return;
    }

    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setBlobUrl(src);
      return;
    }

    let active = true;
    setLoading(true);

    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(src, {
          headers,
          referrerPolicy: referrerPolicy || 'no-referrer',
        });

        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }

        const blob = await response.blob();
        if (!active) return;
        
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      } catch (err) {
        console.warn('Failed to load secure image via fetch, falling back to direct url:', err);
        if (!active) return;
        setBlobUrl(src);
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      active = false;
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted-surface/10 rounded-[10px]">
        <span className="text-[9px] text-text-muted/40 font-bold uppercase tracking-wider">Loading...</span>
      </div>
    );
  }

  return (
    <img 
      src={blobUrl || src} 
      alt={alt} 
      className={className} 
      {...props} 
    />
  );
}

export default SecureImage;
