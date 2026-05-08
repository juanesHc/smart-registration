import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AddressData } from '../../../../../core/models/address/address-data.model';
import { RegisterPersonRequest } from '../../../../../core/models/person/register-person-request.model';
import { DocumentType } from '../../../../../core/models/typeid/document-type.model';
import { RegisterService } from '../../../../../core/services/register/register.service';
import { TypeIdService } from '../../../../../core/services/typeid/typeid.service';
import {
  PASSPORT_CODE,
  documentNumberValidatorsFor,
  sanitizeDocumentNumber
} from '../../../../../core/validators/document-number.validator';
import { passwordMatchValidator } from '../../../../../core/validators/password-match.validator';
import {
  sanitizeEmail,
  sanitizeName,
  sanitizePhone
} from '../../../../../core/validators/sanitizers';
import { AddressPickerComponent } from '../../../../../shared/components/address-picker/address-picker.component';
import { DialogService } from '../../../../../shared/services/dialog/dialog.service';
import { PasswordStrengthComponent } from '../password-strength/password-strength.component';

@Component({
  standalone: true,
  selector: 'app-manual-register-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    AddressPickerComponent,
    PasswordStrengthComponent
  ],
  templateUrl: './manual-register-form.component.html',
  styleUrl: './manual-register-form.component.scss'
})
export class ManualRegisterFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly registerService = inject(RegisterService);
  private readonly typeIdService = inject(TypeIdService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly registering = signal(false);
  readonly documentTypes = signal<DocumentType[]>([]);
  readonly loadingDocumentTypes = signal(true);
  readonly passwordValue = signal('');
  readonly selectedDocType = signal<string>('');

  readonly isPassport = computed(() => this.selectedDocType() === PASSPORT_CODE);
  readonly numberIdInputMode = computed(() => (this.isPassport() ? 'text' : 'numeric'));

  readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      ]],
      phone: ['', [Validators.required, Validators.pattern(/^3\d{9}$/)]],
      documentType: ['', [Validators.required]],
      numberId: ['', documentNumberValidatorsFor(null)],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,50}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      addressData: this.fb.control<AddressData | null>(null, { validators: [Validators.required] })
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  ngOnInit(): void {
    this.loadDocumentTypes();
    this.wireLiveSanitizers();
    this.wireDocumentTypeReactivity();

    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.passwordValue.set(value ?? ''));
  }

  private wireLiveSanitizers(): void {
    this.bindSanitizer(this.form.controls.firstName, sanitizeName);
    this.bindSanitizer(this.form.controls.lastName, sanitizeName);
    this.bindSanitizer(this.form.controls.phone, sanitizePhone);
    this.bindSanitizer(this.form.controls.email, sanitizeEmail);
  }

  private wireDocumentTypeReactivity(): void {
    this.form.controls.documentType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((docType) => {
        const code = docType ?? '';
        this.selectedDocType.set(code);

        const numberId = this.form.controls.numberId;
        numberId.setValidators(documentNumberValidatorsFor(code));

        const cleaned = sanitizeDocumentNumber(numberId.value ?? '', code);
        if (cleaned !== numberId.value) {
          numberId.setValue(cleaned, { emitEvent: false });
        }
        numberId.updateValueAndValidity();
      });

    this.form.controls.numberId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const cleaned = sanitizeDocumentNumber(value ?? '', this.selectedDocType());
        if (cleaned !== value) {
          this.form.controls.numberId.setValue(cleaned, { emitEvent: false });
        }
      });
  }

  private bindSanitizer(control: AbstractControl, sanitize: (v: string) => string): void {
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const cleaned = sanitize(value ?? '');
      if (cleaned !== value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    });
  }

  private loadDocumentTypes(): void {
    this.typeIdService.getDocumentTypes().subscribe({
      next: (types) => {
        this.documentTypes.set(types);
        this.loadingDocumentTypes.set(false);
      },
      error: () => {
        this.loadingDocumentTypes.set(false);
        this.dialogService.error(
          this.translate.instant('errors.INTERNAL_ERROR'),
          this.translate.instant('ui.BUTTON_OK')
        );
      }
    });
  }

  togglePassword(): void {
    this.hidePassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogService.confirm('ui.CONFIRM_REGISTER').subscribe((confirmed) => {
      if (!confirmed) return;
      this.executeRegister();
    });
  }

  private executeRegister(): void {
    this.registering.set(true);
    const request = this.buildRequest();

    this.registerService.registerClassic(request).subscribe({
      next: () => {
        this.registering.set(false);
        this.dialogService.success(this.translate.instant('success.REGISTRATION_SUCCESS'));
        void this.router.navigate(['/login']);
      },
      error: (err) => {
        this.registering.set(false);
        let messageKey: string;
        if (err.error?.fields) {
          const firstError = Object.values(err.error.fields)[0] as string;
          messageKey = `errors.${firstError}`;
        } else {
          const messageCode = err.error?.messageCode ?? 'INTERNAL_ERROR';
          messageKey = `errors.${messageCode}`;
        }
        this.dialogService.error(
          this.translate.instant(messageKey),
          this.translate.instant('ui.BUTTON_OK')
        );
      }
    });
  }

  private buildRequest(): RegisterPersonRequest {
    const v = this.form.getRawValue();
    const addr = v.addressData!;
    return {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      numberId: v.numberId,
      password: v.password,
      confirmPassword: v.confirmPassword,
      documentType: v.documentType,
      address: addr.address,
      city: addr.city,
      country: addr.country,
      latitude: addr.latitude,
      longitude: addr.longitude
    };
  }

  getErrorKey(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return this.getRequiredKey(controlName);
    if (control.hasError('minlength') || control.hasError('maxlength')) return this.getLengthKey(controlName);
    if (control.hasError('pattern')) return this.getPatternKey(controlName);
    if (control.hasError('passwordsDoNotMatch')) return 'PASSWORDS_DO_NOT_MATCH';
    return null;
  }

  private getRequiredKey(controlName: string): string {
    const map: Record<string, string> = {
      firstName: 'FIRST_NAME_REQUIRED',
      lastName: 'LAST_NAME_REQUIRED',
      email: 'EMAIL_REQUIRED',
      phone: 'PHONE_REQUIRED',
      documentType: 'DOCUMENT_TYPE_REQUIRED',
      numberId: 'DOCUMENT_NUMBER_REQUIRED',
      password: 'PASSWORD_REQUIRED',
      confirmPassword: 'CONFIRM_PASSWORD_REQUIRED',
      addressData: 'ADDRESS_REQUIRED'
    };
    return map[controlName] ?? 'INTERNAL_ERROR';
  }

  private getLengthKey(controlName: string): string {
    const map: Record<string, string> = {
      firstName: 'FIRST_NAME_LENGTH_INVALID',
      lastName: 'LAST_NAME_LENGTH_INVALID',
      numberId: 'DOCUMENT_NUMBER_LENGTH_INVALID',
      password: 'PASSWORD_LENGTH_INVALID'
    };
    return map[controlName] ?? 'INTERNAL_ERROR';
  }

  private getPatternKey(controlName: string): string {
    const map: Record<string, string> = {
      firstName: 'FIRST_NAME_FORMAT_INVALID',
      lastName: 'LAST_NAME_FORMAT_INVALID',
      email: 'EMAIL_MUST_BE_GMAIL',
      phone: 'PHONE_FORMAT_INVALID',
      numberId: this.isPassport() ? 'DOCUMENT_NUMBER_PASSPORT_FORMAT_INVALID' : 'DOCUMENT_NUMBER_FORMAT_INVALID',
      password: 'PASSWORD_FORMAT_INVALID'
    };
    return map[controlName] ?? 'INTERNAL_ERROR';
  }
}
