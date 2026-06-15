import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';

// Simple deep equality checker helper
function isDeepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

const pathToSection = {
  '/settings/overview': 'overview',
  '/settings/api': 'api',
  '/settings/payment-gateway': 'gateways',
  '/settings/kyc': 'kyc',
  '/settings/trading': 'trading',
  '/settings/notifications': 'notifications',
  '/settings/system': 'system',
};

const sectionToPath = {
  'overview': '/settings/overview',
  'api': '/settings/api',
  'gateways': '/settings/payment-gateway',
  'kyc': '/settings/kyc',
  'trading': '/settings/trading',
  'notifications': '/settings/notifications',
  'system': '/settings/system',
};

export function usePlatformSettingsWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    apiConfig: savedApiConfig,
    updateApiConfig,
    gateways: savedGateways,
    updateGateways,
    globalFees: savedGlobalFees,
    updateGlobalFees,
    kycConfig: savedKycConfig,
    updateKycConfig,
    tradingConfig: savedTradingConfig,
    updateTradingConfig,
    notificationConfig: savedNotificationConfig,
    updateNotificationConfig,
    systemConfig: savedSystemConfig,
    updateSystemConfig,
  } = usePlatformSettings();

  // Normalize path by stripping /admin prefix if present
  const cleanPath = location.pathname.replace(/^\/admin/, '');
  // Active section derived from URL path (single source of truth)
  const section = pathToSection[cleanPath] || 'overview';

  // Form states (initialized with saved settings)
  const [apiConfig, setApiConfig] = useState(savedApiConfig);
  const [gateways, setGateways] = useState(savedGateways);
  const [globalFees, setGlobalFees] = useState(savedGlobalFees);
  const [kycConfig, setKycConfigState] = useState(savedKycConfig);
  const [tradingConfig, setTradingConfig] = useState(savedTradingConfig);
  const [notificationConfig, setNotificationConfig] = useState(savedNotificationConfig);
  const [systemConfig, setSystemConfig] = useState(savedSystemConfig);

  // Wrapper setSection to navigate between routes when clicked
  const setSection = useCallback((newSection) => {
    const targetPath = sectionToPath[newSection];
    if (targetPath) {
      // Prepend /admin prefix if current route is hosted under /admin
      const hasAdmin = location.pathname.startsWith('/admin');
      const navigatedPath = hasAdmin ? `/admin${targetPath}` : targetPath;
      if (location.pathname !== navigatedPath) {
        navigate(navigatedPath);
      }
    }
  }, [navigate, location.pathname]);

  // Update primitive field helper
  const updateField = useCallback((configSetter, key, value) => {
    configSetter(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update nested field helper
  const updateNestedField = useCallback((configSetter, parentKey, childKey, value) => {
    configSetter(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  }, []);

  // Section level Dirty States tracking using deep equality
  const isDirty = useCallback((sect) => {
    switch (sect) {
      case 'api':
        return !isDeepEqual(apiConfig, savedApiConfig);
      case 'gateways':
        return !isDeepEqual(gateways, savedGateways) || !isDeepEqual(globalFees, savedGlobalFees);
      case 'kyc':
        return !isDeepEqual(kycConfig, savedKycConfig);
      case 'trading':
        return !isDeepEqual(tradingConfig, savedTradingConfig);
      case 'notifications':
        return !isDeepEqual(notificationConfig, savedNotificationConfig);
      case 'system':
        return !isDeepEqual(systemConfig, savedSystemConfig);
      default:
        return false;
    }
  }, [apiConfig, gateways, globalFees, kycConfig, tradingConfig, notificationConfig, systemConfig, savedApiConfig, savedGateways, savedGlobalFees, savedKycConfig, savedTradingConfig, savedNotificationConfig, savedSystemConfig]);

  // Save changes handler (Mocking API commit and updating context)
  const saveSection = useCallback(async (sect) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // standard save delay
    console.log(`[Platform Settings] Saved config for section: ${sect}`);
    switch (sect) {
      case 'api':
        updateApiConfig(apiConfig);
        break;
      case 'gateways':
        updateGateways(gateways);
        updateGlobalFees(globalFees);
        break;
      case 'kyc':
        updateKycConfig(kycConfig);
        break;
      case 'trading':
        updateTradingConfig(tradingConfig);
        break;
      case 'notifications':
        updateNotificationConfig(notificationConfig);
        break;
      case 'system':
        updateSystemConfig(systemConfig);
        break;
      default:
        break;
    }
  }, [apiConfig, gateways, globalFees, kycConfig, tradingConfig, notificationConfig, systemConfig, updateApiConfig, updateGateways, updateGlobalFees, updateKycConfig, updateTradingConfig, updateNotificationConfig, updateSystemConfig]);

  // Reset section back to initial config defaults
  const resetSection = useCallback((sect) => {
    switch (sect) {
      case 'api':
        setApiConfig(savedApiConfig);
        break;
      case 'gateways':
        setGateways(savedGateways);
        setGlobalFees(savedGlobalFees);
        break;
      case 'kyc':
        setKycConfigState(savedKycConfig);
        break;
      case 'trading':
        setTradingConfig(savedTradingConfig);
        break;
      case 'notifications':
        setNotificationConfig(savedNotificationConfig);
        break;
      case 'system':
        setSystemConfig(savedSystemConfig);
        break;
      default:
        break;
    }
  }, [savedApiConfig, savedGateways, savedGlobalFees, savedKycConfig, savedTradingConfig, savedNotificationConfig, savedSystemConfig]);

  return {
    section,
    setSection,
    apiConfig,
    updateApiField: (k, v) => updateField(setApiConfig, k, v),
    gateways,
    setGateways,
    globalFees,
    updateGlobalFeesField: (k, v) => updateField(setGlobalFees, k, v),
    kycConfig,
    updateKycField: (k, v) => updateField(setKycConfigState, k, v),
    updateKycNestedField: (p, c, v) => updateNestedField(setKycConfigState, p, c, v),
    tradingConfig,
    updateTradingField: (k, v) => updateField(setTradingConfig, k, v),
    notificationConfig,
    updateNotificationField: (k, v) => updateField(setNotificationConfig, k, v),
    updateNotificationNestedField: (p, c, v) => updateNestedField(setNotificationConfig, p, c, v),
    systemConfig,
    updateSystemField: (k, v) => updateField(setSystemConfig, k, v),
    isDirty: isDirty(section),
    saveCurrentSection: () => saveSection(section),
    resetCurrentSection: () => resetSection(section),
  };
}

export default usePlatformSettingsWorkspace;
