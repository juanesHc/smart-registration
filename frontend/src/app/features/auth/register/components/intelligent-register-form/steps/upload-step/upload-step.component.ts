import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ExtractionResponse } from '../../../../../../../core/models/extraction/extraction-response.model';
import { ExtractionService } from '../../../../../../../core/services/extraction/extraction.service';
import { DialogService } from '../../../../../../../shared/services/dialog/dialog.service';

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPE = 'application/pdf';

@Component({
  standalone: true,
  selector: 'app-upload-step',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './upload-step.component.html',
  styleUrl: './upload-step.component.scss'
})
export class UploadStepComponent {
  private readonly extractionService = inject(ExtractionService);
  private readonly dialogService = inject(DialogService);
  private readonly translate = inject(TranslateService);

  readonly extractionComplete = output<ExtractionResponse>();

  readonly selectedFile = signal<File | null>(null);
  readonly isDragging = signal(false);
  readonly processing = signal(false);

  readonly maxSizeMb = MAX_SIZE_MB;

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  openFilePicker(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  processFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.processing.set(true);

    this.extractionService.extractFromPdf(file).subscribe({
      next: (result) => {
        this.processing.set(false);
        this.dialogService.success(this.translate.instant('success.EXTRACTION_SUCCESS'));
        this.extractionComplete.emit(result);
      },
      error: (err: HttpErrorResponse) => {
        this.processing.set(false);
        // Status 0 is handled by error.interceptor (INTERNAL_ERROR snackbar) — avoid duplicate.
        if (err.status === 0) return;
        const messageCode = err.error?.messageCode ?? 'EXTRACTION_FAILED';
        this.dialogService.error(
          this.translate.instant(`errors.${messageCode}`),
          this.translate.instant('ui.BUTTON_OK')
        );
      }
    });
  }

  private handleFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== ACCEPTED_TYPE) {
      this.showFileError('PDF_FILE_INVALID_TYPE');
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      this.showFileError('PDF_FILE_TOO_LARGE');
      return;
    }

    this.selectedFile.set(file);
  }

  private showFileError(code: string): void {
    this.dialogService.error(
      this.translate.instant(`errors.${code}`),
      this.translate.instant('ui.BUTTON_OK')
    );
  }
}
