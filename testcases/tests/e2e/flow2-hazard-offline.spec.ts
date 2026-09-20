import { test, expect } from '@playwright/test';

test('Simulasi Offline ke Online saat Submit Hazard Report', async ({ page, context }) => {
  await page.goto('/hazard/new');

  // 1. Simulasikan koneksi terputus (Offline Mode)
  await context.setOffline(true);
  
  // Isi form hazard dalam kondisi offline
  await page.selectOption('select[name="location"]', 'Area-A');
  await page.click('button[type="submit"]');
  
  // Validasi data tersimpan di Local Storage / IndexDB
  await expect(page.locator('.offline-badge')).toHaveText('Saved locally');

  // 2. Kembalikan koneksi menjadi Online
  await context.setOffline(false);
  
  // Validasi proses auto-sync berjalan
  await expect(page.locator('.sync-status')).toHaveText('Synced to server', { timeout: 10000 });
});
