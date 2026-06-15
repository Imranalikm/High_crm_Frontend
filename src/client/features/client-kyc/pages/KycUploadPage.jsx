import React, { useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, LockKeyhole,
  Save, Send, ShieldCheck, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KycProgressStepper } from '../components/KycProgressStepper';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { DocumentUploadCard } from '../components/DocumentUploadCard';
import { SelfieCaptureCard } from '../components/SelfieCaptureCard';
import { AddressProofUpload } from '../components/AddressProofUpload';
import { ReviewSummary } from '../components/ReviewSummary';
import { KycHelpBox } from '../components/KycHelpBox';
import { useKycUpload } from '../hooks/useKycUpload';

const STEPS = [
  {
    label: 'Personal info',
    desc: 'Enter your details exactly as shown on your official ID.',
  },
  {
    label: 'Identity document',
    desc: 'Upload a clear photo of your passport, ID card, or driver\'s license.',
  },
  {
    label: 'Face verification',
    desc: 'Take a quick selfie to confirm your identity.',
  },
  {
    label: 'Proof of address',
    desc: 'Upload a utility bill or bank statement showing your address.',
  },
  {
    label: 'Review & submit',
    desc: 'Make sure all details are correct before submitting.',
  },
];

export function KycUploadPage() {
  const navigate = useNavigate();
  const {
    step, setStep,
    data, updateSection,
    errors, saving, submitted,
    completedSteps,
    next, submit,
    validationErrors,
  } = useKycUpload();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const isLastStep = step === 5;
  const hasErrors = validationErrors && Object.keys(validationErrors).length > 0;
  const doneCount = (completedSteps ?? []).filter(Boolean).length;

  /* ── Step content ── */
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm
            value={data.personalInfo}
            onChange={(v) => updateSection('personalInfo', v)}
            errors={errors.personalInfo ?? {}}
          />
        );
      case 2:
        return (
          <DocumentUploadCard
            value={data.identityDocument}
            onChange={(v) => updateSection('identityDocument', v)}
            errors={errors.identityDocument ?? {}}
          />
        );
      case 3:
        return (
          <SelfieCaptureCard
            value={data.selfie}
            onChange={(v) => updateSection('selfie', v)}
            error={errors.selfie}
          />
        );
      case 4:
        return (
          <AddressProofUpload
            value={data.addressProof}
            onChange={(v) => updateSection('addressProof', v)}
            errors={errors.addressProof ?? {}}
          />
        );
      case 5:
        return (
          <ReviewSummary
            data={data}
            errors={errors}
            onEdit={(s) => setStep(s)}
            onDeclaration={(checked) => updateSection('declaration', checked)}
          />
        );
      default:
        return null;
    }
  };

  /* ── Submitted success screen ── */
  if (submitted || step === 6) {
    return (
      <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-positive/12 flex items-center justify-center mb-6">
          <ShieldCheck size={36} className="text-positive" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.13em] text-positive mb-2">
          Done!
        </span>
        <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] text-text mt-1 mb-3">
          Sent successfully
        </h1>
        <p className="text-[13px] text-text-muted leading-relaxed max-w-sm mb-8">
          We are checking your documents. This usually takes 1 to 3 business days. We will email you once we are done.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/client/kyc/status')}
            className="h-11 px-5 rounded-[10px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            View status <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('/client/kyc')}
            className="h-11 px-5 rounded-[10px] border border-border/40 bg-surface-elevated text-[12.5px] font-bold flex items-center justify-center gap-2 hover:bg-muted-surface/50 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2.5 text-[11px] text-text-muted">
          <LockKeyhole size={12} className="text-brand" />
          Your files are locked while we check them.
        </div>
      </div>
    );
  }

  /* ── Main upload flow ── */
  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted">
            Verify identity
          </p>
          <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-0.5">
            Verify your identity
          </h1>
          <p className="text-[13px] text-text-muted mt-1">
            Your progress is saved automatically as you go.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10.5px] font-bold text-positive shrink-0">
          <LockKeyhole size={12} /> Secure connection
        </div>
      </div>

      {/* ── Progress stepper ── */}
      <KycProgressStepper
        current={step}
        completed={completedSteps ?? []}
        onSelect={(target) => setStep(target)}
      />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_270px] gap-5 items-start">

        {/* ── Content card ── */}
        <div className="rounded-[16px] border border-border/35 bg-surface-elevated shadow-card-subtle overflow-hidden">

          {/* Step header */}
          <div className="p-5 md:p-6 border-b border-border/25">
            <span className="text-[10px] font-black uppercase tracking-[0.13em] text-brand">
              Step {step} of 5
            </span>
            <h2 className="font-heading font-semibold text-[18px] text-text mt-1.5">
              {STEPS[step - 1].label}
            </h2>
            <p className="text-[12.5px] text-text-muted mt-1 leading-relaxed">
              {STEPS[step - 1].desc}
            </p>
          </div>

          {/* Step content */}
          <div className="p-5 md:p-6">
            {renderContent()}
          </div>

          {/* Validation error banner */}
          {hasErrors && (
            <div className="mx-5 md:mx-6 mb-4 rounded-[10px] bg-negative/[0.08] border border-negative/25 p-3.5 flex items-start gap-2.5">
              <AlertCircle size={14} className="text-negative shrink-0 mt-0.5" />
              <span className="text-[11.5px] text-negative">
                {errors.submit || 'Please fix the highlighted fields before continuing.'}
              </span>
            </div>
          )}

          {/* Bottom nav bar */}
          <div className="px-5 md:px-6 py-4 border-t border-border/25 bg-surface-elevated flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="w-full sm:w-auto h-10 px-4 rounded-[9px] border border-border/40 text-[11.5px] font-bold disabled:opacity-30 flex items-center justify-center gap-2 hover:bg-muted-surface/50 transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className={`flex items-center gap-1.5 text-[10.5px] transition-opacity ${saving ? 'opacity-100' : 'opacity-45'}`}>
                <Save size={11} className="text-text-muted" />
                <span className="text-text-muted">
                  {saving ? 'Saving progress…' : 'Progress saved'}
                </span>
              </span>
              <button
                type="button"
                disabled={saving}
                onClick={isLastStep ? submit : next}
                className="w-full sm:w-auto h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[11.5px] font-bold flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
              >
                {isLastStep
                  ? <><Send size={13} /> Submit</>
                  : <>Save and continue <ArrowRight size={13} /></>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <KycHelpBox />

          <div className="rounded-[12px] border border-brand/20 bg-brand/[0.06] p-4">
            <p className="text-[11.5px] font-bold text-brand mb-1">Why we ask this</p>
            <p className="text-[10.5px] text-text-muted leading-relaxed">
              This keeps your account safe and helps us follow local trading laws.
            </p>
          </div>

          {doneCount > 0 && (
            <div className="rounded-[12px] border border-positive/20 bg-positive/[0.05] p-4 flex items-center gap-2.5">
              <CheckCircle2 size={13} className="text-positive shrink-0" />
              <p className="text-[10.5px] text-positive font-bold leading-relaxed">
                {doneCount} step{doneCount !== 1 ? 's' : ''} completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KycUploadPage;