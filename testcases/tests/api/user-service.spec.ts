import { test, expect } from '@playwright/test';

test.describe('API - User Service Integration Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || 'https://staging.wemine.dev';

  test('POST /user/who - Should perform tenant lookup successfully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/user/who`, {
      data: {
        username: 'operator.mining@tenant-a.com',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Validate Status Code
    expect(response.status()).toBe(200);

    // Validate Response Payload Contract
    const body = await response.json();
    expect(body).toHaveProperty('tenant_id');
    expect(body).toHaveProperty('tenant_name');
    expect(body).toHaveProperty('sso_provider', 'microsoft');
    expect(body.tenant_id).not.toBeNull();
  });

  test('POST /user/who - Should return 404 for non-existent user', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/user/who`, {
      data: {
        username: 'invalid.user@unknown.com',
      },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toContain('Tenant or User not found');
  });

  test('GET /user/me - Should fetch user profile with valid Bearer Token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${process.env.TEST_AUTH_TOKEN || 'mock-token'}`,
      },
    });

    expect(response.status()).toBe(200);

    const profile = await response.json();
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('username');
    expect(profile).toHaveProperty('role');
    expect(profile).toHaveProperty('tenant_id');
  });
});
