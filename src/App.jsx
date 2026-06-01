
import React, { useMemo, useState } from "react";
import {
  Award,
  AlertTriangle,
  BarChart3,
  Bot,
  BrainCircuit,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Copy,
  Download,
  Database,
  FileSpreadsheet,
  FileText,
  FileQuestion,
  FolderOpen,
  UploadCloud,
  FileVideo,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  UserRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Menu,
  MessageCircle,
  PenLine,
  Save,
  PlusCircle,
  School,
  Sparkles,
  Star,
  Wand2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";
const DRIVE_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || "1k9jWQRu0JhdgFkH9WtPK63txki0iUI89";
const DRIVE_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;

const subjects = [
  "Matematika",
  "Bahasa Indonesia",
  "Pendidikan Pancasila",
  "IPAS",
  "Bahasa Inggris",
  "Bahasa Makassar",
  "Seni",
  "Koding dan Kecerdasan Artifisial",
];

const tkaSubjects = ["TKA Matematika", "TKA Bahasa Indonesia"];

const aiTypes = [
  { value: "modul_ajar", label: "Modul Ajar", icon: FileText },
  { value: "lkpd", label: "LKPD", icon: PenLine },
  { value: "soal", label: "Soal-Soal", icon: FileQuestion },
  { value: "kuis", label: "Kuis", icon: ListChecks },
  { value: "tka", label: "Latihan TKA", icon: BrainCircuit },
  { value: "rubrik", label: "Rubrik Penilaian", icon: Award },
  { value: "remedial_pengayaan", label: "Remedial & Pengayaan", icon: Sparkles },
  { value: "catatan_rapor", label: "Catatan Rapor", icon: MessageCircle },
];

const navItems = [
  ["Beranda", "#beranda"],
  ["Fitur", "#fitur"],
  ["Akses", "#akses"],
  ["LMS TKA", "#lms-tka"],
  ["AI Guru", "#ai-guru"],
  ["Input Data", "#input"],
  ["Nilai", "#nilai"],
  ["Kursus", "#kursus"],
  ["Drive", "#drive"],
];

// Dipakai khusus untuk header desktop agar menu benar-benar ringkas di sebelah kanan.
// Menu Drive tidak ditampilkan dua kali karena sudah ada tombol Buka Drive.
const desktopNavItems = navItems.filter(([label]) => label !== "Drive");

const demoUsers = [
  {
    id: "ADM-001",
    nama: "La Ode Supriono, S.Pd., M.Pd.",
    username: "admin",
    password: "Admin@2026",
    role: "Admin",
    kelas: "Semua Kelas",
    anak: "-",
    deskripsi: "Akses penuh untuk mengelola LMS, data siswa, nilai, absensi, kursus, AI, dan Drive.",
  },
  {
    id: "SIS-001",
    nama: "Siswa Demo 1",
    username: "siswa001",
    password: "Siswa@001",
    role: "Siswa",
    kelas: "VI.C",
    anak: "-",
    deskripsi: "Akses materi, LMS TKA, bank soal, kuis, pengumuman, dan nilai pribadi.",
  },
  {
    id: "SIS-002",
    nama: "Siswa Demo 2",
    username: "siswa002",
    password: "Siswa@002",
    role: "Siswa",
    kelas: "VI.C",
    anak: "-",
    deskripsi: "Akses materi, LMS TKA, bank soal, kuis, pengumuman, dan nilai pribadi.",
  },
  {
    id: "ORT-001",
    nama: "Orang Tua Siswa Demo 1",
    username: "ortu001",
    password: "Ortu@001",
    role: "Orang Tua",
    kelas: "VI.C",
    anak: "Siswa Demo 1",
    deskripsi: "Akses pantauan nilai, absensi, catatan guru, dan pengumuman kelas.",
  },
  {
    id: "ORT-002",
    nama: "Orang Tua Siswa Demo 2",
    username: "ortu002",
    password: "Ortu@002",
    role: "Orang Tua",
    kelas: "VI.C",
    anak: "Siswa Demo 2",
    deskripsi: "Akses pantauan nilai, absensi, catatan guru, dan pengumuman kelas.",
  },
  {
    id: "KRS-001",
    nama: "Peserta Kursus Demo 1",
    username: "kursus001",
    password: "Kursus@001",
    role: "Peserta Kursus",
    kelas: "Umum",
    anak: "-",
    deskripsi: "Akses materi kursus Matematika, jadwal pertemuan, latihan, dan kuis kursus.",
  },
];

const roleMenus = {
  Admin: [
    "Kelola data siswa",
    "Input absensi dan nilai",
    "Upload materi LMS TKA",
    "Kelola bank soal dan kuis",
    "Gunakan AI Asisten Guru",
    "Atur materi kursus custom",
    "Simpan data ke Google Sheets/Drive",
  ],
  Siswa: [
    "Akses materi TKA Matematika",
    "Akses materi TKA Bahasa Indonesia",
    "Kerjakan kuis dan bank soal",
    "Lihat tugas dan pengumuman",
    "Pantau nilai pribadi",
  ],
  "Orang Tua": [
    "Pantau nilai anak",
    "Pantau absensi anak",
    "Lihat catatan guru",
    "Lihat pengumuman kelas",
    "Ikuti perkembangan belajar anak",
  ],
  "Peserta Kursus": [
    "Akses materi kursus Matematika",
    "Lihat jadwal pertemuan",
    "Kerjakan latihan dan kuis",
    "Lihat evaluasi kursus",
    "Akses sertifikat jika selesai",
  ],
};

function getRoleIcon(role) {
  if (role === "Admin") return ShieldCheck;
  if (role === "Siswa") return GraduationCap;
  if (role === "Orang Tua") return Users;
  return BookOpen;
}

function saveLocal(key, data) {
  const old = JSON.parse(localStorage.getItem(key) || "[]");
  const updated = [{ ...data, createdAt: new Date().toISOString() }, ...old].slice(0, 10);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}

async function sendToAppsScript(type, payload) {
  if (!API_URL) {
    return { ok: false, message: "URL Apps Script belum dipasang. Data tersimpan sementara di browser." };
  }
  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ type, payload }),
    });
    return { ok: true, message: "Data dikirim ke database Google Sheets. Silakan cek sheet terkait." };
  } catch (error) {
    return { ok: false, message: "Koneksi ke Apps Script belum berhasil. Data tetap tersimpan sementara di browser." };
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5",
    secondary:
      "bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5",
    dark:
      "bg-slate-950 text-white shadow-lg shadow-slate-300 hover:bg-slate-800 hover:-translate-y-0.5",
    soft:
      "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 hover:bg-emerald-100",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition-all focus:outline-none focus:ring-4 focus:ring-emerald-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon = Sparkles, label, title, desc }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-100">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{desc}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      {...props}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      {...props}
    >
      {children}
    </select>
  );
}

