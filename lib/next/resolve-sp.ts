// lib/next/resolve-sp.ts
export const resolveSP = <T,>(v: T | Promise<T>): Promise<T> => Promise.resolve(v);
