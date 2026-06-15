/**
 * authApiService.js
 *
 * Real API integration for registration + OTP verification.
 * Base: https://account.smatams.com/api
 *
 * Endpoints:
 *  POST /auth/register     — Create account (status: pending), sends OTP to email
 *  POST /auth/otp/send     — Resend a 6-digit OTP to the user's email
 *  POST /auth/otp/verify   — Verify OTP, activates account, returns tokens + user
 */

const BASE_URL = (() => {
  let url = import.meta.env.VITE_API_URL || 'https://account.smatams.com/api';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
})();

/** Generic JSON fetch helper */
async function apiFetch(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    // Prefer the server's message; fall back to status text
    const message =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors[0]?.message : null) ||
      `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Register a new user.
 *
 * @param {{ name: string, email: string, password: string, country?: string, phone?: string }} payload
 * @returns {{ accessToken: string, refreshToken: string, user: object }}
 */
export async function registerUser(payload) {
  const data = await apiFetch('/auth/register', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    ...(payload.country ? { country: payload.country } : {}),
    ...(payload.phone ? { phone: payload.phone } : {}),
  });
  return data?.data ?? data;
}

/**
 * Send / re-send OTP to the given email.
 *
 * @param {string} email
 * @returns {{ success: boolean, message: string }}
 */
export async function sendOtp(email) {
  return apiFetch('/auth/otp/send', { email });
}

/**
 * Verify a 6-digit OTP code.
 * On success, account becomes active and tokens are returned.
 *
 * @param {string} email
 * @param {string} otp
 * @returns {{ accessToken: string, refreshToken: string, user: object }}
 */
export async function verifyOtp(email, otp) {
  const data = await apiFetch('/auth/otp/verify', { email, otp });
  return data?.data ?? data;
}

/**
 * Log in a user with email + password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ accessToken: string, refreshToken: string, user: object }}
 */
export async function loginUser(email, password) {
  const data = await apiFetch('/auth/login', { email, password });
  return data?.data ?? data;
}

/**
 * Rotate tokens using a refresh token.
 *
 * @param {string} refreshToken
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export async function refreshTokens(refreshToken) {
  const data = await apiFetch('/auth/refresh', { refreshToken });
  return data?.data ?? data;
}

/**
 * Fetch currently authenticated user info (including permissions).
 *
 * @param {string} accessToken
 * @returns {{ user: object }}
 */
export async function fetchMe(accessToken) {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || `Failed to fetch profile (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data?.data ?? data;
}

