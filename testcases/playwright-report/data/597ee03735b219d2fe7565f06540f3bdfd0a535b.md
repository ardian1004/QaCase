# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\user-service.spec.ts >> API - User Service Integration Tests >> GET /user/me - Should fetch user profile with valid Bearer Token
- Location: tests\api\user-service.spec.ts:39:7

# Error details

```
Error: apiRequestContext.get: getaddrinfo ENOTFOUND staging.wemine.dev
Call log:
  - → GET https://staging.wemine.dev/user/me
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Authorization: Bearer mock-token

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('API - User Service Integration Tests', () => {
  4  |   const BASE_URL = process.env.API_BASE_URL || 'https://staging.wemine.dev';
  5  | 
  6  |   test('POST /user/who - Should perform tenant lookup successfully', async ({ request }) => {
  7  |     const response = await request.post(`${BASE_URL}/user/who`, {
  8  |       data: {
  9  |         username: 'operator.mining@tenant-a.com',
  10 |       },
  11 |       headers: {
  12 |         'Content-Type': 'application/json',
  13 |       },
  14 |     });
  15 | 
  16 |     // Validate Status Code
  17 |     expect(response.status()).toBe(200);
  18 | 
  19 |     // Validate Response Payload Contract
  20 |     const body = await response.json();
  21 |     expect(body).toHaveProperty('tenant_id');
  22 |     expect(body).toHaveProperty('tenant_name');
  23 |     expect(body).toHaveProperty('sso_provider', 'microsoft');
  24 |     expect(body.tenant_id).not.toBeNull();
  25 |   });
  26 | 
  27 |   test('POST /user/who - Should return 404 for non-existent user', async ({ request }) => {
  28 |     const response = await request.post(`${BASE_URL}/user/who`, {
  29 |       data: {
  30 |         username: 'invalid.user@unknown.com',
  31 |       },
  32 |     });
  33 | 
  34 |     expect(response.status()).toBe(404);
  35 |     const body = await response.json();
  36 |     expect(body.message).toContain('Tenant or User not found');
  37 |   });
  38 | 
  39 |   test('GET /user/me - Should fetch user profile with valid Bearer Token', async ({ request }) => {
> 40 |     const response = await request.get(`${BASE_URL}/user/me`, {
     |                                    ^ Error: apiRequestContext.get: getaddrinfo ENOTFOUND staging.wemine.dev
  41 |       headers: {
  42 |         Authorization: `Bearer ${process.env.TEST_AUTH_TOKEN || 'mock-token'}`,
  43 |       },
  44 |     });
  45 | 
  46 |     expect(response.status()).toBe(200);
  47 | 
  48 |     const profile = await response.json();
  49 |     expect(profile).toHaveProperty('id');
  50 |     expect(profile).toHaveProperty('username');
  51 |     expect(profile).toHaveProperty('role');
  52 |     expect(profile).toHaveProperty('tenant_id');
  53 |   });
  54 | });
  55 | 
```