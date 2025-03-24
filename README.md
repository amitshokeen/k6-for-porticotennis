# Load Testing Portico Tennis App using k6

## 🏁 Getting Started
To run the load tests for the Portico Tennis app using [k6.io](https://k6.io):

1. **Ensure k6 is installed on your system.**
   - On macOS: `brew install k6`
   - To verify: `k6 version`

2. **Run the test script:**
   ```bash
   k6 run test-auth.js
   ```

---

## 🔍 About the Test
This test simulates user authentication and verifies the functionality of an authenticated route.

### Configuration:
- **Virtual Users (VUs):** 50
- **Duration:** 60 seconds
- **Target URL:** `https://www.porticotennis.link/auth/login`
- **Payload Type:** `application/x-www-form-urlencoded`

### The test performs the following checks:
1. Login returns a **200 OK** response.
2. Response includes an **access token** in the cookie.
3. It then uses this token to load `/bookings/bookings-page`, expecting a **200 OK** response.

---

## ✅ Test Results Summary

```text
✓ login successful (200)
✓ got access_token_cookie
✓ bookings page loads (200)

checks.........................: 100.00% ✓ 750 ✗ 0
http_req_duration..............: avg=6.68s min=53.92ms max=13.42s
iteration_duration.............: avg=14.39s
vus_max........................: 50
http_req_failed................: 0.00%
```

> All checks passed successfully. The test ran 250 complete iterations over 50 virtual users in 60 seconds.

---

## ⚠️ Performance Considerations
While the test passed, the response times are **higher than ideal**:

- `http_req_duration`: average ~6.68 seconds
- `iteration_duration`: average ~14.39 seconds

These delays likely stem from two main factors:

### 1. **SQLite Limitations**
- SQLite does **not** handle high concurrency well.
- With multiple users accessing the DB simultaneously, reads/writes are **serialized**, leading to request queuing and latency.

### 2. **Droplet Resources**
- Current setup: 512 MB RAM, 1 shared CPU.
- This is sufficient for light usage but can struggle under even moderate concurrent traffic.

---

## 🔧 Recommendations
If performance becomes an issue, consider:

1. **Upsizing the Droplet**
   - Moving to a 1 GB RAM, 2 CPU plan may help, but it will incur added cost.

2. **Switching to PostgreSQL**
   - Ideal for concurrent access and scaling.
   - However, this introduces complexity and hosting costs.

For now, given that this is a **community project**, and there are:
- Daily backups to Google Drive using `rclone + cron`
- Droplet-level backups via DigitalOcean

the current architecture is functional and cost-effective.

---

## 💡 Design Decisions

1. **No Docker**
   - Docker adds an additional layer and consumes precious system resources.
   - Running natively ensures better performance on a small droplet.

2. **No Autoscaling**
   - Though DigitalOcean offers autoscaling, the app uses a single `tennisapp.db` file.
   - Introducing multiple droplets could lead to **data inconsistencies**.
   - A shared DB like PostgreSQL would be needed for true horizontal scaling.

---

## 📌 Final Thoughts
This load test serves as a **baseline**. If community interest and usage grow, or if members are willing to contribute to running costs, the app’s infrastructure can be scaled and improved accordingly.

In the meantime, the current setup strikes a balance between simplicity, stability, and affordability for a small community project.

---

*Created with ❤️ for the Portico Tennis community.*
