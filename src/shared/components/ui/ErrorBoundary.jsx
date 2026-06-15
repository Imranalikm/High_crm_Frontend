import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Home, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-[500px] w-full bg-surface-elevated border border-border/40 rounded-[12px] p-8 shadow-2xl relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-negative/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-negative/10 transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 rounded-[12px] bg-negative/10 border border-negative/20 flex items-center justify-center text-negative mb-6 shadow-glow-primary">
            <AlertOctagon size={32} strokeWidth={2.5} />
          </div>

          {/* Error Message */}
          <h2 className="font-heading font-black text-2xl text-text tracking-tighter mb-2">
            System Interruption Detected
          </h2>
          <p className="text-[14px] text-text-muted mb-8 leading-relaxed">
            The application encountered an unexpected state and was unable to complete the request. 
            Detailed technical logs have been captured for administrative review.
          </p>

          {/* Technical Snippet (Optional/Debug) */}
          <div className="w-full bg-bg/50 border border-white/5 rounded-[8px] p-4 mb-8 text-left">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">
              <RefreshCw size={10} strokeWidth={3} /> Runtime Trace
            </div>
            <code className="text-[11px] font-mono text-negative/80 break-all leading-tight">
              {error?.statusText || error?.message || 'Unknown Reference Error'}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={() => window.location.reload()}
              icon={RefreshCw}
            >
              Restart Module
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={() => navigate('/')}
              icon={Home}
            >
              Return Home
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/30">
          <span>Error ID: ROUTE-500</span>
          <span className="flex items-center gap-1">Status 500 <ChevronRight size={8} strokeWidth={4} /> Restricted</span>
        </div>
      </div>
    </div>
  );
}
