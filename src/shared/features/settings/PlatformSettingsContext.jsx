/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { INITIAL_API_CONFIG } from '@/admin/features/settings/configs/api.config';
import { INITIAL_GATEWAYS, INITIAL_GLOBAL_FEES } from '@/admin/features/settings/configs/payment.config';
import { INITIAL_KYC_CONFIG } from '@/admin/features/settings/configs/kyc.config';
import { INITIAL_TRADING_CONFIG } from '@/admin/features/settings/configs/trading.config';
import { INITIAL_NOTIFICATION_CONFIG } from '@/admin/features/settings/configs/notification.config';
import { INITIAL_SYSTEM_CONFIG } from '@/admin/features/settings/configs/system.config';
import { apiClient } from '@/shared/api/client/apiClient';
import { useAuth } from '@/auth/AuthContext';

const PlatformSettingsContext = createContext(null);

const STORAGE_KEYS = {
  api: 'livetrader_settings_api',
  gateways: 'livetrader_settings_gateways',
  globalFees: 'livetrader_settings_global_fees',
  kyc: 'livetrader_settings_kyc',
  trading: 'livetrader_settings_trading',
  notifications: 'livetrader_settings_notifications',
  system: 'livetrader_settings_system',
};

// Safe initializer helper
function getStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage`, e);
    return fallback;
  }
}

export function PlatformSettingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [apiConfig, setApiConfigState] = useState(() => getStoredValue(STORAGE_KEYS.api, INITIAL_API_CONFIG));
  const [gateways, setGatewaysState] = useState(() => getStoredValue(STORAGE_KEYS.gateways, INITIAL_GATEWAYS));
  const [globalFees, setGlobalFeesState] = useState(() => getStoredValue(STORAGE_KEYS.globalFees, INITIAL_GLOBAL_FEES));
  const [kycConfig, setKycConfigState] = useState(() => getStoredValue(STORAGE_KEYS.kyc, INITIAL_KYC_CONFIG));
  const [tradingConfig, setTradingConfigState] = useState(() => getStoredValue(STORAGE_KEYS.trading, INITIAL_TRADING_CONFIG));
  const [notificationConfig, setNotificationConfigState] = useState(INITIAL_NOTIFICATION_CONFIG);
  const [systemConfig, setSystemConfigState] = useState(() => getStoredValue(STORAGE_KEYS.system, INITIAL_SYSTEM_CONFIG));
  const [templates, setTemplates] = useState([]);

  // Sync to localStorage
  const saveToStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error writing key ${key} to localStorage`, e);
    }
  }, []);

  // Fetch settings from API
  const fetchNotificationConfig = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/config');
      if (response && response.success) {
        setNotificationConfigState(response.data);
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to load notification settings', err);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/templates');
      if (response && response.success) {
        setTemplates(response.data);
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to load notification templates', err);
    }
  }, []);

  // Automatically fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotificationConfig();
      fetchTemplates();
    }
  }, [isAuthenticated, fetchNotificationConfig, fetchTemplates]);

  const updateApiConfig = useCallback((newConfig) => {
    setApiConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.api, newConfig);
  }, [saveToStorage]);

  const updateGateways = useCallback((newGateways) => {
    setGatewaysState(newGateways);
    saveToStorage(STORAGE_KEYS.gateways, newGateways);
  }, [saveToStorage]);

  const updateGlobalFees = useCallback((newFees) => {
    setGlobalFeesState(newFees);
    saveToStorage(STORAGE_KEYS.globalFees, newFees);
  }, [saveToStorage]);

  const updateKycConfig = useCallback((newConfig) => {
    setKycConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.kyc, newConfig);
  }, [saveToStorage]);

  const updateTradingConfig = useCallback((newConfig) => {
    setTradingConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.trading, newConfig);
  }, [saveToStorage]);

  const updateNotificationConfig = useCallback(async (newConfig) => {
    try {
      const response = await apiClient.put('/notifications/config', newConfig);
      if (response && response.success) {
        setNotificationConfigState(response.data);
        return response.data;
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to update notification settings', err);
      throw err;
    }
  }, []);

  const updateSystemConfig = useCallback((newConfig) => {
    setSystemConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.system, newConfig);
  }, [saveToStorage]);

  // Templates CRUD handlers
  const createTemplate = useCallback(async (templateData) => {
    try {
      const response = await apiClient.post('/notifications/templates', templateData);
      if (response && response.success) {
        setTemplates(prev => [...prev, response.data].sort((a, b) => a.name.localeCompare(b.name)));
        return response.data;
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to create template', err);
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (id, templateData) => {
    try {
      const response = await apiClient.put(`/notifications/templates/${id}`, templateData);
      if (response && response.success) {
        setTemplates(prev => prev.map(t => t.id === id ? response.data : t).sort((a, b) => a.name.localeCompare(b.name)));
        return response.data;
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to update template', err);
      throw err;
    }
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    try {
      const response = await apiClient.delete(`/notifications/templates/${id}`);
      if (response && response.success) {
        setTemplates(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('[PlatformSettingsContext] Failed to delete template', err);
      throw err;
    }
  }, []);

  // Read-only settings representation for Clients (Sanitized out secrets/passwords)
  const getSanitizedSettings = useCallback(() => {
    return {
      gateways: gateways.map(g => ({
        id: g.id,
        name: g.name,
        enabled: g.enabled,
        rails: g.rails,
        fee: g.fee,
        currencies: g.currencies,
        priority: g.priority
      })),
      globalFees: { ...globalFees },
      kycConfig: {
        docs: kycConfig.docs,
        levels: kycConfig.levels,
        restrictions: kycConfig.restrictions,
        resubmissionAllowed: kycConfig.resubmissionAllowed,
        resubmissionDays: kycConfig.resubmissionDays || kycConfig.ResubmissionDays
      },
      tradingConfig: {
        forexLev: tradingConfig.forexLev,
        indicesLev: tradingConfig.indicesLev,
        cryptoLev: tradingConfig.cryptoLev,
        metalLev: tradingConfig.metalLev,
        marginCallLevel: tradingConfig.marginCallLevel,
        stopOutLevel: tradingConfig.stopOutLevel,
        weekendTrading: tradingConfig.weekendTrading,
        newsTrading: tradingConfig.newsTrading,
      }
    };
  }, [gateways, globalFees, kycConfig, tradingConfig]);

  return (
    <PlatformSettingsContext.Provider value={{
      apiConfig,
      updateApiConfig,
      gateways,
      updateGateways,
      globalFees,
      updateGlobalFees,
      kycConfig,
      updateKycConfig,
      tradingConfig,
      updateTradingConfig,
      notificationConfig,
      updateNotificationConfig,
      systemConfig,
      updateSystemConfig,
      templates,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      fetchTemplates,
      clientSettings: getSanitizedSettings()
    }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  const context = useContext(PlatformSettingsContext);
  if (!context) {
    throw new Error('usePlatformSettings must be used within a PlatformSettingsProvider');
  }
  return context;
}
