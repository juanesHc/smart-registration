import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const PASSPORT_CODE = 'PASSPORT';

export const DIGITS_ONLY_PATTERN = /^\d+$/;
export const PASSPORT_PATTERN = /^[A-Z0-9]+$/;

export function documentNumberValidatorsFor(documentType: string | null): ValidatorFn[] {
  const pattern = documentType === PASSPORT_CODE ? PASSPORT_PATTERN : DIGITS_ONLY_PATTERN;
  return [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(15),
    Validators.pattern(pattern)
  ];
}

export function sanitizeDocumentNumber(raw: string, documentType: string | null): string {
  const value = raw ?? '';
  if (documentType === PASSPORT_CODE) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
  }
  return value.replace(/\D/g, '').slice(0, 15);
}

export function documentNumberMatchesType(documentType: string | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) return null;
    const pattern = documentType === PASSPORT_CODE ? PASSPORT_PATTERN : DIGITS_ONLY_PATTERN;
    return pattern.test(value) ? null : { pattern: true };
  };
}
