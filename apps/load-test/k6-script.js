/**
 * k6 script equivalent of apps/load-test/locustfile.py (as-is)
 *
 * Focus:
 * - Active: GET <baseurl>/api/Hello
 * - Kept commented: POST <baseurl>/api/items (x-functions-key header), POST <baseurl>/api/items/bulk?number=5
 *
 * Config via env:
 * - BASE_URL (default: https://dx-d-itn-appsvc-func-01-hpgddberbzgdgpgu.italynorth-01.azurewebsites.net)
 * - FUNCTION_KEY (default: REPLACE_WITH_KEY)
 * - MAX_USERS (mapped to k6 maxVUs; default: 20000)
 * - PREALLOC_VUS (mapped to k6 preAllocatedVUs; default: 200)
 *
 * Load profile (10 minutes total; mirrors current locust schedule):
 * - 0-1 min:   1500 RPS
 * - 1-3 min:   3000 RPS
 * - 3-10 min:  8000 RPS
 *
 * Uses ramping-arrival-rate so the target RPS is attempted regardless of response times
 * (subject to available VUs via preAllocatedVUs/maxVUs).
 */

import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'https://dx-d-itn-appsvc-func-01-hpgddberbzgdgpgu.italynorth-01.azurewebsites.net';
const FUNCTION_KEY = __ENV.FUNCTION_KEY || 'REPLACE_WITH_KEY';

// Map Locust's MAX_USERS to k6's maxVUs for convenience
const MAX_VUS = Number.parseInt(__ENV.MAX_USERS || __ENV.MAX_VUS || '20000', 10);
const PREALLOC_VUS = Number.parseInt(__ENV.PREALLOC_VUS || '200', 10);

export const options = {
  scenarios: {
    step_rps: {
      executor: 'ramping-arrival-rate',
      startRate: 1, // start near zero
      timeUnit: '1s',
      preAllocatedVUs: PREALLOC_VUS,
      maxVUs: MAX_VUS,
      stages: [
        { target: 1500, duration: '60s' },  // 0-1 min
        { target: 3000, duration: '120s' }, // 1-3 min
        { target: 8000, duration: '420s' }, // 3-10 min
      ],
    },
  },
};

export default function () {
  // Active request
  http.get(`${BASE_URL}/api/Hello`, { tags: { name: '/api/Hello' } });

  // Kept commented on purpose (mirroring locustfile.py)
  // const headers = { 'x-functions-key': FUNCTION_KEY, 'Content-Type': 'application/json' };
  // http.post(`${BASE_URL}/api/items`, JSON.stringify({}), { headers, tags: { name: 'SingleItem' } });
  // http.post(`${BASE_URL}/api/items/bulk?number=5`, JSON.stringify({}), { tags: { name: 'Bulk' } });
}
