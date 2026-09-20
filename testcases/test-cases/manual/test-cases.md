# Manual Test Cases - WeMine Platform

## Flow 0: SSO Login & Master Data Sync
| Test Case ID | Title | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| TC-LOG-001 | Tenant Lookup via Username | 1. Buka halaman login.<br>2. Masukkan username operator.<br>3. Klik 'Continue'. | System mengenali Tenant ID dan mengarahkan ke Microsoft SSO Provider. | High |
| TC-LOG-002 | Master Data Bootstrap | 1. Berhasil login via SSO.<br>2. Masuk ke Dashboard. | System mengunduh file JSON lokasi, area, dan form builder ke LocalStorage/IndexedDB. | Critical |

## Flow 1: Dynamic Inspection Form
| Test Case ID | Title | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| TC-INS-001 | Dynamic Form Rendering | 1. Pilih lokasi inspeksi.<br>2. Pilih tipe alat berat. | Form builder secara dinamis menampilkan bidang input sesuai konfigurasi dari Web Office. | High |
| TC-INS-002 | Offline Form Submission | 1. Putuskan jaringan (Offline).<br>2. Isi form inspeksi.<br>3. Klik Submit. | Data tersimpan di antrean *offline local storage* tanpa error app crash. | Critical |

## Flow 2: Offline Hazard Report & Auto-Sync
| Test Case ID | Title | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| TC-HAZ-001 | Offline Hazard Capture | 1. Aktifkan Airplane Mode.<br>2. Buat laporan hazard baru.<br>3. Lampirkan foto. | Laporan tersimpan di status 'Pending Sync' secara lokal. | High |
| TC-HAZ-002 | Auto-Sync Network Restore | 1. Pulihkan koneksi internet (Online). | Sistem otomatis mendeteksi jaringan dan mengunggah laporan hazard ke server. | Critical |