import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { kycApi } from '../services/kyc.api';
import { addressProofSchema, identityDocumentSchema, personalInfoSchema, validateSection } from '../schemas/kyc.schema';

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
      setData((current) => {
        let phoneCode = current.personalInfo.phoneCode || '';
        let phoneVal = current.personalInfo.phone || user.phone || '';

        // If user has a phone and we haven't set a phone value or code yet, try to parse the code out
        if (user.phone && !current.personalInfo.phone) {
          const knownCodes = ['+1', '+44', '+91', '+971', '+61', '+49', '+33', '+65', '+81', '+55', '+7', '+86', '+52', '+82', '+966', '+234', '+27'];
          const matchedCode = knownCodes.find(code => user.phone.startsWith(code));
          if (matchedCode) {
            phoneCode = matchedCode;
            phoneVal = user.phone.slice(matchedCode.length).trim();
          }
        }

        return {
          ...current,
          personalInfo: {
            ...current.personalInfo,
            fullName: current.personalInfo.fullName || user.name || '',
            email: current.personalInfo.email || user.email || '',
            phone: phoneVal,
            phoneCode: phoneCode,
            country: current.personalInfo.country || user.country || '',
          },
          identityDocument: {
            ...current.identityDocument,
            issuingCountry: current.identityDocument.issuingCountry || user.country || '',
          },
        };
      });
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
    const validation = step === 1
      ? validateSection(personalInfoSchema, data.personalInfo)
      : step === 2
        ? validateSection(identityDocumentSchema, data.identityDocument)
        : step === 3 && !data.selfie
          ? { selfie: 'Complete a selfie or live capture to continue' }
          : step === 4
            ? validateSection(addressProofSchema, data.addressProof)
            : {};
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
