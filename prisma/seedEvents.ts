// prisma/seed.ts
import { PrismaClient, EventStatus } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
 * CLI Flags
 * ========================= */
const args = new Set(process.argv.slice(2));
const HARD = args.has("--hard");
const RESET_VIEWS = args.has("--reset-views");

/* =========================
 * Utils
 * ========================= */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const makeRand = (seed = 20251016) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};
const rnd = makeRand(42);

const rint = (min: number, max: number) =>
  Math.floor(rnd() * (max - min + 1)) + min;

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rnd() * arr.length)];

const makeDateRange = () => {
  // antara -90 .. +120 hari dari hari ini
  const offset = rint(-90, 120);
  const dur = rint(2, 8); // 2–8 jam
  const start = new Date();
  start.setHours(10, 0, 0, 0);
  start.setDate(start.getDate() + offset);
  const end = new Date(start);
  end.setHours(end.getHours() + dur);
  return { startsAt: start, endsAt: end };
};

/* =========================
 * Cat Data
 * ========================= */
const CAT_TITLES = [
  "Cat Adoption Day",
  "Pameran Kucing Ras",
  "Cat Café Meetup",
  "Lomba Foto Kucing",
  "Cat Care Workshop",
  "Panggung Meong Talent",
  "Kelas Grooming Kucing",
  "Talkshow Dokter Hewan",
  "Bazaar Perlengkapan Kucing",
  "Rescue Cats Showcase",
  "Kitten Playdate",
  "Klinik Vaksin & Deworm",
  "Kucing & Anak: Edukasi",
  "Meow Market",
  "Cat Yoga Session",
  "Festival Kucing Nusantara",
  "Charity for Stray Cats",
  "Cat Trick Show",
  "Kucing Senior Day",
  "Pameran Foto Rescue",
] as const;

const PLACES = [
  "Cat Café Purrfect, Jakarta",
  "Hall Pameran Felinus, Bandung",
  "Cattery Expo Center, Surabaya",
  "Meow Hub, Yogyakarta",
  "Paw Plaza, Semarang",
  "Rescue Shelter, Depok",
  "Pet Park, Tangerang",
  "Community Space, Bekasi",
  "Cat Lounge, Malang",
  "Event Hall, Denpasar",
] as const;

/** Deskripsi panjang (dipilih acak & bisa digabung) */
const DESCS_LONG = [
  `Sebuah perayaan bagi para pecinta kucing dari berbagai komunitas. Di acara ini kamu bisa bertemu
  langsung dengan kucing-kucing rescue yang siap diadopsi, mengikuti sesi tanya jawab seputar kesehatan,
  nutrisi, dan perilaku kucing, serta melihat demo grooming dasar yang bisa langsung dipraktikkan di rumah.
  Tersedia area edukasi anak agar si kecil belajar menyayangi hewan dengan cara yang aman dan menyenangkan.
  Setiap pengunjung mendapatkan lembar panduan perawatan kucing yang disusun bersama dokter hewan mitra.`,

  `Rangkaian kegiatan kami mencakup kelas singkat pengenalan ras, booth pemeriksaan kesehatan ringan,
  hingga konsultasi perilaku untuk membantu kamu memahami kebutuhan kucing di lingkungan rumah.
  Ada pula zona fotobooth bertema—silakan abadikan momen bersama si meong favorit dengan properti lucu.
  Pengunjung juga bisa mengeksplor bazaar yang menghadirkan produk lokal: makanan, pasir, mainan interaktif,
  furnitur kucing modular, dan aksesoris custom yang seluruhnya dikurasi ketat.`,

  `Bersama relawan dari komunitas rescue, kami memfasilitasi sesi adopsi yang bertanggung jawab.
  Tim akan memandu proses screening, edukasi pasca-adopsi, dan rencana vaksinasi lanjutan.
  Untuk kamu yang belum siap mengadopsi, tersedia opsi foster jangka pendek dan kanal donasi transparan
  yang dapat ditelusuri. Setiap kontribusi akan dilaporkan berkala dan disalurkan untuk kebutuhan pakan,
  perawatan, serta program sterilisasi.`,

  `Selain panggung utama yang menampilkan Cat Walk & Trick Show, pengunjung dapat mengikuti workshop
  enrichment yang membahas cara membuat mainan DIY dari bahan sederhana di rumah.
  Ada juga sesi sosialisasi antar-kucing yang diawasi handler—cocok buat pemilik yang ingin mengenalkan
  kucing rumahan ke lingkungan baru secara bertahap. Seluruh area dilengkapi stasiun sanitasi,
  signage ramah hewan, serta tim kebersihan siaga agar acara nyaman untuk semua.`,

  `Kami menerapkan kebijakan “Fear Free” selama kegiatan: tidak ada pemaksaan interaksi, tidak ada flash
  foto yang mengganggu, dan setiap kucing memiliki ruang istirahat sendiri. Pengunjung dianjurkan membawa
  carrier saat datang bersama kucing peliharaan. Staff akan membantu proses registrasi hewan, pengecekan
  vaksin dasar, dan pembagian tag identifikasi agar interaksi tetap aman dan terstruktur.`,
] as const;

