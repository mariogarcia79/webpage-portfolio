// Use Vite environment variable when available so production builds can
// point to a different API host without changing source files.
// In production we prefer a relative path so the browser talks to the same
// origin (e.g. `https://yourdomain.com/api`) which avoids CORS issues.
// Example: set `VITE_API_BASE_URL=https://api.example.com/api` when building.
// Safely access Vite's `import.meta.env`. Some TypeScript setups or tools
// may not have the `import.meta.env` type available at analysis time, which
// causes "env does not exist on importmeta" errors. Use an `any` fallback
// to avoid TS complaints while preserving runtime behavior.
// Prefer Vite's import.meta.env when available. Avoid referencing `process`
// at runtime in the browser to prevent `process is undefined` errors.
const _meta: any = typeof import.meta !== 'undefined' ? (import.meta as any) : { env: {} };
const _env: Record<string, any> = _meta.env || {};

export const API_BASE_URL = (_env.VITE_API_BASE_URL as string) || (_env.VITE_API_URL as string) || '/api';