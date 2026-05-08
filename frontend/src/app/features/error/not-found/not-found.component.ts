import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [MatButtonModule, MatIconModule, TranslateModule, LanguageSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  goToLogin(): void {
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.authService.logout();
      return;
    }
    void this.router.navigate(['/login']);
  }

  goToAccount(): void {
    void this.router.navigate(['/account']);
  }

  protected get isAuthenticated(): boolean {
    return this.authService.isAuthenticated() && !this.authService.isTokenExpired();
  }
}
