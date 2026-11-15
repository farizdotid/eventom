// Dummy data for the dashboard. Replace with real queries later.

export const demoEvent = {
  name: "Workshop UI/UX Batch 3",
  status: "Berlangsung",
  registrationUrl: "eventom.id/uiux-batch-3",
};

export const demoAdmin = {
  name: "Rina Anggraini",
  role: "Event Admin",
};

export const demoRegistrants = {
  count: 248,
  quota: 300,
  weekly: 18,
  spark: [4, 6, 5, 7, 6, 9, 8, 10, 9, 12, 11, 13],
};

export const demoAttendance = {
  rate: 75,
  segments: [
    { name: "Hadir tepat waktu", value: 158, color: "#3EC6F0" },
    { name: "Terlambat", value: 28, color: "#C9B6FF" },
    { name: "Belum scan", value: 62, color: "#ECE9F5" },
  ],
};

export const demoCertificate = {
  issued: 142,
  eligible: 186,
  template: "Modern Lilac",
  signatures: 2,
};

export const demoCheckins = [
  { id: 1, name: "Salsa Lestari", org: "Tokopedia", time: "09:40", status: "Terlambat" },
  { id: 2, name: "Nabila Maharani", org: "Pemprov Jawa Barat", time: "09:26", status: "Terlambat" },
  { id: 3, name: "Reza Hidayat", org: "Agensi Kreatif Rupa", time: "09:19", status: "Terlambat" },
  { id: 4, name: "Dewi Putri", org: "Binus University", time: "09:12", status: "Terlambat" },
  { id: 5, name: "Wahyu Ramadhan", org: "Bank Mandiri", time: "09:07", status: "Terlambat" },
];

export type LandingTheme = "lilac" | "koral" | "teal";

export type LandingData = {
  theme: LandingTheme;
  event: {
    name: string;
    tagline: string;
    date: string;
    startTime: string;
    endTime: string;
    format: string;
    location: string;
  };
  about: { description: string; learn: string };
  speaker: { name: string; role: string; bio: string };
  agenda: { id: number; start: string; end: string; title: string }[];
  registration: {
    price: string;
    quota: number;
    deadline: string;
    cta: string;
    whatsapp: string;
  };
  fields: { whatsapp: boolean; institution: boolean; job: boolean };
  sections: { quota: boolean; countdown: boolean; agenda: boolean; speaker: boolean };
};

export const LANDING_THEMES: { id: LandingTheme; label: string; accent: string; soft: string }[] = [
  { id: "lilac", label: "Lilac", accent: "#6D4AFF", soft: "#F1EAFF" },
  { id: "koral", label: "Koral", accent: "#F2685A", soft: "#FDECE9" },
  { id: "teal", label: "Teal", accent: "#1EB5A8", soft: "#E3F7F4" },
];

export const demoLanding: LandingData = {
  theme: "lilac",
  event: {
    name: "Workshop UI/UX Batch 3",
    tagline:
      "Sehari penuh belajar riset pengguna, wireframing, dan prototyping bersama praktisi industri.",
    date: "2026-10-29",
    startTime: "08:30",
    endTime: "16:00",
    format: "Offline",
    location: "Jogja Digital Valley, Yogyakarta",
  },
  about: {
    description:
      "Workshop intensif untuk mahasiswa, fresh graduate, dan profesional yang ingin memulai karier di bidang desain produk. Peserta akan mengerjakan studi kasus nyata dari awal hingga prototipe.",
    learn: [
      "Dasar riset pengguna dan wawancara",
      "Menyusun user flow dan wireframe",
      "Membuat prototipe interaktif di Figma",
      "Presentasi hasil dan sesi feedback",
    ].join("\n"),
  },
  speaker: {
    name: "Dimas Prasetyo",
    role: "Lead Product Designer, Tokopedia",
    bio: "Delapan tahun merancang produk digital untuk e-commerce dan fintech.",
  },
  agenda: [
    { id: 1, start: "08:30", end: "09:00", title: "Registrasi & presensi QR" },
    { id: 2, start: "09:00", end: "11:30", title: "Sesi 1: Riset pengguna" },
    { id: 3, start: "12:30", end: "15:00", title: "Sesi 2: Wireframe & prototipe" },
    { id: 4, start: "15:00", end: "16:00", title: "Presentasi & penutupan" },
  ],
  registration: {
    price: "Gratis",
    quota: 300,
    deadline: "2026-10-27",
    cta: "Daftar Sekarang",
    whatsapp: "0812-2345-6789",
  },
  fields: { whatsapp: true, institution: true, job: false },
  sections: { quota: true, countdown: true, agenda: true, speaker: true },
};

