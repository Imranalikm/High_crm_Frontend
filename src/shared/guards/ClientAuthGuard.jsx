import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useKyc } from '@/client/features/client-kyc/hooks/useKyc';
import { ShieldAlert, ArrowRight, Clock } from 'lucide-react';

export function ClientAuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { overview, loading } = useKyc();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin trying to access client portal → redirect to their portal
  if (user?.portalType !== 'client') {
    return <Navigate to="/admin" replace />;
  }

  // If we are currently loading the KYC status, show a loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: '#6366f1',
          animation: 'authSpin 0.8s linear infinite',
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes authSpin {
            to { transform: rotate(360deg); }
          }
        `}} />
        <p className="text-[12.5px] text-text-muted mt-4">Validating verification status...</p>
      </div>
    );
  }

  // TEMPORARILY DISABLED: Allow access to all pages without KYC verification block
  return children;

  // Otherwise, render layout blurred in the background and show the lock modal overlay
  return (
    <div style={{ position: 'relative' }}>
      {/* Blurred background content */}
      <div style={{ filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Lock Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Modal Container */}
        <div style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: 'rgba(10, 16, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '30px 24px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'modalFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes modalFadeUp {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />

          {/* Modal Icon */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: kycStatus === 'pending' || kycStatus === 'under-review' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            {kycStatus === 'pending' || kycStatus === 'under-review' ? (
              <Clock size={28} style={{ color: '#818cf8' }} />
            ) : (
              <ShieldAlert size={28} style={{ color: '#f87171' }} />
            )}
          </div>

          {/* Modal Title */}
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '10px'
          }}>
            {kycStatus === 'pending' || kycStatus === 'under-review' 
              ? 'Verification In Progress' 
              : 'Identity Verification Required'}
          </h2>

          {/* Modal Body */}
          <p style={{
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.6,
            marginBottom: '26px'
          }}>
            {kycStatus === 'pending' || kycStatus === 'under-review'
              ? 'Your identity documents are under review. All features (Trading, Deposits, and Withdrawals) will remain locked until your verification is approved by compliance.'
              : 'To comply with financial regulations and secure your account, you must verify your identity. All portal features will remain locked until KYC approval.'}
          </p>

          {/* Modal Button */}
          <button
            onClick={() => navigate('/client/kyc')}
            style={{
              width: '100%',
              height: '42px',
              backgroundColor: '#a2c1f5',
              color: '#0a1e3f',
              borderRadius: '12px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'opacity 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            {kycStatus === 'pending' || kycStatus === 'under-review'
              ? 'View Verification Status'
              : 'Verify Identity Now'} 
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
