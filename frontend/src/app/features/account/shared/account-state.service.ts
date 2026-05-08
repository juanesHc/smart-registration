import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { PersonData } from '../../../core/models/person/person-data.model';
import { UpdatePersonRequest } from '../../../core/models/person/update-person-request.model';
import { AccountService } from '../../../core/services/account/account.service';

@Injectable()
export class AccountStateService {
  private readonly accountService = inject(AccountService);

  private readonly _personData = signal<PersonData | null>(null);
  private readonly _loading = signal(false);
  private readonly _editMode = signal(false);

  readonly personData = this._personData.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly editMode = this._editMode.asReadonly();

  readonly fullName = computed(() => {
    const data = this._personData();
    if (!data) return '';
    return `${data.firstName} ${data.lastName}`;
  });

  loadData(): Observable<PersonData> {
    this._loading.set(true);
    return this.accountService.getMyData().pipe(
      tap({
        next: (data) => {
          this._personData.set(data);
          this._loading.set(false);
        },
        error: () => this._loading.set(false)
      })
    );
  }

  updateData(request: UpdatePersonRequest): Observable<PersonData> {
    this._loading.set(true);
    return this.accountService.updateMyData(request).pipe(
      tap({
        next: (data) => {
          this._personData.set(data);
          this._loading.set(false);
          this._editMode.set(false);
        },
        error: () => this._loading.set(false)
      })
    );
  }

  toggleEditMode(): void {
    this._editMode.set(!this._editMode());
  }

  setEditMode(value: boolean): void {
    this._editMode.set(value);
  }
}
