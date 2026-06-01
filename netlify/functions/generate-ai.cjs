const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TYPE_LABELS = {
  modul_ajar: "Modul Ajar",
  lkpd: "LKPD",
  soal: "Soal-Soal",
  kuis: "Kuis",
  tka: "Latihan TKA",
  rubrik: "Rubrik Penilaian",
  remedial_pengayaan: "Remedial dan Pengayaan",
  catatan_rapor: "Catatan Rapor",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function safeText(value, max = 1200) {
  return String(value || "").trim().slice(0, max);
}

function buildPrompt(payload) {
  const tipe = safeText(payload.tipe, 80);
  const jenis = TYPE_LABELS[tipe] || "Dokumen Pembelajaran";
  const mapel = safeText(payload.mapel, 120);
  const kelas = safeText(payload.kelas, 20);
  const semester = safeText(payload.semester, 50);
  const materi = safeText(payload.materi, 300);
  const tujuan = safeText(payload.tujuan, 900);
  const jumlahSoal = safeText(payload.jumlahSoal, 10) || "10";
  const level = safeText(payload.level, 50);
  const modelPembelajaran = safeText(payload.modelPembelajaran, 120);
  const durasi = safeText(payload.durasi, 80);
  const catatan = safeText(payload.catatan, 1200);

  const common = `
Buat ${jenis} untuk guru SD.
Identitas:
- Nama website: RUANG BELAJAR PAK LA ODE
- Guru: La Ode Supriono, S.Pd., M.Pd.
- Sekolah: UPT SPF SD Inpres Paccerakkang
- Jenjang: Sekolah Dasar
- Kelas: ${kelas}
- Semester: ${semester}
- Mata pelajaran: ${mapel}
- Materi/topik: ${materi}
- Level: ${level}
- Alokasi waktu: ${durasi}
- Model pembelajaran: ${modelPembelajaran}
- Tujuan pembelajaran: ${tujuan || "Tentukan tujuan pembelajaran yang sesuai."}
- Catatan khusus guru: ${catatan || "Tidak ada catatan khusus."}

Aturan hasil:
- Gunakan bahasa Indonesia formal, jelas, dan ramah anak SD.
- Susun rapi dengan judul, subjudul, nomor, dan tabel markdown jika perlu.
- Buat siap salin ke Word/Google Docs.
- Jangan mengarang data pribadi siswa.
- Gunakan konteks budaya lokal Makassar jika relevan, tetapi jangan memaksakan.
`;

  const templates = {
    modul_ajar: `
${common}
Format wajib Modul Ajar:
1. Identitas modul
2. Kompetensi awal
3. Profil Pelajar Pancasila/karakter
4. Sarana dan prasarana
5. Target peserta didik
6. Model/metode pembelajaran
7. Tujuan pembelajaran
8. Pemahaman bermakna
9. Pertanyaan pemantik
10. Kegiatan pembelajaran: pendahuluan, inti, penutup
11. Asesmen: diagnostik, formatif, sumatif
12. Remedial dan pengayaan
13. Refleksi guru dan siswa
14. Lampiran singkat: bahan bacaan, LKPD ringkas, rubrik sederhana
`,
    lkpd: `
${common}
Format wajib LKPD:
1. Judul LKPD
2. Identitas siswa
3. Tujuan kegiatan
4. Petunjuk kerja
5. Ringkasan materi singkat
6. Aktivitas/kegiatan siswa bertahap
7. Latihan soal sebanyak ${jumlahSoal} nomor
8. Pertanyaan refleksi
9. Kunci jawaban dan pembahasan untuk guru
`,
    soal: `
${common}
Buat paket soal sebanyak ${jumlahSoal} nomor.
Format wajib:
- Tabel kisi-kisi singkat: nomor, indikator, level kognitif, bentuk soal
- Soal bervariasi sesuai mapel
- Sertakan kunci jawaban
- Sertakan pembahasan ringkas per nomor
- Jika Matematika/TKA, sertakan langkah penyelesaian
`,
    kuis: `
${common}
Buat kuis pemahaman sebanyak ${jumlahSoal} nomor.
Format wajib:
1. Judul kuis
2. Petunjuk pengerjaan
3. Soal pilihan ganda/isian/uraian yang seimbang
4. Kunci jawaban
5. Pembahasan singkat
6. Skor penilaian dan kriteria ketuntasan
`,
    tka: `
${common}
Buat latihan persiapan TKA sebanyak ${jumlahSoal} nomor.
Format wajib:
- Fokus pada TKA Matematika atau TKA Bahasa Indonesia sesuai mapel.
- Buat soal berbasis literasi/numerasi dan konteks kehidupan sehari-hari siswa SD.
- Sertakan stimulus/wacana singkat untuk beberapa soal.
- Sertakan kunci jawaban dan pembahasan rinci.
- Sertakan tips strategi mengerjakan soal TKA.
`,
    rubrik: `
${common}
Buat rubrik penilaian.
Format wajib:
1. Deskripsi tugas/kinerja yang dinilai
2. Aspek penilaian
3. Tabel skala 1-4: sangat baik, baik, cukup, perlu bimbingan
4. Indikator tiap skala
5. Cara menghitung nilai akhir
6. Catatan umpan balik untuk siswa
`,
    remedial_pengayaan: `
${common}
Buat perangkat remedial dan pengayaan.
Format wajib:
1. Diagnosis kesulitan umum siswa
2. Aktivitas remedial bertahap
3. Soal remedial dengan kunci dan pembahasan
4. Aktivitas pengayaan untuk siswa cepat paham
5. Soal pengayaan/HOTS dengan kunci dan pembahasan
6. Rekomendasi tindak lanjut guru
`,
    catatan_rapor: `
${common}
Buat contoh catatan wali kelas/rapor.
Format wajib:
- 5 variasi untuk siswa sangat baik
- 5 variasi untuk siswa baik
- 5 variasi untuk siswa cukup
- 5 variasi untuk siswa perlu bimbingan
- Gunakan kalimat positif, sopan, dan membangun.
`,
  };

  return templates[tipe] || common;
}

exports.handler = async function(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "Gunakan metode POST." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return json(500, {
      ok: false,
      message: "OPENAI_API_KEY belum diisi di Environment Variables Netlify. Tambahkan variabel tersebut lalu deploy ulang.",
    });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { ok: false, message: "Format JSON tidak valid." });
  }

  const prompt = buildPrompt(payload);
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions:
          "Anda adalah AI Asisten Guru SD profesional Indonesia. Jawab terstruktur, akurat, praktis, dan siap dipakai guru. Hindari klaim kurikulum spesifik yang tidak diberikan pengguna; gunakan istilah umum bila ragu.",
        input: prompt,
        max_output_tokens: 4500,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || `OpenAI API error: ${response.status}`;
      return json(response.status, { ok: false, message });
    }

    const output = data.output_text || extractOutputText(data) || "AI belum mengembalikan teks.";
    return json(200, { ok: true, model, output });
  } catch (error) {
    return json(500, { ok: false, message: error.message || "Gagal menghubungi OpenAI API." });
  }
};

function extractOutputText(data) {
  try {
    return (data.output || [])
      .flatMap((item) => item.content || [])
      .map((content) => content.text || "")
      .filter(Boolean)
      .join("\n\n");
  } catch (error) {
    return "";
  }
}
