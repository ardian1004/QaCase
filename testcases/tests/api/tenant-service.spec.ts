import { test, expect } from '@playwright/test';

test.describe('API - Tenant Service Master Data Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || 'https://staging.wemine.dev';
  const AUTH_HEADER = {
    Authorization: `Bearer ${process.env.TEST_AUTH_TOKEN || 'mock-token'}`,
  };

  test('GET /tenant/master - Should return list of required master data endpoints', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/tenant/master`, {
      headers: AUTH_HEADER,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('version');
    expect(Array.isArray(body.endpoints)).toBeTruthy();

    // Verify all endpoints required for offline operation are provided
    const endpointNames = body.endpoints.map((e: { name: string }) => e.name);
    expect(endpointNames).toContain('locations');
    expect(endpointNames).toContain('sublocations');
    expect(endpointNames).toContain('areas');
    expect(endpointNames).toContain('employees');
    expect(endpointNames).toContain('forms');
  });

  test('GET /tenant/master/locations - Should return valid location structure', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/tenant/master/locations`, {
      headers: AUTH_HEADER,
    });

    expect(response.status()).toBe(200);

    const locations = await response.json();
    expect(Array.isArray(locations)).toBeTruthy();
    
    if (locations.length > 0) {
      const firstLocation = locations[0];
      expect(firstLocation).toHaveProperty('id');
      expect(firstLocation).toHaveProperty('location_name');
      expect(firstLocation).toHaveProperty('code');
    }
  });
});
