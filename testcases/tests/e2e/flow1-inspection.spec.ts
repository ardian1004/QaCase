import { test, expect } from '@playwright/test';

test.describe('Flow 1 - Equipment Inspection Form Lifecycle', () => {

  test('User views inspection history, renders dynamic form builder fields, and submits inspection offline', async ({ page, context }) => {
    // 1. Navigate to Equipment Inspection Module
    await page.goto('/equipment-inspection');

    // Verify list of previous submissions is displayed
    const submissionList = page.locator('.inspection-history-list');
    await expect(submissionList).toBeVisible();

    // Click button to redirect to new submission form
    await page.click('button[data-testid="btn-new-inspection"]');
    await expect(page).toHaveURL(/.*\/equipment-inspection\/new/);

    // 2. Select Form Code to trigger Dynamic Form Builder rendering
    const formCodeSelect = page.locator('select[name="form_code"]');
    await formCodeSelect.selectOption('FORM-EQ-CAT797');

    // Verify dynamic fields (up to 50 fields) are loaded from cached master data
    const dynamicFormContainer = page.locator('.dynamic-form-builder');
    await expect(dynamicFormContainer).toBeVisible();

    // 3. Fill Dynamic Form Fields (Input Text, Date Picker, Select, Radio, Image Picker)
    // Dynamic Input Text
    const equipmentNameInput = page.locator('input[data-field-type="text"][name="equipment_name"]');
    await equipmentNameInput.fill('CAT 797F Dump Truck #04');

    // Dynamic Date Picker
    const inspectionDatePicker = page.locator('input[data-field-type="datepicker"][name="inspection_date"]');
    await inspectionDatePicker.fill('2026-09-20');

    // Dynamic Select
    const shiftSelect = page.locator('select[data-field-type="select"][name="shift_type"]');
    await shiftSelect.selectOption('Day Shift');

    // Dynamic Radio Option (up to 4 options)
    const engineConditionRadio = page.locator('input[data-field-type="radio"][name="engine_condition"][value="GOOD"]');
    await engineConditionRadio.check();
    await expect(engineConditionRadio).toBeChecked();

    // Dynamic Image Picker
    const imageInput = page.locator('input[data-field-type="image"][name="equipment_photo"]');
    await imageInput.setInputFiles({
      name: 'truck-inspection.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-bytes')
    });

    // 4. Simulate Offline Mode before submission
    await context.setOffline(true);

    // Submit Inspection Form in Offline Mode
    await page.click('button[type="submit"]');

    // Verify record is saved locally in IndexedDB / Local Storage
    const offlineToast = page.locator('.toast-notification');
    await expect(offlineToast).toBeVisible();
    await expect(offlineToast).toContainText('Inspection saved locally (Offline Mode)');

    // 5. Restore Network Connection & Verify Automatic Sync
    await context.setOffline(false);

    // Verify sync indicator updates to success
    const syncStatus = page.locator('.sync-badge');
    await expect(syncStatus).toHaveText('Synced', { timeout: 15000 });
  });

});
