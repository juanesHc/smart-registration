import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ExtractionResponse } from '../../models/extraction/extraction-response.model';

@Injectable({ providedIn: 'root' })
export class ExtractionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrlPython;

  extractFromPdf(file: File): Observable<ExtractionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExtractionResponse>(`${this.baseUrl}/extract`, formData);
  }
}
