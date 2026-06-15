import React, { useState, useEffect } from 'react';
import {
  User, FileText, ScanFace, MapPin, RotateCw, 
  ZoomIn, ZoomOut, X, Clock, CheckCircle2, 
  ShieldAlert, LockKeyhole, Eye, EyeOff
} from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { DrawerSection, DrawerField, DrawerFormGrid, DrawerFooter } from '@/components/common/drawer';
import { SecureImage } from '@/components/ui';

/* ── Helper to resolve image URLs securely ── */
const getImageUrl = (path) => {
  if (!path) return null;
  
  let stringPath = '';
  if (typeof path === 'string') {
    stringPath = path;
  } else if (typeof path === 'object') {
    if (path instanceof File) {
      try {
        return URL.createObjectURL(path);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    stringPath = path.url || path.path || path.location || path.filePath || '';
  }
  
  if (!stringPath) return null;
  
  if (stringPath.startsWith('http://') || stringPath.startsWith('https://') || stringPath.startsWith('blob:')) {
    return stringPath;
  }
  
  let baseUrl = import.meta.env.VITE_API_URL || 'https://account.smatams.com/api';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  baseUrl = baseUrl.replace(/\/api$/, '');
  return `${baseUrl}${stringPath.startsWith('/') ? '' : '/'}${stringPath}`;
};

/* ── Standardize backend flat structure and frontend nested draft structure ── */
const parseSubmittedKyc = (rawKyc) => {
  if (!rawKyc) return null;
  
  const personalInfo = {
    fullName: rawKyc.personalInfo?.fullName || rawKyc.fullName || '',
    dateOfBirth: rawKyc.personalInfo?.dateOfBirth || rawKyc.dateOfBirth || rawKyc.dob || '',
    email: rawKyc.personalInfo?.email || rawKyc.email || '',
    phone: rawKyc.personalInfo?.phone || rawKyc.phone || '',
    country: rawKyc.personalInfo?.country || rawKyc.country || '',
    address: rawKyc.personalInfo?.address || rawKyc.streetAddress || rawKyc.address || '',
    city: rawKyc.personalInfo?.city || rawKyc.city || '',
    postalCode: rawKyc.personalInfo?.postalCode || rawKyc.postalCode || rawKyc.zipCode || '',
  };

  const identityDocument = {
    type: rawKyc.identityDocument?.type || rawKyc.idDocType || rawKyc.idType || 'passport',
    documentNumber: rawKyc.identityDocument?.documentNumber || rawKyc.idDocNumber || rawKyc.documentNumber || '',
    expiryDate: rawKyc.identityDocument?.expiryDate || rawKyc.idExpiryDate || rawKyc.expiryDate || '',
    issuingCountry: rawKyc.identityDocument?.issuingCountry || rawKyc.idCountryOfIssue || rawKyc.issuingCountry || '',
    front: rawKyc.identityDocument?.front || rawKyc.idFrontImage || rawKyc.front || null,
    back: rawKyc.identityDocument?.back || rawKyc.idBackImage || rawKyc.back || null,
  };

  const selfie = rawKyc.selfie || rawKyc.selfieImage || null;

  const addressProof = {
    type: rawKyc.addressProof?.type || rawKyc.addressDocType || rawKyc.addressProofType || 'utility-bill',
    issueDate: rawKyc.addressProof?.issueDate || rawKyc.addressDocIssueDate || rawKyc.issueDate || '',
    file: rawKyc.addressProof?.file || rawKyc.addressDocImage || rawKyc.addressProofImage || null,
  };

  return {
    personalInfo,
    identityDocument,
    selfie,
    addressProof,
  };
};

/* ── Custom Header matching TransactionDetailDrawer ── */
function DHeader({ eyebrow, title, subtitle, onClose, accentColor = 'var(--brand)' }) {
  return (
    <div className="flex-shrink-0 border-b border-border/15">
      {/* Color accent bar */}
      <div
        className="h-[2.5px] w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 30%, transparent) 60%, transparent)`,
        }}
      />
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none"
            style={{ color: `color-mix(in srgb, ${accentColor} 65%, transparent)` }}
          >
            {eyebrow}
          </p>
          <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] font-mono text-text-muted/50 mt-1.5 truncate">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer mt-0.5"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}


