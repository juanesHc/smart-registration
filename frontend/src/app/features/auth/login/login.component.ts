import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { DialogService } from '../../../shared/services/dialog/dialog.service';

const GMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    LanguageSelectorComponent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(GMAIL_PATTERN)]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogService.success(this.translate.instant('success.LOGIN_SUCCESS'));
        void this.router.navigate(['/account']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const messageCode =
          (err.error && typeof err.error === 'object' && 'messageCode' in err.error
            ? (err.error['messageCode'] as string | undefined)
            : undefined) ?? 'INTERNAL_ERROR';
        this.dialogService.error(
          this.translate.instant(`errors.${messageCode}`),
          this.translate.instant('ui.BUTTON_OK')
        );
      }
    });
  }

  togglePassword(): void {
    this.hidePassword.update((v) => !v);
  }

  getEmailErrorKey(): string | null {
    const control = this.loginForm.controls.email;
    if (!control.touched || control.valid) {
      return null;
    }
    if (control.hasError('required')) {
      return 'EMAIL_REQUIRED';
    }
    if (control.hasError('pattern')) {
      return 'EMAIL_MUST_BE_GMAIL';
    }
    return null;
  }

  getPasswordErrorKey(): string | null {
    const control = this.loginForm.controls.password;
    if (!control.touched || control.valid) {
      return null;
    }
    if (control.hasError('required')) {
      return 'PASSWORD_REQUIRED';
    }
    return null;
  }
}
