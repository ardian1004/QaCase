# QA Technical Assessment - WeMine Platform Testing Strategy

## 1. Executive Summary
Dokumen ini menyajikan strategi pengujian, perancangan *test case*, dan otomasi pengujian untuk platform **WeMine** (B2B SaaS untuk industri pertambangan). Pengujian difokuskan pada keandalan fitur **Offline-First**, **Dynamic Form Builder**, serta integrasi **Multi-Tenant SSO**.

---

## 2. Test Scope & Coverage

### A. Manual Test Cases (`test-cases/`)
- **Flow 0:** SSO Login & Master Data Sync Lifecycle.
- **Flow 1:** Dynamic Inspection Form rendering & submission.
- **Flow 2:** Offline Hazard Report creation & auto-sync when back online.

### B. Automated Test Suites (`tests/`)
- **API Tests (`tests/api/`):**
  - `user-service.spec.ts`: Tenant lookup (`/user/who`) & profile verification (`/user/me`).
  - `tenant-service.spec.ts`: Retrieval of master data schema for offline support.
- **E2E UI Tests (`tests/e2e/`):**
  - `flow0-login.spec.ts`: Authentication & initial data bootstrap.
  - `flow1-inspection.spec.ts`: Dynamic UI rendering based on field configurations.
  - `flow2-hazard-offline.spec.ts`: Network disconnection simulation & sync verification.

---

## 3. Test Execution & Status Note
- **Environment Base URL:** Pengujian dikonfigurasi menggunakan `baseURL` fleksibel via `playwright.config.ts`.
- **Expected Failure Notice:** Eksekusi pengujian E2E UI akan menampilkan status *Failed* pada *mock environment* karena memerlukan endpoint/server *staging* yang aktif secara *live*. Seluruh skrip telah dirancang menggunakan logika Playwright & TypeScript yang sesuai dengan kontrak aplikasi.