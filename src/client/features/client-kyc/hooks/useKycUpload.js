import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { kycApi } from '../services/kyc.api';
import { addressProofSchema, identityDocumentSchema, personalInfoSchema, validateSection, kycSubmissionSchema } from '../schemas/kyc.schema';

const defaultData = {
  personalInfo: {
    fullName: '', dateOfBirth: '', email: '', phone: '',
    country: '', address: '', city: '', postalCode: '', phoneCode: '',
  },
  identityDocument: { type: 'passport', documentNumber: '', expiryDate: '', issuingCountry: '', front: null, back: null },
  selfie: null,
  addressProof: { type: 'utility-bill', issueDate: '', file: null },
  declaration: false,
};

export function useKycUpload() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize data from localStorage draft if present
  const [data, setData] = useState(() => {
    try {
      const draft = localStorage.getItem('kyc_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        // Ensure files are null since they cannot be stored as JSON
        if (parsed.identityDocument) {
          parsed.identityDocument.front = null;
          parsed.identityDocument.back = null;
        }
        if (parsed.addressProof) {
          parsed.addressProof.file = null;
        }
        parsed.selfie = null;
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to restore KYC draft:', e);
    }
    return defaultData;
  });

  // Prefill registration info from logged-in user profile
  useEffect(() => {
    if (user) {
      setData((current) => ({
        ...current,
        personalInfo: {
          ...current.personalInfo,
          fullName: current.personalInfo.fullName || user.name || '',
          email: current.personalInfo.email || user.email || '',
          country: current.personalInfo.country || user.country || '',
          phone: current.personalInfo.phone || user.phone || '',
        },
      }));
    }
  }, [user]);

  const updateSection = (section, value) => setData((current) => ({
    ...current,
    [section]: typeof value === 'function' ? value(current[section]) : value,
  }));

  const completedSteps = useMemo(() => {
    const info = data.personalInfo;
    const isPersonalInfoDone = Boolean(
      info.fullName && info.dateOfBirth && info.email && info.phone &&
      info.country && info.address && info.city && info.postalCode
    );

    const isIdDocumentDone = Boolean(
      data.identityDocument.front &&
      data.identityDocument.documentNumber &&
      data.identityDocument.expiryDate &&
      data.identityDocument.issuingCountry &&
      (data.identityDocument.type === 'passport' || data.identityDocument.back)
    );

    return [
      isPersonalInfoDone,
      isIdDocumentDone,
      Boolean(data.selfie),
      Boolean(data.addressProof.file && data.addressProof.issueDate),
      false,
      submitted,
    ];
  }, [data, submitted]);

  const validateCurrent = () => {
    let validation = {};
    if (step === 1) {
      const sectErrors = validateSection(personalInfoSchema, data.personalInfo);
      if (Object.keys(sectErrors).length > 0) {
        validation = { personalInfo: sectErrors };
      }
    } else if (step === 2) {
      const sectErrors = validateSection(identityDocumentSchema, data.identityDocument);
      if (Object.keys(sectErrors).length > 0) {
        validation = { identityDocument: sectErrors };
      }
    } else if (step === 3) {
      if (!data.selfie) {
        validation = { selfie: 'Complete a selfie or live capture to continue' };
      }
    } else if (step === 4) {
      const sectErrors = validateSection(addressProofSchema, data.addressProof);
      if (Object.keys(sectErrors).length > 0) {
        validation = { addressProof: sectErrors };
      }
    }
    
    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const next = async () => {
    if (!validateCurrent()) return false;
    setSaving(true);
    await kycApi.saveDraft(data);
    setSaving(false);
    setStep((value) => Math.min(value + 1, 6));
    return true;
  };

  const submit = async () => {
    if (!data.declaration) {
      setErrors({ declaration: 'Accept the declaration before submitting' });
      return false;
    }

    const result = kycSubmissionSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path;
        if (path.length === 1) {
          formattedErrors[path[0]] = issue.message;
        } else if (path.length === 2) {
          if (!formattedErrors[path[0]]) {
            formattedErrors[path[0]] = {};
          }
          formattedErrors[path[0]][path[1]] = issue.message;
        }
      });
      setErrors({
        ...formattedErrors,
        submit: 'Please complete all preceding steps and correct all errors before submitting.'
      });
      return false;
    }

    setSaving(true);
    try {
      await kycApi.submit(data);
      setSaving(false);
      setSubmitted(true);
      setStep(6);
      return true;
    } catch (err) {
      setSaving(false);
      setErrors({ submit: err.message || 'Failed to submit KYC data. Please try again.' });
      return false;
    }
  };

  return {
    step,
    setStep,
    data,
    updateSection,
    errors,
    setErrors,
    saving,
    submitted,
    completedSteps,
    next,
    submit,
    validationErrors: errors,
  };
}
