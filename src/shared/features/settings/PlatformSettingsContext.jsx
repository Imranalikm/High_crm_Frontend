/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_API_CONFIG } from '@/admin/features/settings/configs/api.config';
import { INITIAL_GATEWAYS, INITIAL_GLOBAL_FEES } from '@/admin/features/settings/configs/payment.config';
import { INITIAL_KYC_CONFIG } from '@/admin/features/settings/configs/kyc.config';
import { INITIAL_TRADING_CONFIG } from '@/admin/features/settings/configs/trading.config';
import { INITIAL_NOTIFICATION_CONFIG } from '@/admin/features/settings/configs/notification.config';
import { INITIAL_SYSTEM_CONFIG } from '@/admin/features/settings/configs/system.config';

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
  const [apiConfig, setApiConfigState] = useState(() => getStoredValue(STORAGE_KEYS.api, INITIAL_API_CONFIG));
  const [gateways, setGatewaysState] = useState(() => getStoredValue(STORAGE_KEYS.gateways, INITIAL_GATEWAYS));
  const [globalFees, setGlobalFeesState] = useState(() => getStoredValue(STORAGE_KEYS.globalFees, INITIAL_GLOBAL_FEES));
  const [kycConfig, setKycConfigState] = useState(() => getStoredValue(STORAGE_KEYS.kyc, INITIAL_KYC_CONFIG));
  const [tradingConfig, setTradingConfigState] = useState(() => getStoredValue(STORAGE_KEYS.trading, INITIAL_TRADING_CONFIG));
  const [notificationConfig, setNotificationConfigState] = useState(() => getStoredValue(STORAGE_KEYS.notifications, INITIAL_NOTIFICATION_CONFIG));
  const [systemConfig, setSystemConfigState] = useState(() => getStoredValue(STORAGE_KEYS.system, INITIAL_SYSTEM_CONFIG));

  // Sync to localStorage
  const saveToStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error writing key ${key} to localStorage`, e);
    }
  }, []);

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

  const updateNotificationConfig = useCallback((newConfig) => {
    setNotificationConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.notifications, newConfig);
  }, [saveToStorage]);

  const updateSystemConfig = useCallback((newConfig) => {
    setSystemConfigState(newConfig);
    saveToStorage(STORAGE_KEYS.system, newConfig);
  }, [saveToStorage]);

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
