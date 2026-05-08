import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { GenericResponse } from '../../models/api/generic-response.model';
import { RegisterPersonRequest } from '../../models/person/register-person-request.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrlJava}/register`;

  registerClassic(request: RegisterPersonRequest): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.baseUrl}/classic`, request);
  }
}