const CAT_PHOTOS: readonly string[] = [
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
  "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb",
  "https://images.unsplash.com/photo-1529778873920-4da4926a72c2",
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
  "https://images.unsplash.com/photo-1543852786-1ab9d1b2c606",
  "https://images.unsplash.com/photo-1544654201-90b3797d2a9b",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
  "https://images.unsplash.com/photo-1494256997604-768d1f608cac",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
  "https://images.unsplash.com/photo-1516383607781-913a19294fd1",
  "https://images.unsplash.com/photo-1472491235688-bdc81a63246e",
  "https://images.unsplash.com/photo-1518020261026-011a67d1000e",
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
] as const;

/** Selalu mengembalikan 3–5 foto unik, dengan fallback jika sesuatu gagal */
const takeCatPhotos = (): string[] => {
  const howMany = rint(3, 5);
  const pool = [...CAT_PHOTOS];
  const out: string[] = [];
  for (let i = 0; i < howMany && pool.length; i++) {
    const idx = Math.floor(rnd() * pool.length);
    const item = pool.splice(idx, 1)[0];
    out.push(`${item}?auto=format&fit=crop&w=1280&q=80`);
  }
  if (out.length === 0) {
    // Fallback super-aman (nyaris tidak kepakai, tapi untuk jaga-jaga)
    out.push(`${CAT_PHOTOS[0]}?auto=format&fit=crop&w=1280&q=80`);
  }
  return out;
};

const STATUSES: readonly EventStatus[] = [
  EventStatus.published,
  EventStatus.published,
  EventStatus.published, // lebih sering published
  EventStatus.draft,
  EventStatus.archived,
];

/* =========================
 * Seed Helpers
 * ========================= */
const buildLongDescription = (): string => {
  // Gabungkan 2–3 paragraf acak menjadi satu deskripsi panjang
  const count = rint(2, 3);
  const chosen: string[] = [];
  const pool = [...DESCS_LONG];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(rnd() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  // Rapikan spasi
  return chosen
    .map((p) => p.replace(/\s+/g, " ").trim())
    .join("\n\n");
};

const buildRecords = (length = 50) =>
  Array.from({ length }).map((_, i) => {
    const baseTitle = pick(CAT_TITLES);
    const title = `${baseTitle} #${i + 1}`;
    const slug = `${slugify(baseTitle)}-${i + 1}`;
    const { startsAt, endsAt } = makeDateRange();
    const status = pick(STATUSES);
    return {
      title,
      slug,
      description: buildLongDescription(), // ⬅️ panjang & informatif
      location: pick(PLACES),
      startsAt,
      endsAt,
      photos: takeCatPhotos(),             // ⬅️ minimal 3 foto
      status,
      viewsTotal: 0,                       // ⬅️ selalu 0
      createdById: null as string | null,
    };
  });

/* =========================
 * Main
 * ========================= */
async function main(): Promise<void> {
  if (HARD) {
    const del = await prisma.event.deleteMany({});
    console.log(`🧹 Deleted ${del.count} events (hard mode).`);

    const records = buildRecords(50);
    await prisma.event.createMany({ data: records });
    const count = await prisma.event.count();
    console.log(`✅ Hard seed selesai. Total event sekarang: ${count}`);
    return;
  }

  if (RESET_VIEWS) {
    const res = await prisma.event.updateMany({ data: { viewsTotal: 0 } });
    console.log(`🔁 Reset viewsTotal ke 0 untuk ${res.count} event (reset-views mode).`);
    return;
  }

  const records = buildRecords(50);
  await prisma.event.createMany({
    data: records,
    skipDuplicates: true,
  });
  const count = await prisma.event.count();
  console.log(`✅ Soft seed selesai. Total event sekarang: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
