export type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  level: PasswordStrength;
  score: number;
  labelKey: string;
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { level: 'none', score: 0, labelKey: '' };
  }

  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;

  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;

  const charTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*]/.test(password)
  ].filter(Boolean).length;
  if (charTypes >= 4) score += 10;

  score = Math.min(score, 100);

  if (score < 50) return { level: 'weak', score, labelKey: 'PASSWORD_STRENGTH_WEAK' };
  if (score < 80) return { level: 'medium', score, labelKey: 'PASSWORD_STRENGTH_MEDIUM' };
  return { level: 'strong', score, labelKey: 'PASSWORD_STRENGTH_STRONG' };
}
