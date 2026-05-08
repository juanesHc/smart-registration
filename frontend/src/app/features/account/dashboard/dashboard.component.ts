import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { AccountEditFormComponent } from '../components/account-edit-form/account-edit-form.component';
import { AccountViewComponent } from '../components/account-view/account-view.component';
import { DeleteAccountDialogComponent } from '../components/delete-account-dialog/delete-account-dialog.component';
import { AccountStateService } from '../shared/account-state.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    AccountViewComponent,
    AccountEditFormComponent,
    LanguageSelectorComponent
  ],
  providers: [AccountStateService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected readonly state = inject(AccountStateService);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.state.loadData().subscribe({
      error: () => {
        // The error interceptor handles 401/404 by logging out.
        // We swallow here so the dashboard doesn't surface a duplicate error.
      }
    });
  }

  onLogout(): void {
    this.dialogService.confirm('ui.CONFIRM_LOGOUT').subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
        this.dialogService.success(this.translate.instant('success.LOGOUT_SUCCESS'));
      }
    });
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '420px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.dialogService.success(this.translate.instant('success.ELIMINATION_SUCCESS'));
        this.authService.logout();
      }
    });
  }
}
