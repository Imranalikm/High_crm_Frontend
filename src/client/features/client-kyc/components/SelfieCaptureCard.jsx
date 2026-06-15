import React, { useRef, useState, useEffect } from 'react';
import { Camera, UploadCloud, ScanFace, CheckCircle2, X, AlertCircle, Sun, Eye, Lightbulb } from 'lucide-react';
import { UploadArea } from './DocumentUploadCard';

const GUIDES = [
  { Icon: Sun, title: 'Good lighting', desc: 'Make sure your face is well-lit and clear' },
  { Icon: Eye, title: 'Clear face view', desc: 'Remove glasses, hats, and masks' },
  { Icon: ScanFace, title: 'Center your face', desc: 'Keep your head inside the circle outline' },
];

export function SelfieCaptureCard({ value, onChange, error }) {
  const [mode, setMode] = useState('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [preview, setPreview] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!value?.type?.startsWith('image/')) {
      const t = setTimeout(() => setPreview(null), 0);
      return () => clearTimeout(t);
    }
    const url = URL.createObjectURL(value);
    const t = setTimeout(() => setPreview(url), 0);
    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError('Camera access was denied. Please allow camera permissions or upload a photo.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      onChange(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }));
      stopCamera();
      setMode('upload');
    }, 'image/jpeg', 0.92);
  };

  const switchMode = (m) => {
    if (mode === 'camera') stopCamera();
    setMode(m);
    if (m === 'camera') startCamera();
  };

  const retake = () => { onChange(null); setPreview(null); };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="space-y-5">

      {/* ── Mode tabs ── */}
      {!preview && (
        <div className="flex gap-1 p-1 rounded-[10px] bg-muted-surface/60 border border-border/30 w-fit">
          {[['upload', UploadCloud, 'Upload Photo'], ['camera', Camera, 'Use Camera']].map((item) => {
            const [m, Icon, lbl] = item;
            return (
              <button key={m} type="button" onClick={() => switchMode(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[11.5px] font-bold transition-all ${mode === m ? 'bg-brand text-text-on-accent' : 'text-text-muted hover:text-text'}`}>
                <Icon size={13} /> {lbl}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

        {/* ── Left: capture area ── */}
        <div>
          {preview ? (
            <div className="relative rounded-[13px] overflow-hidden border border-positive/40">
              <img src={preview} alt="Selfie" className="w-full max-h-[280px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-positive" />
                  <span className="text-[12px] font-bold text-white">Selfie ready</span>
                </div>
                <button type="button" onClick={retake}
                  className="flex items-center gap-1.5 text-[10.5px] font-bold text-white/70 bg-white/15 hover:bg-negative/60 px-3 py-1.5 rounded-full transition-colors">
                  <X size={11} /> Retake
                </button>
              </div>
            </div>
          ) : mode === 'camera' ? (
            <div className="relative rounded-[13px] overflow-hidden bg-black border border-border/40" style={{ aspectRatio: '4/3' }}>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

              {/* Face oval guide */}
              {cameraActive && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div style={{
                    width: '52%',
                    aspectRatio: '3/4',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.55)',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.42)',
                  }} />
                </div>
              )}

              {/* Starting state */}
              {!cameraActive && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={30} className="text-white/35 mx-auto mb-2" />
                    <p className="text-[12px] text-white/45">Starting camera…</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div>
                    <AlertCircle size={26} className="text-negative mx-auto mb-2" />
                    <p className="text-[11.5px] text-white/65 leading-relaxed">{cameraError}</p>
                  </div>
                </div>
              )}

              {/* Capture button */}
              {cameraActive && (
                <div className="absolute bottom-5 inset-x-0 flex justify-center gap-4 items-center">
                  <button type="button" onClick={capture}
                    className="w-14 h-14 rounded-full bg-white border-[3px] border-white/50 hover:scale-105 active:scale-95 transition-transform shadow-lg" />
                </div>
              )}
            </div>
          ) : (
            <UploadArea
              label="Upload a selfie photo"
              hint="Clear front-facing photo · PNG or JPG · Max 10 MB"
              file={value}
              error={error}
              onChange={onChange}
              accept="image/png,image/jpeg"
            />
          )}
        </div>

        {/* ── Right: guidelines ── */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted">Photo guidelines</p>

          {GUIDES.map((guide) => {
            const { Icon, title, desc } = guide;
            return (
              <div key={title} className="flex gap-3 p-3.5 rounded-[10px] bg-muted-surface/50 border border-border/30">
                <div className="w-7 h-7 rounded-[7px] bg-brand/12 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={13} className="text-brand" />
                </div>
                <div>
                  <p className="text-[11.5px] font-bold">{title}</p>
                  <p className="text-[10.5px] text-text-muted mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 p-3.5 rounded-[10px] bg-warning/[0.06] border border-warning/20">
            <Lightbulb size={14} className="text-warning shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-warning/80 leading-relaxed">
              We will match your selfie to the photo on your ID to confirm it is you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}