// lib/eventCalendar/constants.ts

/** Locale default untuk kalender */
export const ID_LOCALE = "id-ID" as const;

/** ——— SUPER COMPACT SIZING ——— */
export const CELL_H     = "h-7 sm:h-8";                  // ~28–32px tinggi cell
export const DOT        = "h-1 w-1";                     // titik mini
export const DAY_TEXT   = "text-[10.5px] sm:text-[11px]"; // angka hari
export const HEADER_TEXT  = "text-[12px]";               // judul bulan
export const WEEKDAY_TEXT = "text-[9.5px] sm:text-[10px]"; // header hari

/** Batas jumlah dot status yang ditampilkan per sel */
export const MAX_STATUS_DOTS = 3 as const;

/** Label singkat hari (Senin dimulai) */
export const WEEKDAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;
export type WeekdayShort = typeof WEEKDAYS_ID[number];
