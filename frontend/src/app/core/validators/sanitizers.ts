const NAME_ALLOWED = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;

export function sanitizeName(raw: string): string {
  return (raw ?? '').replace(NAME_ALLOWED, '').slice(0, 20);
}

export function sanitizePhone(raw: string): string {
  return (raw ?? '').replace(/\D/g, '').slice(0, 10);
}

export function sanitizeEmail(raw: string): string {
  return (raw ?? '').trim().toLowerCase().slice(0, 100);
}
