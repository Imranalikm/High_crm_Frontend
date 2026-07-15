import { apiClient } from '@/shared/api/client/apiClient';
import { mt5Accounts, userActivityFeed, userMetrics, adminAuditLogs } from '@/config/constants/MOCK_USERS';

let localUsersCache = [];

const mapUserRecord = (rawUser) => {
  if (!rawUser) return null;
  return {
    id: rawUser.id,
    uid: rawUser.id,
    name: rawUser.name || 'Unknown User',
    email: rawUser.email || '',
    avatar: rawUser.avatar || null,
    phone: rawUser.phone || '',
    country: rawUser.country || '',
    address: rawUser.address || '',
    tier: rawUser.tier || 'Standard',
    segment: rawUser.segment || 'Retail',
    fundingState: rawUser.fundingState || 'PENDING',
    kycStatus: rawUser.kyc ? (rawUser.kyc.status === 'approved' ? 'VERIFIED' : rawUser.kyc.status === 'rejected' ? 'REJECTED' : rawUser.kyc.status === 'pending' ? 'PENDING' : 'DRAFT') : 'DRAFT',
    riskStatus: rawUser.riskStatus || 'LOW',
    walletBalance: rawUser.wallet_balance ? `$${parseFloat(rawUser.wallet_balance).toLocaleString()}` : '$0.00',
    equity: rawUser.wallet_balance ? `$${parseFloat(rawUser.wallet_balance).toLocaleString()}` : '$0.00',
    pnl30d: '$0.00',
    openPositions: 0,
    mt5Accounts: 0,
    registered: rawUser.createdAt || 'N/A',
    lastSeen: rawUser.updatedAt || 'N/A',
    source: 'Direct Registration',
    suspended: rawUser.status === 'blocked',
    notesSummary: '',
    kyc: rawUser.kyc || null,
    wallet: [],
    mt5: [],
    tradingHistory: [],
    activity: [],
    risk: {
      score: '0 / 100', exposure: '$0', concentration: 'None', drawdown: '0%', status: 'LOW', alerts: [],
    },
    notes: [],
    tags: [],
    sessions: [],
    withdrawalsBlocked: false,
    readOnlyTerminals: false,
    apiBlocked: false,
    rebateRate: 10,
    referrals: [],
    livePositions: [],
    walletHistory: [],
    ...rawUser // keep original properties just in case
  };
};

const findUser = (userId) => {
  return localUsersCache.find((u) => u.id === userId || u.uid === userId);
};

