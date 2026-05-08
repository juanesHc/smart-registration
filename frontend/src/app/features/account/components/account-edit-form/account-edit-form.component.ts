import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AddressData } from '../../../../core/models/address/address-data.model';
import { UpdatePersonRequest } from '../../../../core/models/person/update-person-request.model';
import { sanitizeName, sanitizePhone } from '../../../../core/validators/sanitizers';
import { AddressPickerComponent } from '../../../../shared/components/address-picker/address-picker.component';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';
import { AccountStateService } from '../../shared/account-state.service';

@Component({
  standalone: true,
  selector: 'app-account-edit-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AddressPickerComponent
  ],
  templateUrl: './account-edit-form.component.html',
  styleUrl: './account-edit-form.component.scss'
})
export class AccountEditFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly state = inject(AccountStateService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]],
    lastName: ['', [
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]],
    phone: ['', [Validators.pattern(/^3\d{9}$/)]],
    extraData: [''],
    addressData: this.fb.control<AddressData | null>(null, { validators: [Validators.required] })
  });

  ngOnInit(): void {
    const data = this.state.personData();
    if (data) {
      this.form.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        extraData: data.extraData ?? '',
        addressData: {
          address: data.address,
          city: data.city,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude
        }
      });
    }

    this.bindSanitizer(this.form.controls.firstName, sanitizeName);
    this.bindSanitizer(this.form.controls.lastName, sanitizeName);
    this.bindSanitizer(this.form.controls.phone, sanitizePhone);
  }

  private bindSanitizer(control: AbstractControl, sanitize: (v: string) => string): void {
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const cleaned = sanitize(value ?? '');
      if (cleaned !== value) {
        control.setValue(cleaned, { emitEvent: false });
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogService.confirm('ui.CONFIRM_UPDATE').subscribe((confirmed) => {
      if (!confirmed) return;

      this.saving.set(true);
      const request = this.buildUpdateRequest();

      this.state.updateData(request).subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogService.success(this.translate.instant('success.UPDATE_SUCCESS'));
        },
        error: (err) => {
          this.saving.set(false);
          const messageCode = err.error?.messageCode ?? 'INTERNAL_ERROR';
          this.dialogService.error(
            this.translate.instant(`errors.${messageCode}`),
            this.translate.instant('ui.BUTTON_OK')
          );
        }
      });
    });
  }

  onCancel(): void {
    this.state.setEditMode(false);
  }

  private buildUpdateRequest(): UpdatePersonRequest {
    const original = this.state.personData()!;
    const current = this.form.getRawValue();
    const request: UpdatePersonRequest = {};

    if (current.firstName !== original.firstName) request.firstName = current.firstName;
    if (current.lastName !== original.lastName) request.lastName = current.lastName;
    if (current.phone !== original.phone) request.phone = current.phone;
    if (current.extraData !== (original.extraData ?? '')) request.extraData = current.extraData;

    const addr = current.addressData;
    if (addr) {
      if (addr.address !== original.address) request.address = addr.address;
      if (addr.city !== original.city) request.city = addr.city;
      if (addr.country !== original.country) request.country = addr.country;
      if (addr.latitude !== original.latitude) request.latitude = addr.latitude;
      if (addr.longitude !== original.longitude) request.longitude = addr.longitude;
    }

    return request;
  }

  getErrorKey(controlName: keyof typeof this.form.controls): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.touched || control.valid) return null;

    const upperName = (controlName as string).replace(/([A-Z])/g, '_$1').toUpperCase();

    if (control.hasError('minlength') || control.hasError('maxlength')) {
      return `${upperName}_LENGTH_INVALID`;
    }
    if (control.hasError('pattern')) {
      return `${upperName}_FORMAT_INVALID`;
    }
    return null;
  }
}
