export type ValidationError = {
  code: string;
  message: string;
};

export type ValidationResult = { ok: true } | { ok: false; error: ValidationError };

export function ok(): ValidationResult {
  return { ok: true };
}

export function fail(code: string, message: string): ValidationResult {
  return { ok: false, error: { code, message } };
}
