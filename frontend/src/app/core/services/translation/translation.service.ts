import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type SupportedLanguage = 'es' | 'en' | 'pt';

const STORAGE_KEY = 'app_language';
const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['es', 'en', 'pt'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'es';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private readonly languageSignal = signal<SupportedLanguage>(DEFAULT_LANGUAGE);

  readonly currentLanguage = computed(() => this.languageSignal());
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  async init(): Promise<void> {
    this.translate.addLangs([...SUPPORTED_LANGUAGES]);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    const stored = this.readStoredLanguage();
    await this.setLanguage(stored ?? DEFAULT_LANGUAGE);
  }

  async setLanguage(lang: SupportedLanguage): Promise<void> {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return;
    }
    this.languageSignal.set(lang);
    await firstValueFrom(this.translate.use(lang));
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable (e.g. SSR or privacy mode) — ignore
    }
  }

  private readStoredLanguage(): SupportedLanguage | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)) {
        return value as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return null;
  }
}
