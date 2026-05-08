import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  PasswordStrengthResult,
  calculatePasswordStrength
} from '../../../../../core/helpers/password-strength.helper';

@Component({
  standalone: true,
  selector: 'app-password-strength',
  imports: [CommonModule, TranslateModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss'
})
export class PasswordStrengthComponent {
  private readonly _password = signal('');

  @Input()
  set password(value: string) {
    this._password.set(value ?? '');
  }

  readonly result = computed<PasswordStrengthResult>(() =>
    calculatePasswordStrength(this._password())
  );
}
