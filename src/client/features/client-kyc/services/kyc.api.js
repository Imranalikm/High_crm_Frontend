import { apiClient } from '@/shared/api/client/apiClient';

export const kycApi = {
  async getOverview() {
    try {
      const response = await apiClient.get('/panel/kyc');
      const kyc = response?.data?.kyc || response?.kyc || response;
      return {
        status: kyc?.status?.toLowerCase() || 'not-started',
        level: kyc?.level || 'Basic',
        progress: kyc?.progress ?? 0,
        estimatedReviewTime: kyc?.estimatedReviewTime || '',
        nextStep: kyc?.nextStep || '',
        reference: kyc?.reference || '',
        kycData: kyc,
      };
    } catch (error) {
      console.warn('Failed to fetch real KYC status, falling back to local state:', error);
      
      // Check if there is local cached submitted state
      const submittedKyc = localStorage.getItem('submitted_kyc');
      if (submittedKyc) {
        try {
          const parsed = JSON.parse(submittedKyc);
          const cachedData = localStorage.getItem('submitted_kyc_data');
          if (cachedData) {
            parsed.kycData = JSON.parse(cachedData);
          }
          return parsed;
        } catch (e) {
          console.error('Failed to parse cached kyc overview', e);
        }
      }
      
      // Default initial status
      return {
        status: 'not-started',
        level: 'Basic',
        progress: 0,
        estimatedReviewTime: '',
        nextStep: '',
        reference: '',
      };
    }
  },

  async getHistory() {
    try {
      const response = await apiClient.get('/panel/kyc/history');
      return response?.history || response || [];
    } catch (error) {
      console.warn('Failed to fetch KYC history, returning empty history list:', error);
      return [];
    }
  },

  async saveDraft(payload) {
    if (!payload) return { savedAt: new Date().toISOString(), payload };
    
    // Strip file binaries to avoid serialization errors
    const draftToSave = {
      ...payload,
      identityDocument: {
        ...(payload.identityDocument || {}),
        front: null,
        back: null,
      },
      addressProof: {
        ...(payload.addressProof || {}),
        file: null,
      },
      selfie: null,
    };
    
    try {
      localStorage.setItem('kyc_draft', JSON.stringify(draftToSave));
    } catch (e) {
      console.error('Failed to save KYC draft to localStorage', e);
    }
    
    return { savedAt: new Date().toISOString(), payload };
  },

  async submit(payload) {
    const formData = new FormData();
    
    // ── Personal Info ──
    if (payload.personalInfo?.fullName) {
      formData.append('fullName', payload.personalInfo.fullName.trim());
    }
    if (payload.personalInfo?.dateOfBirth) {
      formData.append('dateOfBirth', payload.personalInfo.dateOfBirth);
    }
    if (payload.personalInfo?.country) {
      formData.append('country', payload.personalInfo.country);
    }
    if (payload.personalInfo?.email) {
      formData.append('email', payload.personalInfo.email.trim());
    }
    
    // Combine phone code and phone number if phoneCode is present
    const phoneCode = payload.personalInfo?.phoneCode || '';
    const phoneNum = payload.personalInfo?.phone || '';
    const fullPhone = phoneCode && phoneNum ? `${phoneCode}${phoneNum}` : phoneNum;
    if (fullPhone) {
      formData.append('phone', fullPhone.trim());
    }
    
    if (payload.personalInfo?.address) {
      formData.append('streetAddress', payload.personalInfo.address.trim());
    }
    if (payload.personalInfo?.city) {
      formData.append('city', payload.personalInfo.city.trim());
    }
    if (payload.personalInfo?.postalCode) {
      formData.append('postalCode', payload.personalInfo.postalCode.trim());
    }
    
    // ── Identity Document ──
    const idDocType = payload.identityDocument?.type;
    let mappedIdDocType = idDocType;
    if (idDocType === 'national-id') {
      mappedIdDocType = 'national_id';
    } else if (idDocType === 'driving-license') {
      mappedIdDocType = 'driving_license';
    }
    if (mappedIdDocType) {
      formData.append('idDocType', mappedIdDocType);
    }
    
    if (payload.identityDocument?.documentNumber) {
      formData.append('idDocNumber', payload.identityDocument.documentNumber.trim());
    }
    if (payload.identityDocument?.expiryDate) {
      formData.append('idExpiryDate', payload.identityDocument.expiryDate);
    }
    if (payload.identityDocument?.issuingCountry) {
      formData.append('idCountryOfIssue', payload.identityDocument.issuingCountry);
    }
    
    if (payload.identityDocument?.front) {
      formData.append('idFrontImage', payload.identityDocument.front);
    }
    if (payload.identityDocument?.back) {
      formData.append('idBackImage', payload.identityDocument.back);
    }
    
    // ── Selfie ──
    if (payload.selfie) {
      formData.append('selfieImage', payload.selfie);
    }
    
    // ── Address Proof ──
    const addressDocType = payload.addressProof?.type;
    let mappedAddressDocType = addressDocType;
    if (addressDocType === 'utility-bill') {
      mappedAddressDocType = 'utility_bill';
    } else if (addressDocType === 'bank-statement') {
      mappedAddressDocType = 'bank_statement';
    } else if (addressDocType === 'rent-agreement') {
      mappedAddressDocType = 'rent_agreement';
    }
    if (mappedAddressDocType) {
      formData.append('addressDocType', mappedAddressDocType);
    }
    
    if (payload.addressProof?.file) {
      formData.append('addressDocImage', payload.addressProof.file);
    }
    if (payload.addressProof?.issueDate) {
      formData.append('addressDocIssueDate', payload.addressProof.issueDate);
    }
    
    // Call POST API
    const response = await apiClient.post('/panel/kyc', formData);
    
    // Clear draft local storage after successful submit
    localStorage.removeItem('kyc_draft');
    
    // Cache the submitted state locally so status updates immediately
    const submittedOverview = {
      status: 'pending',
      level: 'Basic',
      progress: 100,
      estimatedReviewTime: response?.estimatedReviewTime || '',
      nextStep: 'Awaiting review',
      reference: response?.reference || `KYC-LT-${Date.now().toString().slice(-5)}`,
    };
    
    // Cache the serialized payload (without raw file objects)
    const payloadToCache = {
      ...payload,
      identityDocument: {
        ...(payload.identityDocument || {}),
        front: payload.identityDocument?.front ? { name: payload.identityDocument.front.name, type: payload.identityDocument.front.type } : null,
        back: payload.identityDocument?.back ? { name: payload.identityDocument.back.name, type: payload.identityDocument.back.type } : null,
      },
      addressProof: {
        ...(payload.addressProof || {}),
        file: payload.addressProof?.file ? { name: payload.addressProof.file.name, type: payload.addressProof.file.type } : null,
      },
      selfie: payload.selfie ? { name: payload.selfie.name, type: payload.selfie.type } : null,
    };

    try {
      localStorage.setItem('submitted_kyc', JSON.stringify(submittedOverview));
      localStorage.setItem('submitted_kyc_data', JSON.stringify(payloadToCache));
    } catch (e) {
      console.error(e);
    }
    
    return response;
  },
};
