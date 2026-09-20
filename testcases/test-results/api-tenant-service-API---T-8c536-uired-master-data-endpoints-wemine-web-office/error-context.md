# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\tenant-service.spec.ts >> API - Tenant Service Master Data Tests >> GET /tenant/master - Should return list of required master data endpoints
- Location: tests\api\tenant-service.spec.ts:9:7

# Error details

```
Error: apiRequestContext.get: getaddrinfo ENOTFOUND staging.wemine.dev
Call log:
  - → GET https://staging.wemine.dev/tenant/master
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Authorization: Bearer mock-token

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('API - Tenant Service Master Data Tests', () => {
  4  |   const BASE_URL = process.env.API_BASE_URL || 'https://staging.wemine.dev';
  5  |   const AUTH_HEADER = {
  6  |     Authorization: `Bearer ${process.env.TEST_AUTH_TOKEN || 'mock-token'}`,
  7  |   };
  8  | 
  9  |   test('GET /tenant/master - Should return list of required master data endpoints', async ({ request }) => {
> 10 |     const response = await request.get(`${BASE_URL}/tenant/master`, {
     |                                    ^ Error: apiRequestContext.get: getaddrinfo ENOTFOUND staging.wemine.dev
  11 |       headers: AUTH_HEADER,
  12 |     });
  13 | 
  14 |     expect(response.status()).toBe(200);
  15 | 
  16 |     const body = await response.json();
  17 |     expect(body).toHaveProperty('version');
  18 |     expect(Array.isArray(body.endpoints)).toBeTruthy();
  19 | 
  20 |     // Verify all endpoints required for offline operation are provided
  21 |     const endpointNames = body.endpoints.map((e: { name: string }) => e.name);
  22 |     expect(endpointNames).toContain('locations');
  23 |     expect(endpointNames).toContain('sublocations');
  24 |     expect(endpointNames).toContain('areas');
  25 |     expect(endpointNames).toContain('employees');
  26 |     expect(endpointNames).toContain('forms');
  27 |   });
  28 | 
  29 |   test('GET /tenant/master/locations - Should return valid location structure', async ({ request }) => {
  30 |     const response = await request.get(`${BASE_URL}/tenant/master/locations`, {
  31 |       headers: AUTH_HEADER,
  32 |     });
  33 | 
  34 |     expect(response.status()).toBe(200);
  35 | 
  36 |     const locations = await response.json();
  37 |     expect(Array.isArray(locations)).toBeTruthy();
  38 |     
  39 |     if (locations.length > 0) {
  40 |       const firstLocation = locations[0];
  41 |       expect(firstLocation).toHaveProperty('id');
  42 |       expect(firstLocation).toHaveProperty('location_name');
  43 |       expect(firstLocation).toHaveProperty('code');
  44 |     }
  45 |   });
  46 | });
  47 | 
```