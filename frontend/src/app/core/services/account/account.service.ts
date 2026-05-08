import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DeleteAccountRequest } from '../../models/person/delete-account-request.model';
import { PersonData } from '../../models/person/person-data.model';
import { UpdatePersonRequest } from '../../models/person/update-person-request.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrlJava}/account`;

  getMyData(): Observable<PersonData> {
    return this.http.get<PersonData>(`${this.baseUrl}/me`);
  }

  updateMyData(request: UpdatePersonRequest): Observable<PersonData> {
    return this.http.patch<PersonData>(`${this.baseUrl}/me`, request);
  }

  deleteMyAccount(request: DeleteAccountRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me`, { body: request });
  }
}