export function KycViewDrawer({ open, onClose, rawKyc, status }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  
  // Lightbox View State
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isInverted, setIsInverted] = useState(false);

  // Keyboard accessibility for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!rawKyc) return null;

  const kycData = parseSubmittedKyc(rawKyc);
  if (!kycData) return null;

  const handleOpenPreview = (url, title) => {
    setPreviewImage(url);
    setPreviewTitle(title);
    setRotation(0);
    setZoom(1);
    setIsInverted(false);
  };

  /* ── Interactive Image Thumbnail Renderer ── */
  const DocumentPreview = ({ file, label }) => {
    const url = getImageUrl(file);
    const fileName = file?.name || (typeof file === 'string' ? file.split('/').pop() : '');

    if (url) {
      return (
        <div
          onClick={() => handleOpenPreview(url, label)}
          className="w-full group relative rounded-[10px] border border-border/25 bg-surface overflow-hidden cursor-zoom-in h-36 flex items-center justify-center transition-all hover:border-brand/45"
        >
          <SecureImage 
            src={url} 
            alt={label} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" 
          />
          <div className="absolute inset-0 bg-[#020617]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-brand px-2.5 py-1.5 rounded-[5px] shadow-md">
              View File
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-[10px] border border-border/25 bg-muted-surface/25 p-3 flex flex-col items-center justify-center text-center h-36">
        <FileText size={20} className="text-text-muted/35 mb-1.5" />
        <p className="text-[11px] font-bold text-text-muted truncate max-w-xs">{fileName || 'File Uploaded'}</p>
        <p className="text-[9px] text-text-muted/40 mt-1 uppercase tracking-wide font-black">Encrypted</p>
      </div>
    );
  };

  const addressString = [kycData.personalInfo.address, kycData.personalInfo.city, kycData.personalInfo.postalCode].filter(Boolean).join(', ');

  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[720px]">
      <DHeader
        eyebrow="Transaction Record Review"
        title="Identity Verification Review"
        subtitle="Review the personal details and document files you uploaded."
        onClose={onClose}
        accentColor="var(--brand)"
      />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        
        {/* Verification Status Summary Banner */}
        <div
          className="rounded-[14px] border p-4 flex items-center justify-between gap-4"
          style={{
            borderColor: status === 'verified' ? 'color-mix(in srgb, var(--positive) 20%, var(--border))' : 'color-mix(in srgb, var(--brand) 20%, var(--border))',
            background: status === 'verified' ? 'color-mix(in srgb, var(--positive) 4%, var(--bg))' : 'color-mix(in srgb, var(--brand) 4%, var(--bg))'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center border shrink-0"
              style={{
                background: status === 'verified' ? 'color-mix(in srgb, var(--positive) 12%, transparent)' : 'color-mix(in srgb, var(--brand) 12%, transparent)',
                borderColor: status === 'verified' ? 'color-mix(in srgb, var(--positive) 22%, transparent)' : 'color-mix(in srgb, var(--brand) 22%, transparent)',
              }}
            >
              <Clock size={18} style={{ color: status === 'verified' ? 'var(--positive)' : 'var(--brand)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: status === 'verified' ? 'var(--positive)' : 'var(--brand)' }}>
                  {status === 'verified' ? 'Verification Complete' : 'Submission Under Review'}
                </span>
              </div>
              <p className="text-[12.5px] text-text font-semibold mt-0.5 leading-none">
                {status === 'verified' ? 'All checks approved successfully' : 'Documents received and pending review'}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <DrawerSection title="Personal Information">
          <DrawerFormGrid>
            <DrawerField label="Full Name" value={kycData.personalInfo.fullName} />
            <DrawerField label="Date of Birth" value={kycData.personalInfo.dateOfBirth} />
            <DrawerField label="Email Address" value={kycData.personalInfo.email} copyable />
            <DrawerField label="Phone Number" value={kycData.personalInfo.phone} />
            <DrawerField label="Country" value={kycData.personalInfo.country} />
            <DrawerField label="Residential Address" value={addressString} wide />
          </DrawerFormGrid>
        </DrawerSection>

        {/* Document Specifications */}
        <DrawerSection title="Document Specifications">
          <DrawerFormGrid>
            <DrawerField label="ID Document Type" value={kycData.identityDocument.type?.replace('-', ' ').toUpperCase()} />
            <DrawerField label="Document Number" value={kycData.identityDocument.documentNumber} copyable />
            <DrawerField label="Expiration Date" value={kycData.identityDocument.expiryDate} />
            <DrawerField label="Issuing Country" value={kycData.identityDocument.issuingCountry} />
            <DrawerField label="Proof of Address Type" value={kycData.addressProof.type?.replace('-', ' ').toUpperCase()} />
            <DrawerField label="Proof Issue Date" value={kycData.addressProof.issueDate} />
          </DrawerFormGrid>
        </DrawerSection>

        {/* Uploaded Files Section */}
        <DrawerSection title="Uploaded Files">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70 block mb-2 text-left">
                ID Document Front
              </label>
              <DocumentPreview file={kycData.identityDocument.front} label="ID Document Front" />
            </div>
            {kycData.identityDocument.type !== 'passport' && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70 block mb-2 text-left">
                  ID Document Back
                </label>
                <DocumentPreview file={kycData.identityDocument.back} label="ID Document Back" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70 block mb-2 text-left">
                Verification Selfie
              </label>
              <DocumentPreview file={kycData.selfie} label="Selfie Verification" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.08em] text-text-muted/70 block mb-2 text-left">
                Proof of address
              </label>
              <DocumentPreview file={kycData.addressProof.file} label="Proof of Address" />
            </div>
          </div>
        </DrawerSection>

        {/* Security Notice */}
        <div className="flex items-center gap-3 rounded-[11px] border border-border/30 bg-surface p-4 text-left">
          <LockKeyhole size={14} className="text-brand shrink-0" />
          <p className="text-[11.5px] text-text-muted">
            All documents are fully encrypted and kept secure. You cannot change your details while they are being checked.
          </p>
        </div>
      </div>

      <DrawerFooter>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onClose}
            className="h-8 px-4 text-[11px] rounded-[7px] border border-border/20 bg-muted-surface text-text font-bold cursor-pointer hover:bg-surface-bright transition-all"
          >
            Close
          </button>
        </div>
      </DrawerFooter>

      {/* ── LIGHTBOX FULL SCREEN PREVIEW MODAL ── */}
      {previewImage && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <div 
            onClick={() => setPreviewImage(null)} 
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal content */}
          <div className="relative w-full max-w-4xl flex flex-col h-[85vh] z-10">
            {/* Header / Actions */}
            <div className="flex items-center justify-between bg-surface-elevated/80 backdrop-blur border border-border/25 rounded-t-[14px] px-5 py-3.5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-text-muted">Document Viewer</p>
                <h3 className="text-[14px] font-bold text-text mt-0.5">{previewTitle}</h3>
              </div>

              {/* Tools row */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-border/25 rounded-[6px] overflow-hidden bg-bg/50 px-1 py-0.5 h-8">
                  <button 
                    type="button" 
                    title="Rotate 90°" 
                    onClick={() => setRotation(r => (r + 90) % 360)}
                    className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text hover:bg-muted-surface/50 transition-colors cursor-pointer"
                  >
                    <RotateCw size={13} />
                  </button>
                  <button 
                    type="button" 
                    title="Zoom In" 
                    onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
                    className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text hover:bg-muted-surface/50 transition-colors cursor-pointer"
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button 
                    type="button" 
                    title="Zoom Out" 
                    onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
                    className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-text hover:bg-muted-surface/50 transition-colors cursor-pointer"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button 
                    type="button" 
                    title="Invert Colors" 
                    onClick={() => setIsInverted(i => !i)}
                    className={`h-7 px-2.5 rounded text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      isInverted ? 'bg-warning/20 text-warning hover:bg-warning/30' : 'text-text-muted hover:text-text hover:bg-muted-surface/50'
                    }`}
                  >
                    Invert
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-border/25 text-text-muted hover:bg-muted-surface hover:text-text transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Image viewport container */}
            <div className="flex-1 bg-black/40 border-x border-b border-border/25 rounded-b-[14px] flex items-center justify-center overflow-hidden relative">
              <SecureImage
                src={previewImage}
                alt="Document Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[70vh] object-contain transition-transform duration-250 ease-out origin-center"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  filter: isInverted ? 'invert(1) contrast(1.2)' : 'none',
                }}
              />
              
              {/* Reset zoom/rotation HUD button */}
              {(zoom !== 1 || rotation !== 0 || isInverted) && (
                <button
                  onClick={() => { setZoom(1); setRotation(0); setIsInverted(false); }}
                  className="absolute bottom-4 right-4 bg-surface-elevated/75 backdrop-blur text-text-muted hover:text-text border border-border/25 px-2.5 py-1.5 rounded-[5px] text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors shadow-lg"
                >
                  Reset View
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </MainDrawer>
  );
}

export default KycViewDrawer;
