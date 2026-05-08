import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-intelligent-register-form',
  imports: [TranslateModule, MatIconModule],
  templateUrl: './intelligent-register-form.component.html',
  styles: [`
    .placeholder {
      text-align: center;
      padding: var(--spacing-xl) var(--spacing-md);
      color: var(--color-text-secondary);
    }

    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--color-accent);
      margin-bottom: var(--spacing-md);
    }

    .placeholder-title {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-text);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .placeholder-text {
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.6;
    }
  `]
})
export class IntelligentRegisterFormComponent {}
