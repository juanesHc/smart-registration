import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { IntelligentRegisterFormComponent } from './components/intelligent-register-form/intelligent-register-form.component';
import { ManualRegisterFormComponent } from './components/manual-register-form/manual-register-form.component';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ManualRegisterFormComponent,
    IntelligentRegisterFormComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {}