export type ParticipantStatus = "Hadir" | "Terlambat" | "Belum hadir";

export type Participant = {
  id: number;
  name: string;
  email: string;
  org: string;
  code: string;
  phone: string;
  registeredAt: string;
  checkedInAt: string | null;
  status: ParticipantStatus;
};

const PARTICIPANT_NAMES: [string, string][] = [
  ["Bagas", "Saputra"], ["Nadia", "Anjani"], ["Fajar", "Firmansyah"],
  ["Laras", "Lestari"], ["Yoga", "Santoso"], ["Citra", "Maharani"],
  ["Rizky", "Wijaya"], ["Dewi", "Putri"], ["Ahmad", "Fauzi"],
  ["Putri", "Kartika"], ["Salsa", "Anggraini"], ["Reza", "Hidayat"],
  ["Nabila", "Rahmawati"], ["Wahyu", "Ramadhan"], ["Intan", "Permatasari"],
  ["Dimas", "Pratama"], ["Ayu", "Safitri"], ["Bayu", "Nugroho"],
  ["Maya", "Sari"], ["Fikri", "Maulana"], ["Rani", "Oktaviani"],
  ["Galih", "Prakoso"], ["Sinta", "Wulandari"], ["Arif", "Setiawan"],
];

const PARTICIPANT_ORGS = [
  "Universitas Gadjah Mada", "ITB", "Agensi Kreatif Rupa",
  "Universitas Indonesia", "Universitas Brawijaya", "PT Telkom Indonesia",
  "Bank Mandiri", "Binus University", "Startup Kopi Kita",
  "Pemprov Jawa Barat", "Tokopedia", "Universitas Airlangga",
];

const ABSENT_ROWS = new Set([3, 8, 13, 18, 23, 28, 33, 38, 43]);
const LATE_ROWS = new Set([0, 5, 10, 15, 20, 25]);

const pad = (value: number) => String(value).padStart(2, "0");

export const demoParticipants: Participant[] = Array.from(
  { length: 48 },
  (_, i) => {
    const [first, last] = PARTICIPANT_NAMES[i % PARTICIPANT_NAMES.length];
    const suffix = i < PARTICIPANT_NAMES.length ? "" : " Putra";
    const name = `${first} ${last}${suffix}`;
    const registeredAt = new Date(Date.UTC(2026, 9, 1) + i * 9 * 3_600_000);
    const status: ParticipantStatus = ABSENT_ROWS.has(i)
      ? "Belum hadir"
      : LATE_ROWS.has(i)
        ? "Terlambat"
        : "Hadir";

    return {
      id: i + 1,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${suffix ? "2" : ""}@mail.com`,
      org: PARTICIPANT_ORGS[i % PARTICIPANT_ORGS.length],
      code: `UX3-${(i * 997 + 3127).toString(36).toUpperCase().padStart(4, "0")}`,
      phone: `0812-${1000 + i * 37}-${1000 + i * 53}`,
      registeredAt: registeredAt.toISOString(),
      checkedInAt:
        status === "Belum hadir"
          ? null
          : status === "Terlambat"
            ? `09:${pad(5 + Math.floor(i / 5) * 6)}`
            : `08:${pad(10 + (i * 7) % 45)}`,
      status,
    };
  },
);

export const demoEnrollment = [
  { day: "16", total: 5 },
  { day: "17", total: 8 },
  { day: "18", total: 6 },
  { day: "19", total: 12 },
  { day: "20", total: 11 },
  { day: "21", total: 14 },
  { day: "22", total: 9 },
  { day: "23", total: 11 },
  { day: "24", total: 16 },
  { day: "25", total: 12 },
  { day: "26", total: 18 },
  { day: "27", total: 22 },
  { day: "28", total: 21 },
  { day: "29", total: 27 },
];
