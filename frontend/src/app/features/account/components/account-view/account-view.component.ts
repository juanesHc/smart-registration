import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { AccountStateService } from '../../shared/account-state.service';

@Component({
  standalone: true,
  selector: 'app-account-view',
  imports: [CommonModule, TranslateModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-view.component.html',
  styleUrl: './account-view.component.scss'
})
export class AccountViewComponent {
  protected readonly state = inject(AccountStateService);
}
