# 📖 Testing Documentation & Justification - WeMine Platform

Dokumen ini berisi penjelasan mengenai justifikasi pemilihan *testing tool* serta daftar seluruh *test case* (manual & otomatis) yang telah dirancang untuk platform B2B SaaS **WeMine**.

---

## 1. Justifikasi Pemilihan Testing Tool (Playwright)

Dalam memenuhi kebutuhan pengujian platform WeMine yang kompleks (meliputi sistem B2B SaaS, arsitektur *Offline-First*, *Dynamic Form Builder*, serta ekosistem *Multi-Tenant*), **Playwright** dipilih sebagai *framework* pengujian utama berbasis pertimbangan teknis berikut:

### 🎮 A. Simulasi Native Offline-First Mode
- **Alasan:** Fitur utama WeMine adalah kemampuan operasional di area tambang tanpa jaringan internet (*Offline-First*).
- **Keunggulan Playwright:** Menyediakan API bawaan `browserContext.setOffline(true/false)` yang memungkinkan simulasi pemutusan dan pemulihan koneksi internet secara riil di tingkat browser tanpa bantuan *proxy* luar atau manipulasi sistem operasi.

### ⚡ B. Performa & Eksekusi Fast Parallel (Isolated Contexts)
- **Alasan:** Pengujian SaaS butuh waktu eksekusi yang cepat untuk *pipeline* CI/CD.
- **Keunggulan Playwright:** Berjalan di atas skema *Browser Context* yang terisolasi dan sangat ringan, memungkinkan lusinan tes berjalan secara paralel dalam satu instans browser tanpa saling menginterferensi (*zero state leakage*).

### 🔍 C. Penanganan Dynamic UI & Shadow DOM
- **Alasan:** Formulir inspeksi WeMine digenerate secara dinamis (*Dynamic Form Builder*).
- **Keunggulan Playwright:** Memiliki fitur *Auto-waiting* cerdas dan dukungan penuh terhadap *Shadow DOM* serta atribut penyeleksi kustom (seperti `data-field-type`) tanpa perlu menambahkan `sleep()` atau *explicit wait* manual yang rawan flaky.

### 🌐 D. Unified API & E2E Testing Suite
- **Alasan:** Membutuhkan validasi integrasi *backend service* (`User Service`, `Tenant Service`) sekaligus alur UI *frontend*.
- **Keunggulan Playwright:** Mendukung *request context* bawaan untuk API testing (HTTP Client) dalam satu projek dan konfigurasi TypeScript yang sama dengan pengujian E2E UI.

---

## 2. Daftar Test Cases (Test Matrix)

### 📋 A. Manual Test Cases (`test-cases/manual/test-cases.md`)

| ID Test Case | Modul / Flow | Judul Skenario Uji | Deskripsi & Langkah Singkat | Ekspektasi Hasil | Prioritas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-LOG-001** | Flow 0 (Login) | Tenant Lookup via Username | 1. Masukkan username operator.<br>2. Klik tombol 'Continue'. | Sistem mengenali Tenant ID dan mengarahkan ke SSO Provider resmi. | **High** |
| **TC-LOG-002** | Flow 0 (Login) | Master Data Bootstrap | 1. Login berhasil via SSO.<br>2. Masuk ke Dashboard utama. | File JSON lokasi, area, dan skema form terunduh ke *Local Storage/IndexedDB*. | **Critical** |
| **TC-INS-001** | Flow 1 (Inspection) | Dynamic Form Rendering | 1. Pilih lokasi & unit alat berat.<br>2. Buka form inspeksi. | Form Builder menata bidang input secara dinamis sesuai konfigurasi Web Office. | **High** |
| **TC-INS-002** | Flow 1 (Inspection) | Offline Form Submission | 1. Matikan koneksi internet.<br>2. Isi form inspeksi & submit. | Data inspeksi tersimpan di antrean *local storage* tanpa terjadi *app crash*. | **Critical** |
| **TC-HAZ-001** | Flow 2 (Hazard) | Offline Hazard Capture | 1. Aktifkan Airplane Mode.<br>2. Buat laporan hazard & foto. | Laporan tersimpan dengan status *'Pending Sync'* di perangkat lokal. | **High** |
| **TC-HAZ-002** | Flow 2 (Hazard) | Auto-Sync Network Restore | 1. Pulihkan koneksi internet (Online). | Sistem mendeteksi jaringan dan otomatis mengunggah laporan hazard ke server. | **Critical** |

---

### 🤖 B. Automated Test Suites (`tests/`)

#### 1. API Service Integration Tests (`tests/api/`)
- **`user-service.spec.ts`**
  - `POST /user/who`: Validasi *tenant lookup* berhasil dikembalikan berdasarkan identitas pengguna.
  - `POST /user/who`: Validasi respons error `404` untuk pengguna yang tidak terdaftar.
  - `GET /user/me`: Validasi pengambilan profil pengguna menggunakan *Bearer Token* yang sah.
- **`tenant-service.spec.ts`**
  - `GET /tenant/master`: Validasi ketersediaan *endpoint master data* untuk kebutuhan *offline bootstrap*.
  - `GET /tenant/master/locations`: Validasi struktur respons hierarki lokasi tambang.

#### 2. End-to-End (E2E) UI & Offline Tests (`tests/e2e/`)
- **`flow0-login.spec.ts`**
  - Otomasi alur autentikasi SSO, verifikasi token *session*, dan pengunduhan awal *master data*.
- **`flow1-inspection.spec.ts`**
  - Otomasi navigasi riwayat inspeksi, ekstraksi elemen *dynamic form builder*, dan penyerahan data inspeksi.
- **`flow2-hazard-offline.spec.ts`**
  - Otomasi simulasi transisi *Offline-to-Online*: Pemutusan jaringan via `setOffline(true)`, pengisian form hazard lokal, pemulihan jaringan via `setOffline(false)`, dan verifikasi *auto-synchronization*.