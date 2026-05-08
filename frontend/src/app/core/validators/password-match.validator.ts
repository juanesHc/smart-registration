import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey: string,
  confirmPasswordKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirmPassword = group.get(confirmPasswordKey);

    if (!password || !confirmPassword) return null;
    if (!confirmPassword.value) return null;

    if (password.value !== confirmPassword.value) {
      const currentErrors = confirmPassword.errors ?? {};
      confirmPassword.setErrors({ ...currentErrors, passwordsDoNotMatch: true });
      return { passwordsDoNotMatch: true };
    }

    const currentErrors = confirmPassword.errors;
    if (currentErrors && currentErrors['passwordsDoNotMatch']) {
      delete currentErrors['passwordsDoNotMatch'];
      const hasOtherErrors = Object.keys(currentErrors).length > 0;
      confirmPassword.setErrors(hasOtherErrors ? currentErrors : null);
    }
    return null;
  };
}
