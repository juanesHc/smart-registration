import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DocumentType } from '../../models/typeid/document-type.model';

@Injectable({ providedIn: 'root' })
export class TypeIdService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrlJava}/typeid`;

  getDocumentTypes(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${this.baseUrl}/retrieve`);
  }
}
