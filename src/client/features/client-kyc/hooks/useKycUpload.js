import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { kycApi } from '../services/kyc.api';
import { addressProofSchema, identityDocumentSchema, personalInfoSchema, validateSection, kycSubmissionSchema } from '../schemas/kyc.schema';

import { COUNTRIES as GLOBAL_COUNTRIES } from '@/shared/config/constants/COUNTRIES';

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

// Helper to parse phone number into dial code prefix and remainder
function parsePhone(rawPhone) {
  if (!rawPhone) return { phoneCode: '', phone: '' };
  
  const cleaned = rawPhone.trim();
  
  // Sort dial codes by length descending (e.g. +1268 before +1) to avoid partial prefix matching
  const sortedCodes = [...GLOBAL_COUNTRIES]
    .map(c => c.dialCode)
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i)
    .sort((a, b) => b.length - a.length);

  for (const code of sortedCodes) {
    if (cleaned.startsWith(code)) {
      return {
        phoneCode: code,
        phone: cleaned.slice(code.length).trim()
      };
    }
  }

  return {
    phoneCode: '',
    phone: cleaned
  };
}

export function useKycUpload() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize data
  const [data, setData] = useState(defaultData);

  // Load draft and prefill registration info / database KYC details when user changes
  useEffect(() => {
    if (user && user.id) {
      const loadKyc = async () => {
        let loadedData = { ...defaultData };
        
        // 1. Try to load from database first (for edit/resubmission support)
        try {
          const overview = await kycApi.getOverview();
          if (overview && overview.kycData) {
            const dbKyc = overview.kycData;
            const parsedPhone = parsePhone(dbKyc.phone);
            loadedData = {
              personalInfo: {
                fullName: dbKyc.fullName || '',
                dateOfBirth: dbKyc.dateOfBirth || '',
                email: dbKyc.email || '',
                phone: parsedPhone.phone,
                country: dbKyc.country || '',
                address: dbKyc.streetAddress || '',
                city: dbKyc.city || '',
                postalCode: dbKyc.postalCode || '',
                phoneCode: parsedPhone.phoneCode,
              },
              identityDocument: {
                type: dbKyc.idDocType === 'national_id' ? 'national-id' 
                      : dbKyc.idDocType === 'driving_license' ? 'driving-license' 
                      : dbKyc.idDocType || 'passport',
                documentNumber: dbKyc.idDocNumber || '',
                expiryDate: dbKyc.idExpiryDate || '',
                issuingCountry: dbKyc.idCountryOfIssue || '',
                front: dbKyc.idFrontImage ? { name: 'Front Document (uploaded)', fromDb: true } : null,
                back: dbKyc.idBackImage ? { name: 'Back Document (uploaded)', fromDb: true } : null,
              },
              selfie: dbKyc.selfieImage ? { name: 'Selfie Image (captured)', fromDb: true } : null,
              addressProof: {
                type: dbKyc.addressDocType === 'utility_bill' ? 'utility-bill' 
                      : dbKyc.addressDocType === 'bank_statement' ? 'bank-statement' 
                      : dbKyc.addressDocType === 'rent_agreement' ? 'rent-agreement' 
                      : dbKyc.addressDocType || 'utility-bill',
                issueDate: dbKyc.addressDocIssueDate || '',
                file: dbKyc.addressDocImage ? { name: 'Address Proof Document (uploaded)', fromDb: true } : null,
              },
              declaration: false,
            };
          }
        } catch (e) {
          console.warn('Failed to fetch existing KYC from DB for prefill:', e);
        }

        // 2. Override with local draft if present
        try {
          const draft = localStorage.getItem(`kyc_draft_${user.id}`);
          if (draft) {
            const parsed = JSON.parse(draft);
            if (parsed.identityDocument) {
              parsed.identityDocument.front = null;
              parsed.identityDocument.back = null;
            }
            if (parsed.addressProof) {
              parsed.addressProof.file = null;
            }
            parsed.selfie = null;
            loadedData = { ...loadedData, ...parsed };
          }
        } catch (e) {
          console.warn('Failed to restore KYC draft:', e);
        }

        // 3. Fallback to registration profile info
        const parsedProfilePhone = parsePhone(user.phone);
        setData({
          ...loadedData,
          personalInfo: {
            ...loadedData.personalInfo,
            fullName: loadedData.personalInfo.fullName || user.name || '',
            email: loadedData.personalInfo.email || user.email || '',
            country: loadedData.personalInfo.country || user.country || '',
            phoneCode: loadedData.personalInfo.phoneCode || parsedProfilePhone.phoneCode || '',
            phone: loadedData.personalInfo.phone || parsedProfilePhone.phone || '',
          },
        });
      };
      
      loadKyc();
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
    await kycApi.saveDraft(data, user?.id);
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
      await kycApi.submit(data, user?.id);
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
