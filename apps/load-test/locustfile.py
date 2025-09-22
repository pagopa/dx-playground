"""
Locust load test compatible with Azure Load Testing.

Focus:
- Active: GET <baseurl>/api/Hello
- Kept commented: POST <baseurl>/api/items (x-functions-key header), POST <baseurl>/api/items/bulk?number=5

Config via env:
- BASE_URL (default: http://localhost:7071)
- FUNCTION_KEY (default: REPLACE_WITH_KEY)
- MAX_USERS (cap users; default: 20000)
- SPAWN_RATE (how fast to adjust users; default: 1000 users/sec)
- RPS_PER_USER_FALLBACK (assumed per-user RPS when unknown; default: 2.0)

Load profile (10 minutes total):
- 0-1 min:   1000 RPS
- 1-3 min:   3000 RPS
- 3-6 min:   6000 RPS
- 6-10 min:  8000 RPS

The shape dynamically adjusts user count to hit target RPS, ignoring response time.
"""

import os
import math

from locust import task, constant, LoadTestShape
try:
    # Locust >= 2.9
    from locust import FastHttpUser
except ImportError:
    # Fallback for older Locust versions
    from locust.contrib.fasthttp import FastHttpUser

# Base URL and function key header value reused across requests
BASE_URL = os.getenv("BASE_URL", "https://dx-d-itn-appsvc-func-01-hpgddberbzgdgpgu.italynorth-01.azurewebsites.net")
FUNCTION_KEY = os.getenv("FUNCTION_KEY", "MfHGqwQEhMwpFnMWW-Zp8yLfcNR5B-ZQ60wmRQt8iWB7AzFuHmUvRQ==")

# Shape tuning (can be overridden via env in Azure Load Testing)
MAX_USERS = int(os.getenv("MAX_USERS", "20000"))
SPAWN_RATE = float(os.getenv("SPAWN_RATE", "1000"))
RPS_PER_USER_FALLBACK = float(os.getenv("RPS_PER_USER_FALLBACK", "2.0"))


class AzureFunctionUser(FastHttpUser):
    host = BASE_URL
    # No client-side wait; aim purely for target RPS
    wait_time = constant(0)

    @task
    def get_hello(self):
        self.client.get("/api/Hello", name="/api/Hello")

    # @task
    # def post_item_with_key(self):
    #     headers = {"x-functions-key": FUNCTION_KEY}
    #     payload = {}
    #     self.client.post(
    #         "/api/items",
    #         headers=headers,
    #         json=payload,
    #         name="SingleItem",
    #     )

    # @task
    # def post_item_with_query(self):
    #     payload = {}
    #     self.client.post(
    #         "/api/items/bulk?number=5",
    #         json=payload,
    #         name="Bulk",
    #     )


class StepTargetRPS(LoadTestShape):
    """
    Target specific RPS steps regardless of response time by adjusting user count
    dynamically using observed RPS.
    Total duration: 600s (10 minutes).
    """
    schedule = [
        (0,   60,  1500),  # 0-1 min
        (60,  180, 3000),  # 1-3 min
        # (180, 360, 6000),  # 3-6 min
        (180, 600, 8000),  # 6-10 min
    ]

    def tick(self):
        run_time = self.get_run_time()

        # Stop after 10 minutes
        if run_time >= 600:
            return None

        # Determine target RPS for the current window
        target_rps = 0
        for start, end, rps in self.schedule:
            if start <= run_time < end:
                target_rps = rps
                break

        env = self.environment
        runner = getattr(env, "runner", None)
        if not runner:
            return 0, SPAWN_RATE

        current_users = runner.user_count or 0
        current_rps = env.stats.total.current_rps or 0.0

        # Estimate per-user RPS; fall back if unknown
        if current_users > 0 and current_rps > 0:
            per_user_rps = max(current_rps / current_users, 0.0001)
        else:
            per_user_rps = RPS_PER_USER_FALLBACK

        # Compute required users to meet target RPS
        required_users = int(math.ceil(target_rps / per_user_rps)) if target_rps > 0 else 0
        required_users = max(0, min(required_users, MAX_USERS))

        # Aggressive spawn rate so we chase RPS rather than wait for pacing
        return required_users, SPAWN_RATE
