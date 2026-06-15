/**
 * useAuthHooks.js
 *
 * TanStack Query v5 mutations for authentication operations:
 * register, OTP verification, and login.
 */

import { useMutation } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { registerUser, sendOtp, verifyOtp } from './authApiService';

/* ─────────────────────────────────────────────
   1.  REGISTER
   ───────────────────────────────────────────── */
/**
 * Mutation to create a new account.
 * On success the server returns { accessToken, refreshToken, user }
 * and fires an OTP email automatically.
 */
export function useRegisterUser(options = {}) {
  return useMutation({
    mutationFn: (payload) => registerUser(payload),
    ...options,
  });
}

/* ─────────────────────────────────────────────
   2.  SEND / RESEND OTP
   ───────────────────────────────────────────── */
/**
 * Mutation to (re)send a 6-digit OTP to the user's email.
 */
export function useSendOtp(options = {}) {
  return useMutation({
    mutationFn: (email) => sendOtp(email),
    ...options,
  });
}

/* ─────────────────────────────────────────────
   3.  VERIFY OTP
   ───────────────────────────────────────────── */
/**
 * Mutation to verify the OTP code and activate the account.
 */
export function useVerifyOtp(options = {}) {
  return useMutation({
    mutationFn: ({ email, otp }) => verifyOtp(email, otp),
    ...options,
  });
}

/* ─────────────────────────────────────────────
   4.  LOGIN USER
   ───────────────────────────────────────────── */
/**
 * Mutation to login a user and update global auth session state.
 */
export function useLoginUser(options = {}) {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    ...options,
  });
}
