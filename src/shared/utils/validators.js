export function validateUserDraft(draft, mode = 'create') {
  const errors = {};

  if (!draft?.name?.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!draft?.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(draft.email)) {
    errors.email = 'Invalid email address.';
  }

  if (mode === 'create') {
    if (!draft?.password) {
      errors.password = 'Password is required.';
    } else if (draft.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!draft?.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (draft.password !== draft.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return errors;
}

export function isUserDraftValid(draft, mode = 'create') {
  return Object.keys(validateUserDraft(draft, mode)).length === 0;
}
