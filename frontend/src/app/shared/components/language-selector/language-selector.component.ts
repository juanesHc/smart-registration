import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import {
  SupportedLanguage,
  TranslationService
} from '../../../core/services/translation/translation.service';

interface LanguageOption {
  readonly code: SupportedLanguage;
  readonly label: string;
}

@Component({
  standalone: true,
  selector: 'app-language-selector',
  imports: [MatFormFieldModule, MatSelectModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field appearance="outline" class="language-selector">
      <mat-label>{{ 'common.language' | translate }}</mat-label>
      <mat-select
        [value]="translation.currentLanguage()"
        (selectionChange)="onChange($event.value)">
        @for (option of options; track option.code) {
          <mat-option [value]="option.code">{{ option.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .language-selector {
      width: 140px;
    }
  `]
})
export class LanguageSelectorComponent {
  protected readonly translation = inject(TranslationService);

  protected readonly options: readonly LanguageOption[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' }
  ];

  protected onChange(lang: SupportedLanguage): void {
    void this.translation.setLanguage(lang);
  }
}
