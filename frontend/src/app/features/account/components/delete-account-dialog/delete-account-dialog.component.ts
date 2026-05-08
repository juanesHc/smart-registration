import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AccountService } from '../../../../core/services/account/account.service';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';

@Component({
  standalone: true,
  selector: 'app-delete-account-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './delete-account-dialog.component.html',
  styleUrl: './delete-account-dialog.component.scss'
})
export class DeleteAccountDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DeleteAccountDialogComponent>);
  private readonly accountService = inject(AccountService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  readonly hidePassword = signal(true);
  readonly deleting = signal(false);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]]
  });

  togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.deleting.set(true);

    this.accountService
      .deleteMyAccount({
        currentPassword: this.form.controls.currentPassword.value
      })
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.deleting.set(false);
          const messageCode = err.error?.messageCode ?? 'INTERNAL_ERROR';
          this.dialogService.error(
            this.translate.instant(`errors.${messageCode}`),
            this.translate.instant('ui.BUTTON_OK')
          );
        }
      });
  }
}
