import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { JwtPayload } from '../../models/auth/jwt-payload.model';
import { LoginRequest } from '../../models/auth/login-request.model';
import { LoginResponse } from '../../models/auth/login-response.model';
import { CookieService } from '../cookie/cookie.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  private readonly baseUrl = `${environment.apiUrlJava}/auth`;

  private readonly _currentUser = signal<JwtPayload | null>(this.decodeToken());
  readonly currentUser = this._currentUser.asReadonly();

  private readonly _isAuthenticated = signal<boolean>(this.checkInitialAuth());
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  readonly userId = computed(() => this._currentUser()?.sub ?? null);
  readonly userEmail = computed(() => this._currentUser()?.email ?? null);

  login(request: LoginRequest, rememberMe: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        this.cookieService.setToken(response.token, rememberMe);
        const decoded = this.decodeToken();
        this._currentUser.set(decoded);
        this._isAuthenticated.set(decoded !== null && !this.isTokenExpired());
      })
    );
  }

  logout(): void {
    this.cookieService.deleteToken();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.cookieService.getToken();
  }

  getUserId(): string | null {
    return this.decodeToken()?.sub ?? null;
  }

  getUserEmail(): string | null {
    return this.decodeToken()?.email ?? null;
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded?.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  }

  private decodeToken(): JwtPayload | null {
    const token = this.cookieService.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  private checkInitialAuth(): boolean {
    return this.cookieService.hasToken() && !this.isTokenExpired();
  }
}