export const usersService = {
  getMetrics() {
    return userMetrics;
  },

  async list() {
    try {
      const response = await apiClient.get('/user-management');
      
      if (response && response.success === false) {
        throw new Error(response.message || 'API responded with success: false');
      }

      // Safe checks for all standard response patterns of arrays
      let listData = null;
      if (Array.isArray(response)) {
        listData = response;
      } else if (response && Array.isArray(response.data)) {
        listData = response.data;
      } else if (response && response.data && Array.isArray(response.data.users)) {
        listData = response.data.users;
      } else if (response && Array.isArray(response.users)) {
        listData = response.users;
      }

      if (!listData) {
        throw new Error('API response does not contain a valid users list array');
      }

      const mapped = listData.map(mapUserRecord);
      localUsersCache = mapped;
      return mapped;
    } catch (error) {
      console.warn('Failed to fetch users from API:', error);
      return [];
    }
  },

  listActivity() {
    return userActivityFeed;
  },

  listMt5Accounts() {
    return mt5Accounts;
  },

  async getById(userId) {
    try {
      const response = await apiClient.get(`/user-management/${userId}`);
      
      if (response && response.success === false) {
        throw new Error(response.message || 'API responded with success: false');
      }

      const rawUser = response?.data ?? response;
      if (!rawUser || typeof rawUser !== 'object') {
        throw new Error('API response did not contain a valid user object');
      }

      const mapped = mapUserRecord(rawUser);
      if (mapped) {
        const idx = localUsersCache.findIndex((u) => u.id === userId || u.uid === userId);
        if (idx !== -1) {
          localUsersCache[idx] = mapped;
        } else {
          localUsersCache.push(mapped);
        }
      }
      return mapped;
    } catch (error) {
      console.warn(`Failed to get user by ID ${userId} from API:`, error);
      return null;
    }
  },

  async create(payload) {
    try {
      const response = await apiClient.post('/user-management', payload);
      
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to create user');
      }

      const rawUser = response?.data ?? response;
      const mapped = mapUserRecord(rawUser);
      if (mapped) {
        localUsersCache.unshift(mapped);
      }
      return mapped;
    } catch (error) {
      console.warn('Failed to create user on API:', error);
      throw error;
    }
  },

  async update(userId, payload) {
    try {
      const response = await apiClient.put(`/user-management/${userId}`, payload);
      
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update user');
      }

      const rawUser = response?.data ?? response;
      const mapped = mapUserRecord(rawUser);
      if (mapped) {
        const idx = localUsersCache.findIndex((u) => u.id === userId || u.uid === userId);
        if (idx !== -1) {
          localUsersCache[idx] = mapped;
        }
      }
      return mapped;
    } catch (error) {
      console.warn(`Failed to update user ID ${userId} on API:`, error);
      throw error;
    }
  },

  async toggleBlock(userId, blocked) {
    try {
      const response = await apiClient.patch(`/user-management/${userId}/block`, {
        action: blocked ? 'block' : 'unblock',
      });

      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update user block status');
      }

      const rawUser = response?.data ?? response;
      const mapped = mapUserRecord(rawUser);
      if (mapped) {
        const idx = localUsersCache.findIndex((u) => u.id === userId || u.uid === userId);
        if (idx !== -1) {
          localUsersCache[idx] = mapped;
        }
      }
      return mapped;
    } catch (error) {
      console.warn(`Failed to toggle block state for user ID ${userId} on API:`, error);
      throw error;
    }
  },

  createMt5AccountForUser(userId, accountData) {
    const user = findUser(userId);
    if (!user) return null;

    const login = accountData.login || String(Math.floor(88100000 + Math.random() * 899999));
    const server = accountData.server || 'MT5-LIVE-EU1';
    const group = accountData.group || 'REAL_RAW_SPREAD';
    const leverage = accountData.leverage || '1:100';
    const deposit = accountData.deposit || '1000';
    const equityStr = `$${parseFloat(deposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const newAcct = {
      login,
      server,
      group,
      leverage,
      equity: equityStr,
      balance: equityStr,
      margin: '$0.00',
      freeMargin: equityStr,
      marginLvl: '—',
      status: 'CONNECTED',
      lastSync: 'Just now',
    };

    if (!user.mt5) user.mt5 = [];
    user.mt5.push(newAcct);
    user.mt5Accounts = user.mt5.length;

    // Adjust user net equity if there was a deposit
    const existingEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    user.equity = `$${(existingEquity + parseFloat(deposit)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Add to global mt5Accounts inventory
    const newGlobalRecord = {
      id: `MT5-${Date.now()}-${login}`,
      login,
      userId: user.id,
      user: user.name,
      server,
      status: 'CONNECTED',
      connection: 'HEALTHY',
      group,
      leverage,
      balance: equityStr,
      lastSync: 'Just now',
    };
    mt5Accounts.push(newGlobalRecord);

    return newAcct;
  },

  updateMt5AccountForUser(userId, login, accountData) {
    const user = findUser(userId);
    if (!user) return null;

    // Update inside user's local mt5 array
    if (user.mt5) {
      const idx = user.mt5.findIndex((item) => item.login === login);
      if (idx !== -1) {
        user.mt5[idx] = { ...user.mt5[idx], ...accountData };
      }
    }

    // Update inside global mt5Accounts array
    const gIdx = mt5Accounts.findIndex((item) => item.login === login);
    if (gIdx !== -1) {
      mt5Accounts[gIdx] = { ...mt5Accounts[gIdx], ...accountData };
      if (accountData.balance) {
        mt5Accounts[gIdx].balance = accountData.balance;
      }
    }
  },

  deleteMt5AccountForUser(userId, login) {
    const user = findUser(userId);
    if (!user) return false;

    // Remove from user's local mt5 array
    if (user.mt5) {
      const initialLen = user.mt5.length;
      user.mt5 = user.mt5.filter((item) => item.login !== login);
      user.mt5Accounts = user.mt5.length;
      if (user.mt5.length === initialLen) return false;
    }

    // Remove from global mt5Accounts array
    const gIdx = mt5Accounts.findIndex((item) => item.login === login);
    if (gIdx !== -1) {
      mt5Accounts.splice(gIdx, 1);
    }
    return true;
  },

  updateUserTags(userId, tags) {
    const user = findUser(userId);
    if (user) {
      user.tags = tags;
      return user;
    }
    return null;
  },

  updateUserTierAndSegment(userId, tier, segment) {
    const user = findUser(userId);
    if (user) {
      user.tier = tier;
      user.segment = segment;
      return user;
    }
    return null;
  },

  revokeUserSession(userId, sessionId) {
    const user = findUser(userId);
    if (user && user.sessions) {
      user.sessions = user.sessions.filter((s) => s.id !== sessionId);
      return user;
    }
    return null;
  },

  approve(item) {
    const user = findUser(item.id);
    if (user) {
      user.kycStatus = 'VERIFIED';
      if (user.kyc) user.kyc.status = 'VERIFIED';
    }
    return { ...item, status: 'APPROVED' };
  },

  reject(item) {
    const user = findUser(item.id);
    if (user) {
      user.kycStatus = 'REJECTED';
      if (user.kyc) user.kyc.status = 'REJECTED';
    }
    return { ...item, status: 'REJECTED' };
  },

  listAdminAuditLogs() {
    return adminAuditLogs;
  },

  logAdminAction(author, target, action) {
    const logEntry = {
      id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      author,
      target,
      action,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    adminAuditLogs.unshift(logEntry);
    return logEntry;
  },

  updateUserSecurityRestrictions(userId, locks) {
    const user = findUser(userId);
    if (user) {
      user.withdrawalsBlocked = locks.withdrawalsBlocked;
      user.readOnlyTerminals = locks.readOnlyTerminals;
      user.apiBlocked = locks.apiBlocked;
      return user;
    }
    return null;
  },

  updateUserRebateRate(userId, rate) {
    const user = findUser(userId);
    if (user) {
      user.rebateRate = rate;
      return user;
    }
    return null;
  },

  forceCloseUserPosition(userId, ticketId) {
    const user = findUser(userId);
    if (!user || !user.livePositions) return null;

    const posIndex = user.livePositions.findIndex((p) => p.ticket === ticketId);
    if (posIndex === -1) return null;

    const position = user.livePositions[posIndex];
    user.livePositions.splice(posIndex, 1);

    // Parse PNL
    const pnlVal = parseFloat(position.pnl.replace(/[$,+]/g, '')) || 0;
    const closedTrade = {
      ticket: position.ticket,
      symbol: position.symbol,
      side: position.side,
      lots: position.lots,
      open: position.openPrice,
      close: position.livePrice,
      pnl: position.pnl,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    if (!user.tradingHistory) user.tradingHistory = [];
    user.tradingHistory.unshift(closedTrade);

    // Update wallet balance and equity
    let currentBalance = parseFloat((user.walletBalance || '$0').replace(/[$,]/g, '')) || 0;
    const newBalance = currentBalance + pnlVal;
    user.walletBalance = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let currentEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    const newEquity = currentEquity + pnlVal;
    user.equity = `$${newEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return { user, position };
  },

  forceHedgeUserPosition(userId, ticketId) {
    const user = findUser(userId);
    if (!user || !user.livePositions) return null;

    const position = user.livePositions.find((p) => p.ticket === ticketId);
    if (!position) return null;

    const hedgeSide = position.side === 'BUY' ? 'SELL' : 'BUY';
    const hedgeTicket = String(Math.floor(9900000 + Math.random() * 99999));
    const hedgePosition = {
      ticket: hedgeTicket,
      symbol: position.symbol,
      side: hedgeSide,
      lots: position.lots,
      openPrice: position.livePrice,
      livePrice: position.livePrice,
      swaps: '$0.00',
      commissions: position.commissions,
      pnl: '$0.00',
    };

    user.livePositions.push(hedgePosition);
    return { user, hedgePosition };
  },

  adjustUserBalance(userId, asset, amount, type) {
    const user = findUser(userId);
    if (!user) return null;

    const change = type === 'CREDIT' ? amount : -amount;

    // Update user walletBalance
    let currentBalance = parseFloat((user.walletBalance || '$0').replace(/[$,]/g, '')) || 0;
    const newBalance = currentBalance + change;
    user.walletBalance = `$${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let currentEquity = parseFloat((user.equity || '$0').replace(/[$,]/g, '')) || 0;
    const newEquity = currentEquity + change;
    user.equity = `$${newEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Update user wallet history
    const newTx = {
      id: `TX-${Math.floor(40000 + Math.random() * 59999)}`,
      type: type === 'CREDIT' ? 'DEPOSIT' : 'WITHDRAWAL',
      amount: `${change >= 0 ? '+' : '-'}$${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      method: 'Internal Manual Adjustment',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'SUCCESS',
    };
    if (!user.walletHistory) user.walletHistory = [];
    user.walletHistory.unshift(newTx);

    return user;
  },

  export() {
    return localUsersCache;
  },

  async getBankAccountsByUserId(userId) {
    try {
      const response = await apiClient.get(`/bank-accounts/user/${userId}`);
      return response?.bankAccounts || response?.data || [];
    } catch (error) {
      console.warn(`Failed to fetch bank accounts for user ${userId}:`, error);
      throw error;
    }
  },

  async approveBankAccountEdit(id) {
    try {
      const response = await apiClient.post(`/bank-accounts/${id}/approve-edit`);
      return response;
    } catch (error) {
      console.warn(`Failed to approve bank account edit ${id}:`, error);
      throw error;
    }
  },

  async rejectBankAccountEdit(id) {
    try {
      const response = await apiClient.post(`/bank-accounts/${id}/reject-edit`);
      return response;
    } catch (error) {
      console.warn(`Failed to reject bank account edit ${id}:`, error);
      throw error;
    }
  },
};