function Textarea(props) {
  return (
    <textarea
      className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      {...props}
    />
  );
}

function StatusAlert({ status }) {
  if (!status) return null;
  return (
    <div
      className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${
        status.ok ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
      }`}
    >
      {status.message}
    </div>
  );
}

function StudentForm() {
  const [form, setForm] = useState({
    nama: "",
    nisn: "",
    kelas: "",
    jk: "Laki-laki",
    orangTua: "",
    wa: "",
    status: "Aktif",
    catatan: "",
  });
  const [status, setStatus] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.nama.trim()) {
      setStatus({ ok: false, message: "Nama siswa wajib diisi." });
      return;
    }
    saveLocal("rbplo_data_siswa", form);
    const res = await sendToAppsScript("data_siswa", form);
    setStatus(res);
    setForm({ nama: "", nisn: "", kelas: "", jk: "Laki-laki", orangTua: "", wa: "", status: "Aktif", catatan: "" });
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-emerald-100">
          <UserPlus className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">Input Manual Data Siswa</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Cocok untuk tahun ajaran baru. Data dapat dikirim ke sheet <b>DATA_SISWA</b> atau disimpan sementara bila backend belum dipasang.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Nama Siswa"><Input value={form.nama} onChange={set("nama")} placeholder="Nama lengkap siswa" /></Field>
        <Field label="NISN/NIS"><Input value={form.nisn} onChange={set("nisn")} placeholder="Opsional" /></Field>
        <Field label="Kelas"><Input value={form.kelas} onChange={set("kelas")} placeholder="Contoh: VI.C" /></Field>
        <Field label="Jenis Kelamin">
          <Select value={form.jk} onChange={set("jk")}><option>Laki-laki</option><option>Perempuan</option></Select>
        </Field>
        <Field label="Nama Orang Tua/Wali"><Input value={form.orangTua} onChange={set("orangTua")} placeholder="Nama orang tua/wali" /></Field>
        <Field label="No. WA Orang Tua"><Input value={form.wa} onChange={set("wa")} placeholder="08xxxxxxxxxx" /></Field>
        <Field label="Status">
          <Select value={form.status} onChange={set("status")}><option>Aktif</option><option>Pindah</option><option>Lulus</option><option>Nonaktif</option></Select>
        </Field>
        <Field label="Catatan"><Input value={form.catatan} onChange={set("catatan")} placeholder="Catatan singkat" /></Field>
        <div className="md:col-span-2"><Button className="w-full"><PlusCircle className="h-5 w-5" /> Simpan Data Siswa</Button></div>
      </form>
      <StatusAlert status={status} />
    </Card>
  );
}

function GradeForm() {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    nama: "",
    kelas: "",
    semester: "Ganjil",
    mapel: "Matematika",
    jenisNilai: "Sumatif",
    nilai: "",
    keterangan: "",
  });
  const [status, setStatus] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.nama.trim() || form.nilai === "") {
      setStatus({ ok: false, message: "Nama siswa dan nilai wajib diisi." });
      return;
    }
    saveLocal("rbplo_input_nilai", form);
    const res = await sendToAppsScript("input_nilai", form);
    setStatus(res);
    setForm((f) => ({ ...f, nama: "", nilai: "", keterangan: "" }));
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-100">
          <BarChart3 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">Input Nilai Per Mapel</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mendukung 8 mata pelajaran utama dan 2 nilai TKA. Data masuk ke sheet <b>INPUT_NILAI</b>.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Tanggal"><Input type="date" value={form.tanggal} onChange={set("tanggal")} /></Field>
        <Field label="Nama Siswa"><Input value={form.nama} onChange={set("nama")} placeholder="Nama siswa" /></Field>
        <Field label="Kelas"><Input value={form.kelas} onChange={set("kelas")} placeholder="Contoh: VI.C" /></Field>
        <Field label="Semester">
          <Select value={form.semester} onChange={set("semester")}><option>Ganjil</option><option>Genap</option></Select>
        </Field>
        <Field label="Mata Pelajaran">
          <Select value={form.mapel} onChange={set("mapel")}>
            {[...subjects, ...tkaSubjects].map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Jenis Nilai">
          <Select value={form.jenisNilai} onChange={set("jenisNilai")}>
            {["Tugas","Formatif","Sumatif","Praktik","Proyek","TKA","Remedial","Pengayaan"].map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Nilai"><Input type="number" min="0" max="100" value={form.nilai} onChange={set("nilai")} placeholder="0-100" /></Field>
        <Field label="Keterangan"><Input value={form.keterangan} onChange={set("keterangan")} placeholder="Opsional" /></Field>
        <div className="md:col-span-2"><Button className="w-full"><PenLine className="h-5 w-5" /> Simpan Nilai</Button></div>
      </form>
      <StatusAlert status={status} />
    </Card>
  );
}

function CourseMeetingForm() {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    pertemuanKe: "1",
    paket: "Paket Dasar",
    topik: "",
    tujuan: "",
    aktivitas: "",
    tugas: "",
    link: "",
    status: "Rencana",
  });
  const [status, setStatus] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.topik.trim()) {
      setStatus({ ok: false, message: "Topik/materi pertemuan wajib diisi." });
      return;
    }
    saveLocal("rbplo_pertemuan_kursus", form);
    const res = await sendToAppsScript("pertemuan_kursus", form);
    setStatus(res);
    setForm((f) => ({ ...f, topik: "", tujuan: "", aktivitas: "", tugas: "", link: "" }));
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 ring-1 ring-sky-100">
          <CalendarDays className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">Atur Materi Kursus Custom</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bapak dapat menentukan sendiri materi setiap pertemuan, tujuan belajar, aktivitas, tugas, dan link materi.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Tanggal"><Input type="date" value={form.tanggal} onChange={set("tanggal")} /></Field>
        <Field label="Pertemuan Ke"><Input type="number" min="1" value={form.pertemuanKe} onChange={set("pertemuanKe")} /></Field>
        <Field label="Paket Kursus">
          <Select value={form.paket} onChange={set("paket")}>
            <option>Paket Dasar</option>
            <option>Paket Intensif</option>
            <option>Paket Persiapan Ujian</option>
            <option>Private Custom</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set("status")}><option>Rencana</option><option>Sudah Diajarkan</option><option>Ditunda</option><option>Revisi</option></Select>
        </Field>
        <div className="md:col-span-2"><Field label="Topik/Materi Custom"><Input value={form.topik} onChange={set("topik")} placeholder="Contoh: Soal cerita pecahan dan strategi penyelesaian" /></Field></div>
        <Field label="Tujuan Pembelajaran"><Textarea value={form.tujuan} onChange={set("tujuan")} placeholder="Tujuan yang ingin dicapai peserta" /></Field>
        <Field label="Aktivitas Belajar"><Textarea value={form.aktivitas} onChange={set("aktivitas")} placeholder="Pembukaan, latihan, diskusi, evaluasi..." /></Field>
        <Field label="Tugas/Latihan"><Textarea value={form.tugas} onChange={set("tugas")} placeholder="Latihan yang diberikan" /></Field>
        <Field label="Link Materi"><Textarea value={form.link} onChange={set("link")} placeholder="Link Google Drive, YouTube, Google Form, dll." /></Field>
        <div className="md:col-span-2"><Button className="w-full"><BookOpen className="h-5 w-5" /> Simpan Rencana Pertemuan</Button></div>
      </form>
      <StatusAlert status={status} />
    </Card>
  );
}


function TkaMaterialForm() {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    mapel: "TKA Matematika",
    jenis: "PDF",
    pertemuanKe: "1",
    judul: "",
    deskripsi: "",
    linkYoutube: "",
    linkDrive: "",
    status: "Aktif",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.judul.trim()) {
      setStatus({ ok: false, message: "Judul materi wajib diisi." });
      return;
    }
    let filePayload = null;
    if (file) {
      filePayload = {
        name: file.name,
        type: file.type || "application/pdf",
        base64: await fileToBase64(file),
      };
    }
    const payload = { ...form, file: filePayload, fileName: file?.name || "" };
    saveLocal("rbplo_lms_tka_materi", { ...form, fileName: file?.name || "" });
    const res = await sendToAppsScript("lms_tka_materi", payload);
    setStatus(res);
    setForm((f) => ({ ...f, judul: "", deskripsi: "", linkYoutube: "", linkDrive: "" }));
    setFile(null);
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-emerald-100">
          <UploadCloud className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">Upload Materi TKA</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Unggah metadata materi PDF, tempel link YouTube, atau link file Google Drive untuk pembelajaran TKA Matematika dan Bahasa Indonesia.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Tanggal"><Input type="date" value={form.tanggal} onChange={set("tanggal")} /></Field>
        <Field label="Mapel TKA">
          <Select value={form.mapel} onChange={set("mapel")}><option>TKA Matematika</option><option>TKA Bahasa Indonesia</option></Select>
        </Field>
        <Field label="Jenis Materi">
          <Select value={form.jenis} onChange={set("jenis")}><option>PDF</option><option>Link YouTube</option><option>Link Google Drive</option><option>Slide/Presentasi</option><option>Modul Latihan</option></Select>
        </Field>
        <Field label="Pertemuan Ke"><Input type="number" min="1" value={form.pertemuanKe} onChange={set("pertemuanKe")} /></Field>
        <div className="md:col-span-2"><Field label="Judul Materi"><Input value={form.judul} onChange={set("judul")} placeholder="Contoh: Strategi Menjawab Soal Cerita TKA Matematika" /></Field></div>
        <Field label="Deskripsi Materi"><Textarea value={form.deskripsi} onChange={set("deskripsi")} placeholder="Ringkasan isi materi dan tujuan belajar" /></Field>
        <Field label="Upload PDF Opsional">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" />
          {file && <p className="mt-2 text-xs font-bold text-emerald-700">File dipilih: {file.name}</p>}
        </Field>
        <Field label="Link YouTube"><Input value={form.linkYoutube} onChange={set("linkYoutube")} placeholder="https://youtube.com/..." /></Field>
        <Field label="Link Google Drive/PDF"><Input value={form.linkDrive} onChange={set("linkDrive")} placeholder="https://drive.google.com/..." /></Field>
        <div className="md:col-span-2"><Button className="w-full"><UploadCloud className="h-5 w-5" /> Simpan Materi TKA</Button></div>
      </form>
      <StatusAlert status={status} />
    </Card>
  );
}

function TkaQuizBankForm() {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    jenisKonten: "Bank Soal",
    judulKuis: "",
    mapel: "TKA Matematika",
    level: "Sedang",
    bentukSoal: "Pilihan Ganda",
    soal: "",
    pilihanA: "",
    pilihanB: "",
    pilihanC: "",
    pilihanD: "",
    kunci: "A",
    pembahasan: "",
    deadline: "",
    status: "Aktif",
  });
  const [status, setStatus] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.soal.trim()) {
      setStatus({ ok: false, message: "Isi soal wajib diisi." });
      return;
    }
    saveLocal("rbplo_lms_tka_soal", form);
    const type = form.jenisKonten === "Kuis" ? "kuis_tka" : "bank_soal_tka";
    const res = await sendToAppsScript(type, form);
    setStatus(res);
    setForm((f) => ({ ...f, soal: "", pilihanA: "", pilihanB: "", pilihanC: "", pilihanD: "", pembahasan: "" }));
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-100">
          <FileQuestion className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">Bank Soal & Kuis TKA</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Buat soal latihan atau kuis untuk menguji pemahaman siswa setelah belajar materi TKA.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Jenis Konten"><Select value={form.jenisKonten} onChange={set("jenisKonten")}><option>Bank Soal</option><option>Kuis</option></Select></Field>
        <Field label="Mapel TKA"><Select value={form.mapel} onChange={set("mapel")}><option>TKA Matematika</option><option>TKA Bahasa Indonesia</option></Select></Field>
        <Field label="Judul Kuis/Topik"><Input value={form.judulKuis} onChange={set("judulKuis")} placeholder="Contoh: Kuis Pecahan TKA" /></Field>
        <Field label="Level"><Select value={form.level} onChange={set("level")}><option>Mudah</option><option>Sedang</option><option>Sulit</option><option>HOTS</option></Select></Field>
        <Field label="Bentuk Soal"><Select value={form.bentukSoal} onChange={set("bentukSoal")}><option>Pilihan Ganda</option><option>Isian</option><option>Uraian</option><option>Benar/Salah</option></Select></Field>
        <Field label="Deadline Kuis"><Input type="date" value={form.deadline} onChange={set("deadline")} /></Field>
        <div className="md:col-span-2"><Field label="Isi Soal"><Textarea value={form.soal} onChange={set("soal")} placeholder="Tulis soal di sini" /></Field></div>
        <Field label="Pilihan A"><Input value={form.pilihanA} onChange={set("pilihanA")} /></Field>
        <Field label="Pilihan B"><Input value={form.pilihanB} onChange={set("pilihanB")} /></Field>
        <Field label="Pilihan C"><Input value={form.pilihanC} onChange={set("pilihanC")} /></Field>
        <Field label="Pilihan D"><Input value={form.pilihanD} onChange={set("pilihanD")} /></Field>
        <Field label="Kunci Jawaban"><Input value={form.kunci} onChange={set("kunci")} placeholder="A/B/C/D atau jawaban singkat" /></Field>
        <Field label="Status"><Select value={form.status} onChange={set("status")}><option>Aktif</option><option>Draft</option><option>Arsip</option></Select></Field>
        <div className="md:col-span-2"><Field label="Pembahasan"><Textarea value={form.pembahasan} onChange={set("pembahasan")} placeholder="Pembahasan singkat agar siswa memahami cara menjawab" /></Field></div>
        <div className="md:col-span-2"><Button className="w-full"><FileQuestion className="h-5 w-5" /> Simpan Bank Soal/Kuis</Button></div>
      </form>
      <StatusAlert status={status} />
    </Card>
  );
}


function AiTeacherAssistant() {
  const [form, setForm] = useState({
    tipe: "modul_ajar",
    kelas: "6",
    semester: "Ganjil",
    mapel: "Matematika",
    materi: "",
    tujuan: "",
    jumlahSoal: "10",
    level: "Sedang",
    modelPembelajaran: "Problem Based Learning",
    durasi: "2 JP",
    catatan: "Gunakan bahasa Indonesia yang mudah dipahami siswa SD. Sertakan konteks pembelajaran di Kota Makassar jika relevan.",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const activeType = aiTypes.find((item) => item.value === form.tipe) || aiTypes[0];
  const ActiveIcon = activeType.icon;

  async function generate(e) {
    e.preventDefault();
    setStatus(null);
    if (!form.materi.trim()) {
      setStatus({ ok: false, message: "Materi/topik wajib diisi sebelum generate." });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/.netlify/functions/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "AI belum berhasil menghasilkan dokumen.");
      setResult(data.output || "");
      saveLocal("rbplo_ai_generator", { ...form, hasil: data.output || "" });
      setStatus({ ok: true, message: "AI berhasil membuat dokumen. Silakan tinjau sebelum digunakan kepada siswa." });
    } catch (err) {
      setStatus({ ok: false, message: err.message || "Terjadi kesalahan saat menghubungi AI." });
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setStatus({ ok: true, message: "Hasil AI sudah disalin ke clipboard." });
  }

  function downloadResult() {
    if (!result) return;
    const filename = `AI_${activeType.label.replaceAll(" ", "_")}_${form.mapel.replaceAll(" ", "_")}.txt`;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function saveToSheet() {
    if (!result) {
      setStatus({ ok: false, message: "Belum ada hasil AI untuk disimpan." });
      return;
    }
    const res = await sendToAppsScript("ai_generator", { ...form, hasil: result, jenisDokumen: activeType.label });
    setStatus(res);
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-emerald-100">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">AI Asisten Guru</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Generate Modul Ajar, LKPD, soal, kuis, latihan TKA, rubrik, remedial, pengayaan, dan catatan rapor. Hasil AI tetap perlu Bapak tinjau sebelum dipakai.
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-800 ring-1 ring-amber-100">
          API key aman di Netlify Function, tidak disimpan di browser siswa.
        </div>
      </div>

      <form onSubmit={generate} className="mt-8 grid gap-4 lg:grid-cols-2">
        <Field label="Jenis Dokumen AI">
          <Select value={form.tipe} onChange={set("tipe")}>
            {aiTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
        </Field>
        <Field label="Mata Pelajaran">
          <Select value={form.mapel} onChange={set("mapel")}>
            {[...subjects, ...tkaSubjects].map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Kelas"><Input value={form.kelas} onChange={set("kelas")} placeholder="Contoh: 6" /></Field>
        <Field label="Semester"><Select value={form.semester} onChange={set("semester")}><option>Ganjil</option><option>Genap</option></Select></Field>
        <Field label="Materi/Topik"><Input value={form.materi} onChange={set("materi")} placeholder="Contoh: Pecahan, ide pokok, teks informasi, soal TKA numerasi" /></Field>
        <Field label="Level"><Select value={form.level} onChange={set("level")}><option>Mudah</option><option>Sedang</option><option>Sulit</option><option>HOTS</option><option>Bertahap</option></Select></Field>
        <Field label="Jumlah Soal/Kegiatan"><Input type="number" min="1" max="50" value={form.jumlahSoal} onChange={set("jumlahSoal")} /></Field>
        <Field label="Durasi/Alokasi Waktu"><Input value={form.durasi} onChange={set("durasi")} placeholder="Contoh: 2 JP" /></Field>
        <Field label="Model Pembelajaran"><Input value={form.modelPembelajaran} onChange={set("modelPembelajaran")} placeholder="Contoh: PBL, Discovery Learning" /></Field>
        <Field label="Tujuan Pembelajaran"><Textarea value={form.tujuan} onChange={set("tujuan")} placeholder="Tulis tujuan pembelajaran, boleh singkat." /></Field>
        <div className="lg:col-span-2"><Field label="Catatan Khusus"><Textarea value={form.catatan} onChange={set("catatan")} placeholder="Misalnya: untuk siswa kelas 6, bahasa sederhana, sertakan kunci jawaban dan pembahasan." /></Field></div>
        <div className="lg:col-span-2">
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            {loading ? "Sedang Generate..." : `Generate ${activeType.label}`}
          </Button>
        </div>
      </form>

      <StatusAlert status={status} />

      <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-5 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3"><ActiveIcon className="h-6 w-6 text-emerald-300" /></div>
            <div>
              <p className="text-sm font-black text-emerald-300">Hasil Generate AI</p>
              <p className="text-xs text-slate-300">Salin, download TXT, atau simpan ke Google Sheets.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={copyResult} disabled={!result}><Copy className="h-4 w-4" /> Salin</Button>
            <Button type="button" variant="secondary" onClick={downloadResult} disabled={!result}><Download className="h-4 w-4" /> Download</Button>
            <Button type="button" variant="secondary" onClick={saveToSheet} disabled={!result}><Save className="h-4 w-4" /> Simpan</Button>
          </div>
        </div>
        <div className="mt-5 max-h-[520px] overflow-auto rounded-2xl bg-white p-5 text-slate-900 ring-1 ring-white/10">
          {result ? (
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 font-sans">{result}</pre>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900 ring-1 ring-amber-100">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" />
              <p className="text-sm font-bold leading-6">Hasil AI akan muncul di sini setelah Bapak menekan tombol Generate.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


function LoginModal({ open, onClose, onLogin }) {
  const [form, setForm] = useState({ username: "admin", password: "Admin@2026" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [quickRole, setQuickRole] = useState("Admin");

  if (!open) return null;

  function fillDemo(role) {
    const user = demoUsers.find((item) => item.role === role) || demoUsers[0];
    setQuickRole(role);
    setForm({ username: user.username, password: user.password });
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    const user = demoUsers.find(
      (item) => item.username.toLowerCase() === form.username.trim().toLowerCase() && item.password === form.password
    );
    if (!user) {
      setError("Username atau password belum sesuai. Coba pilih akun demo di bawah.");
      return;
    }
    const safeUser = { ...user };
    delete safeUser.password;
    localStorage.setItem("rbplo_current_user", JSON.stringify(safeUser));
    onLogin(safeUser);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black ring-1 ring-white/20">
                <LockKeyhole className="h-4 w-4" /> Login Multi-Role
              </div>
              <h3 className="mt-4 text-3xl font-black">Masuk RUANG BELAJAR PAK LA ODE</h3>
              <p className="mt-2 text-sm leading-7 text-emerald-50">
                Gunakan akun admin, siswa, orang tua, atau peserta kursus untuk melihat dashboard sesuai peran.
              </p>
            </div>
            <button onClick={onClose} className="rounded-2xl bg-white/10 p-2 hover:bg-white/20" aria-label="Tutup login">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Username"><Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} /></Field>
            <Field label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Tampilkan password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100">{error}</div>}
            <Button className="w-full"><LogIn className="h-5 w-5" /> Masuk</Button>
            <p className="text-xs leading-6 text-slate-500">
              Akun ini adalah login demo berbasis browser untuk tahap awal. Untuk data siswa asli, password sebaiknya nanti dihubungkan ke sistem login yang lebih aman.
            </p>
          </form>

          <div className="rounded-[1.5rem] bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-black text-slate-950">Pilih akun demo cepat</p>
            <div className="mt-4 grid gap-2">
              {["Admin", "Siswa", "Orang Tua", "Peserta Kursus"].map((role) => {
                const Icon = getRoleIcon(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => fillDemo(role)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black ring-1 transition ${
                      quickRole === role ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {role}</span>
                    <span className="text-xs opacity-80">Pakai</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessDashboard({ user, onLoginClick, onLogout }) {
  const displayedUsers = demoUsers.map(({ password, ...rest }) => rest);
  if (!user) {
    return (
      <section id="akses" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            icon={LockKeyhole}
            label="Login Multi-Role"
            title="Masuk sebagai admin, siswa, orang tua, atau peserta kursus"
            desc="Setiap peran memiliki tampilan dashboard dan akses fitur yang berbeda agar website lebih rapi dan aman digunakan."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="bg-slate-950 text-white">
              <LockKeyhole className="h-10 w-10 text-emerald-300" />
              <h3 className="mt-5 text-2xl font-black">Silakan login untuk membuka dashboard</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Admin dapat mengelola data, sedangkan siswa/orang tua/peserta kursus melihat fitur sesuai kebutuhannya.
              </p>
              <Button className="mt-6" variant="secondary" onClick={onLoginClick}><LogIn className="h-5 w-5" /> Buka Login</Button>
            </Card>
            <Card>
              <h3 className="text-2xl font-black text-slate-950">Akun Demo Awal</h3>
              <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <div className="grid grid-cols-4 bg-slate-100 px-4 py-3 text-xs font-black uppercase text-slate-500">
                  <span>Role</span><span>Username</span><span>Password</span><span>Nama</span>
                </div>
                {demoUsers.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 gap-2 border-t border-slate-200 px-4 py-3 text-xs font-bold text-slate-700">
                    <span>{item.role}</span><span>{item.username}</span><span>{item.password}</span><span>{item.nama}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const Icon = getRoleIcon(user.role);
  const menus = roleMenus[user.role] || [];
  return (
    <section id="akses" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          icon={Icon}
          label={`Dashboard ${user.role}`}
          title={`Selamat datang, ${user.nama}`}
          desc="Website akan menampilkan fitur sesuai peran akun yang sedang login."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
            <Icon className="h-12 w-12 text-amber-200" />
            <h3 className="mt-5 text-3xl font-black">{user.role}</h3>
            <div className="mt-5 space-y-3 text-sm font-bold text-emerald-50">
              <p>ID Akun: {user.id}</p>
              <p>Kelas: {user.kelas}</p>
              {user.anak !== "-" && <p>Nama Anak: {user.anak}</p>}
            </div>
            <Button className="mt-6" variant="secondary" onClick={onLogout}><LogOut className="h-5 w-5" /> Keluar</Button>
          </Card>
          <Card>
            <h3 className="text-2xl font-black text-slate-950">Hak Akses Akun</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{user.deskripsi}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {menus.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                  <CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-800 ring-1 ring-amber-100">
              Login demo ini tersimpan di browser. Untuk penggunaan resmi dengan data asli siswa, akun dapat dipindahkan ke Google Sheets/Firebase agar lebih aman dan mudah dikelola.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ProtectedCard({ allowed, title, desc, onLoginClick }) {
  if (allowed) return null;
  return (
    <Card className="bg-amber-50 ring-amber-100">
      <LockKeyhole className="h-9 w-9 text-amber-700" />
      <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{desc}</p>
      <Button className="mt-6" onClick={onLoginClick}><LogIn className="h-5 w-5" /> Login Sekarang</Button>
    </Card>
  );
}


function getNavIcon(label) {
  const map = {
    Beranda: School,
    Fitur: Sparkles,
    Akses: ShieldCheck,
    "LMS TKA": FileQuestion,
    "AI Guru": Bot,
    "Input Data": Database,
    Nilai: BarChart3,
    Kursus: GraduationCap,
    Drive: FolderOpen,
  };
  return map[label] || CheckCircle2;
}

function SidebarMenu({ currentUser, onLogin, onLogout, onClose, mobile = false }) {
  return (
    <div className={`${mobile ? "flex h-full" : "hidden lg:flex"} flex-col bg-slate-950 text-white`}>
      <div className="border-b border-white/10 p-5">
        <a href="#beranda" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/40">
            <School className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-black leading-tight tracking-tight text-white">RUANG BELAJAR PAK LA ODE</p>
            <p className="mt-1 text-xs font-bold leading-5 text-emerald-200">UPT SPF SD Inpres Paccerakkang</p>
          </div>
        </a>
      </div>

      <div className="border-b border-white/10 p-5">
        {currentUser ? (
          <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200">
                {React.createElement(getRoleIcon(currentUser.role), { className: "h-6 w-6" })}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{currentUser.nama}</p>
                <p className="mt-0.5 text-xs font-bold text-emerald-200">{currentUser.role}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-300">{currentUser.deskripsi}</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-sm font-black text-white">Belum login</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">Masuk sebagai admin, siswa, orang tua, atau peserta kursus.</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Menu Aplikasi</p>
        <div className="grid gap-1.5">
          {navItems.map(([label, href]) => {
            const Icon = getNavIcon(label);
            return (
              <a
                key={label}
                href={href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-emerald-200 ring-1 ring-white/10 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="grid gap-2">
          <a href={DRIVE_URL} target="_blank" rel="noreferrer" onClick={onClose}>
            <Button variant="secondary" className="w-full justify-start bg-white text-slate-950 hover:bg-slate-100">
              <FolderOpen className="h-4 w-4" /> Buka Drive
            </Button>
          </a>
          {currentUser ? (
            <Button variant="dark" className="w-full justify-start bg-red-600 hover:bg-red-700" onClick={() => { onLogout(); onClose?.(); }}>
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          ) : (
            <Button className="w-full justify-start" onClick={() => { onLogin(); onClose?.(); }}>
              <LogIn className="h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rbplo_current_user") || "null");
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === "Admin";
  const canAccessLmsTka = Boolean(currentUser && ["Admin", "Siswa", "Peserta Kursus"].includes(currentUser.role));
  const canAccessCourse = Boolean(currentUser && ["Admin", "Peserta Kursus"].includes(currentUser.role));

  function logout() {
    localStorage.removeItem("rbplo_current_user");
    setCurrentUser(null);
  }

  const featureCards = useMemo(
    () => [
      ["LMS Pembelajaran", "Materi, tugas, video, pengumuman, dan portofolio kelas.", BookOpen],
      ["LMS TKA", "Halaman khusus TKA Matematika & Bahasa Indonesia dengan PDF, YouTube, bank soal, dan kuis.", FileQuestion],
      ["AI Asisten Guru", "Generate Modul Ajar, LKPD, soal, kuis, rubrik, remedial, dan catatan rapor.", Bot],
      ["Input Data Siswa", "Data tahun ajaran baru bisa diinput manual melalui web atau sheet.", UserPlus],
      ["Pengolahan Nilai", "8 mapel utama, nilai TKA, rekap rata-rata, predikat, dan ranking.", BarChart3],
      ["Absensi Digital", "Hadir, sakit, izin, alpa, dan rekap bulanan.", ClipboardCheck],
      ["Kursus Custom", "Materi tiap pertemuan dapat Bapak atur sesuai kebutuhan peserta.", GraduationCap],
      ["Google Drive/Sheets", "File materi, database, dan rekap disiapkan agar terhubung.", Cloud],
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-800 shadow-2xl shadow-slate-950/20">
        <SidebarMenu
          currentUser={currentUser}
          onLogin={() => setLoginOpen(true)}
          onLogout={logout}
        />
      </aside>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl lg:ml-72">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <div className="min-w-0 px-3">
            <p className="truncate text-sm font-black text-slate-950 md:text-base">RUANG BELAJAR PAK LA ODE</p>
            <p className="truncate text-xs font-bold text-slate-500">Portal Pembelajaran, LMS TKA, AI Guru, Nilai, Kursus, dan Data Kelas</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="hidden items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 ring-1 ring-emerald-100 sm:flex">
                <UserRound className="h-4 w-4" /> {currentUser.role}
              </div>
            ) : null}
            {currentUser ? (
              <Button variant="dark" className="hidden px-3.5 py-2.5 text-xs sm:inline-flex" onClick={logout}>
                <LogOut className="h-4 w-4" /> Keluar
              </Button>
            ) : (
              <Button className="hidden px-3.5 py-2.5 text-xs sm:inline-flex" onClick={() => setLoginOpen(true)}>
                <LogIn className="h-4 w-4" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button className="absolute inset-0 bg-slate-950/60" onClick={() => setMenuOpen(false)} aria-label="Tutup menu" />
          <div className="relative h-full w-80 max-w-[88vw] shadow-2xl">
            <SidebarMenu
              mobile
              currentUser={currentUser}
              onLogin={() => setLoginOpen(true)}
              onLogout={logout}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="lg:ml-72">
        <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                Portal Pembelajaran, Kursus, dan Data Kelas
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Website profesional untuk kelas, kursus Matematika, nilai, absensi, dan data siswa.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Dirancang khusus untuk Bapak <b>La Ode Supriono, S.Pd., M.Pd.</b> sebagai admin/guru. Data siswa dapat diinput manual dari website atau melalui Google Sheets, sehingga siap digunakan saat data tahun ajaran baru sudah tersedia.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#input"><Button><PlusCircle className="h-5 w-5" /> Mulai Input Data</Button></a>
                <a href="#nilai"><Button variant="secondary"><BarChart3 className="h-5 w-5" /> Lihat Sistem Nilai</Button></a>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {["8 Mapel", "2 Nilai TKA", "LMS TKA", "AI Guru"].map((item) => (
                  <div key={item} className="rounded-3xl bg-white/85 p-4 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-lg font-black text-slate-950">{item}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">Siap dikembangkan</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="relative shadow-2xl shadow-slate-200">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-300">Dashboard Admin</p>
                    <h3 className="mt-1 text-2xl font-black">RUANG BELAJAR PAK LA ODE</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Input data, kelola kursus, dan pantau rekap pembelajaran.</p>
                  </div>
                  <LayoutDashboard className="h-10 w-10 text-amber-300" />
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Data Siswa", "Input manual/Sheets", Users],
                    ["Nilai Mapel", "8 mapel + TKA", BarChart3],
                    ["LMS TKA", "PDF, YouTube, soal, kuis", FileQuestion],
                    ["AI Guru", "Modul, LKPD, soal, kuis", Bot],
                    ["Kursus Custom", "Materi per pertemuan", CalendarDays],
                  ].map(([a, b, Icon]) => (
                    <div key={a} className="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/10 p-2"><Icon className="h-5 w-5 text-emerald-300" /></div>
                        <div><p className="text-sm font-black">{a}</p><p className="text-xs text-slate-300">{b}</p></div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <AccessDashboard user={currentUser} onLoginClick={() => setLoginOpen(true)} onLogout={logout} />

        <section id="fitur" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={Sparkles}
              label="Fitur Profesional"
              title="Dibuat untuk kebutuhan nyata guru SD"
              desc="Website ini bukan hanya halaman informasi, tetapi fondasi sistem kelas digital yang dapat berkembang menjadi LMS dan manajemen data pembelajaran."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map(([title, desc, Icon]) => (
                <Card key={title} className="transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>


        <section id="lms-tka" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={FileQuestion}
              label="LMS Khusus TKA"
              title="Persiapan TKA Matematika & Bahasa Indonesia"
              desc="Halaman khusus untuk menyiapkan siswa menghadapi TKA melalui materi PDF, video YouTube, bank soal, dan kuis pemahaman."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Materi PDF", "Upload modul, rangkuman, atau lembar latihan.", UploadCloud],
                ["Video YouTube", "Simpan link video penjelasan materi.", FileVideo],
                ["Bank Soal", "Kumpulan soal TKA per mapel dan level.", FileQuestion],
                ["Kuis Pemahaman", "Uji pemahaman siswa setelah belajar.", ListChecks],
              ].map(([title, desc, Icon]) => (
                <Card key={title} className="bg-slate-50">
                  <Icon className="h-8 w-8 text-emerald-700" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </Card>
              ))}
            </div>
            {canAccessLmsTka ? (
              isAdmin ? (
                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                  <TkaMaterialForm />
                  <TkaQuizBankForm />
                </div>
              ) : (
                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                  <Card className="bg-emerald-50 ring-emerald-100">
                    <BookOpen className="h-9 w-9 text-emerald-700" />
                    <h3 className="mt-5 text-2xl font-black text-slate-950">Mode Belajar Siswa</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      Akun {currentUser.role} dapat mengakses materi TKA, bank soal, kuis, dan pengumuman. Fitur upload materi hanya tersedia untuk Admin.
                    </p>
                  </Card>
                  <Card>
                    <ListChecks className="h-9 w-9 text-amber-700" />
                    <h3 className="mt-5 text-2xl font-black text-slate-950">Aktivitas yang Tersedia</h3>
                    <div className="mt-4 grid gap-3">
                      {["Lihat materi PDF", "Buka link YouTube", "Kerjakan bank soal", "Ikuti kuis pemahaman"].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" /> {item}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )
            ) : (
              <div className="mt-12">
                <ProtectedCard
                  allowed={canAccessLmsTka}
                  title="Login diperlukan untuk membuka LMS TKA"
                  desc="Gunakan akun Admin, Siswa, atau Peserta Kursus untuk mengakses materi, bank soal, dan kuis TKA."
                  onLoginClick={() => setLoginOpen(true)}
                />
              </div>
            )}
          </div>
        </section>

        <section id="ai-guru" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={Bot}
              label="AI Asisten Guru"
              title="Generate perangkat ajar dan asesmen secara cepat"
              desc="Fitur ini membantu Bapak membuat Modul Ajar, LKPD, soal, kuis, latihan TKA, rubrik, remedial, pengayaan, dan catatan rapor langsung dari website."
            />
            <div className="mt-12">
              {isAdmin ? (
                <AiTeacherAssistant />
              ) : (
                <ProtectedCard
                  allowed={isAdmin}
                  title="AI Asisten Guru khusus Admin"
                  desc="Fitur generate Modul Ajar, LKPD, soal, dan kuis hanya dibuka untuk akun Admin/Guru agar hasil perangkat ajar tetap terkontrol."
                  onLoginClick={() => setLoginOpen(true)}
                />
              )}
            </div>
          </div>
        </section>

        <section id="input" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={Database}
              label="Input Data"
              title="Data siswa bisa dimasukkan kapan saja"
              desc="Saat data tahun ajaran baru sudah tersedia, Bapak dapat memasukkan data siswa dari website atau langsung melalui Google Sheets."
            />
            {isAdmin ? (
              <div className="mt-12 grid gap-8 lg:grid-cols-2">
                <StudentForm />
                <div className="grid gap-6">
                <Card>
                  <FileSpreadsheet className="h-9 w-9 text-emerald-700" />
                  <h3 className="mt-5 text-2xl font-black text-slate-950">Terhubung dengan Sheet</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Template database berisi sheet <b>DATA_SISWA</b>, <b>ABSENSI</b>, <b>INPUT_NILAI</b>, <b>NILAI_MAPEL</b>, <b>NILAI_TKA</b>, <b>PERTEMUAN_KURSUS</b>, dan sheet pendukung lainnya.
                  </p>
                </Card>
                <Card className="bg-emerald-50 ring-emerald-100">
                  <LockKeyhole className="h-9 w-9 text-emerald-700" />
                  <h3 className="mt-5 text-2xl font-black text-slate-950">Aman untuk Tahap Awal</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Website tidak menampilkan data pribadi siswa secara publik. Form input digunakan untuk admin/guru dan dapat disambungkan ke Apps Script.
                  </p>
                </Card>
                </div>
              </div>
            ) : (
              <div className="mt-12">
                <ProtectedCard
                  allowed={isAdmin}
                  title="Input data siswa hanya untuk Admin"
                  desc="Silakan login sebagai Admin untuk menambah data siswa tahun ajaran baru dan menghubungkannya ke Google Sheets."
                  onLoginClick={() => setLoginOpen(true)}
                />
              </div>
            )}
          </div>
        </section>

        <section id="nilai" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={BarChart3}
              label="Pengolahan Nilai"
              title="Mapel lengkap, nilai TKA, dan rekap otomatis"
              desc="Mendukung nilai Matematika, Bahasa Indonesia, Pendidikan Pancasila, IPAS, Bahasa Inggris, Bahasa Makassar, Seni, Koding & Kecerdasan Artifisial, serta TKA."
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[...subjects, ...tkaSubjects].map((s) => (
                <div key={s} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200">
                  <CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" />
                  {s}
                </div>
              ))}
            </div>
            <div className="mt-12">
              {isAdmin ? (
                <GradeForm />
              ) : (
                <ProtectedCard
                  allowed={isAdmin}
                  title="Input nilai hanya untuk Admin"
                  desc="Akun siswa dan orang tua nantinya hanya melihat nilai masing-masing, sedangkan input nilai dilakukan oleh Admin/Guru."
                  onLoginClick={() => setLoginOpen(true)}
                />
              )}
            </div>
          </div>
        </section>

        <section id="kursus" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              icon={GraduationCap}
              label="Kursus Matematika Custom"
              title="Materi kursus dapat diatur per pertemuan"
              desc="Bapak dapat menentukan topik, tujuan, aktivitas, latihan, dan link materi sesuai kebutuhan peserta kursus."
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              {isAdmin ? (
                <CourseMeetingForm />
              ) : canAccessCourse ? (
                <Card className="bg-emerald-50 ring-emerald-100">
                  <GraduationCap className="h-9 w-9 text-emerald-700" />
                  <h3 className="mt-5 text-2xl font-black text-slate-950">Mode Peserta Kursus</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Akun peserta kursus dapat melihat materi, jadwal, latihan, dan evaluasi. Pengaturan pertemuan hanya tersedia untuk Admin.
                  </p>
                </Card>
              ) : (
                <ProtectedCard
                  allowed={canAccessCourse}
                  title="Login diperlukan untuk membuka kursus"
                  desc="Gunakan akun Admin atau Peserta Kursus untuk mengakses halaman kursus Matematika."
                  onLoginClick={() => setLoginOpen(true)}
                />
              )}
              <div className="grid gap-6">
                {[
                  ["Paket Dasar", "Konsep dasar, operasi hitung, pecahan, dan soal cerita sederhana.", Award],
                  ["Paket Intensif", "Latihan bertahap, evaluasi rutin, dan penguatan numerasi.", ListChecks],
                  ["Persiapan Ujian", "Simulasi, pembahasan soal, dan strategi menjawab TKA/ujian.", BookOpen],
                ].map(([title, desc, Icon]) => (
                  <Card key={title}>
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-100"><Icon className="h-7 w-7" /></div>
                      <div>
                        <h3 className="text-xl font-black text-slate-950">{title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="drive" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-2xl shadow-emerald-200 md:p-12 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black ring-1 ring-white/20">
                  <Cloud className="h-4 w-4" />
                  Google Drive & Google Sheets
                </div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                  Database dan file pembelajaran disiapkan agar terhubung dengan Drive Bapak
                </h2>
                <p className="mt-5 text-base leading-8 text-emerald-50">
                  Folder utama menggunakan ID Drive Bapak. Template sheet sudah berisi struktur data siswa, absensi, nilai, TKA, kursus, materi, tugas, pengumuman, dan portofolio siswa.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={DRIVE_URL} target="_blank" rel="noreferrer"><Button variant="secondary"><FolderOpen className="h-5 w-5" /> Buka Folder Drive</Button></a>
                  <a href="#input"><Button variant="dark"><Database className="h-5 w-5" /> Input Data Sekarang</Button></a>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["DATA_SISWA", "Data siswa baru"],
                  ["NILAI_MAPEL", "8 mapel utama"],
                  ["NILAI_TKA", "Matematika & B. Indonesia"],
                  ["PERTEMUAN_KURSUS", "Materi custom"],
                  ["LMS_TKA_MATERI", "PDF & YouTube"],
                  ["BANK_SOAL_TKA", "Soal TKA"],
                  ["KUIS_TKA", "Kuis pemahaman"],
                  ["MATERI_KURSUS", "PDF/video/slide"],
                  ["AI_GENERATOR", "Hasil perangkat ajar"],
                  ["PORTOFOLIO", "Karya siswa"],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-3xl bg-white/12 p-5 ring-1 ring-white/20">
                    <p className="font-black">{a}</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-50">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <MessageCircle className="mx-auto h-10 w-10 text-emerald-300" />
            <h2 className="mt-5 text-3xl font-black">RUANG BELAJAR PAK LA ODE</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Portal pembelajaran profesional untuk kelas, LMS TKA Matematika & Bahasa Indonesia, AI Asisten Guru, kursus Matematika, pengolahan nilai, absensi, data siswa, dan integrasi Google Drive.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8 lg:ml-72">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-sm font-black text-slate-950">© 2026 RUANG BELAJAR PAK LA ODE</p>
          <p className="text-xs font-bold text-slate-500">La Ode Supriono, S.Pd., M.Pd. · UPT SPF SD Inpres Paccerakkang</p>
        </div>
      </footer>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

export default App;
