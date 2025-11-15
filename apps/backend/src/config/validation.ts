export const MIN_PASSWORD_LENGTH = Number(process.env.MIN_PASSWORD_LENGTH) || 6;
export const MAX_TITLE_LENGTH = Number(process.env.MAX_TITLE_LENGTH) || 300;
export const MAX_SUMMARY_LENGTH = Number(process.env.MAX_SUMMARY_LENGTH) || 1000;
export const MAX_CONTENT_LENGTH = Number(process.env.MAX_CONTENT_LENGTH) || 20000;

export function ensurePositiveInt(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}
