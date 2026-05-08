import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../components/confirmation-dialog/confirmation-dialog.component';

const SUCCESS_DURATION_MS = 3000;
const ERROR_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  confirm(messageKey: string): Observable<boolean> {
    const data: ConfirmationDialogData = {
      titleKey: 'ui.CONFIRM_TITLE',
      messageKey,
      confirmKey: 'ui.BUTTON_CONFIRM',
      cancelKey: 'ui.BUTTON_CANCEL'
    };
    return this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
        ConfirmationDialogComponent,
        {
          data,
          width: '400px',
          autoFocus: 'dialog',
          restoreFocus: true
        }
      )
      .afterClosed()
      .pipe(map((result) => result === true));
  }

  success(message: string): void {
    this.snackBar.open(message, '', {
      duration: SUCCESS_DURATION_MS,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  error(message: string, action: string = ''): void {
    this.snackBar.open(message, action, {
      duration: ERROR_DURATION_MS,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }
}
