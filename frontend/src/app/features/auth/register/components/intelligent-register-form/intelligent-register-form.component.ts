import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

import { ExtractionResponse } from '../../../../../core/models/extraction/extraction-response.model';
import { ReviewStepComponent } from './steps/review-step/review-step.component';
import { UploadStepComponent } from './steps/upload-step/upload-step.component';

@Component({
  standalone: true,
  selector: 'app-intelligent-register-form',
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    UploadStepComponent,
    ReviewStepComponent
  ],
  templateUrl: './intelligent-register-form.component.html',
  styleUrl: './intelligent-register-form.component.scss'
})
export class IntelligentRegisterFormComponent {
  readonly currentStep = signal<'upload' | 'review'>('upload');
  readonly extractionResult = signal<ExtractionResponse | null>(null);

  onExtractionComplete(result: ExtractionResponse): void {
    this.extractionResult.set(result);
    this.currentStep.set('review');
  }

  onBackToUpload(): void {
    this.extractionResult.set(null);
    this.currentStep.set('upload');
  }
}
