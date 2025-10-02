// lib/url/parse-pagination.ts
export type SP = Record<string, string | string[] | undefined>;

const toInt = (v: string | string[] | undefined, d: number) => {
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export function parsePagination(
  sp: SP,
  { defaultPer = 12, cap = 100 }: { defaultPer?: number; cap?: number } = {}
) {
  const rawPage = toInt(sp.page, 1);
  const per     = Math.min(cap, toInt(sp.per, defaultPer));
  return { rawPage, per };
}

export function clampPage(total: number, per: number, rawPage: number) {
  const last = Math.max(1, Math.ceil(total / per));
  const page = Math.min(Math.max(rawPage, 1), last);
  return { page, last };
}
