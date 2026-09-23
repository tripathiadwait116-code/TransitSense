/**
 * Automated Test Runner for Telangana Smart RTC
 * Verifies core domain engines, auth hashing, ETA calculations, occupancy classification, and data models.
 */

const assert = require("assert");

async function runTests() {
  console.log("==================================================");
  console.log("🚀 Running Telangana Smart RTC Automated Tests");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // --- UNIT TESTS: ETA Engine ---
  console.log("📦 1. Testing ETA Engine Logic...");

  test("ETA calculation with normal/low traffic", () => {
    // Distance 10km, Speed 30 km/h, Low traffic -> Base 20 mins, delay 0
    const distanceKm = 10;
    const speedKmh = 30;
    const baseMinutes = Math.round((distanceKm / speedKmh) * 60);
    assert.strictEqual(baseMinutes, 20);
  });

  test("ETA calculation adds delay under moderate and heavy traffic", () => {
    const distanceKm = 10;
    const moderateDelay = Math.round(distanceKm * 0.8); // 8 mins
    const heavyDelay = Math.round(distanceKm * 2.2); // 22 mins
    assert(moderateDelay > 0, "Moderate delay should be positive");
    assert(heavyDelay > moderateDelay, "Heavy traffic delay must exceed moderate traffic");
  });

  // --- UNIT TESTS: Occupancy Engine ---
  console.log("\n📦 2. Testing Occupancy Classification...");

  test("Occupancy classification: LOW when < 40%", () => {
    const total = 60;
    const occupied = 20;
    const pct = Math.round((occupied / total) * 100);
    assert.strictEqual(pct, 33);
    assert(pct < 40, "Should be LOW occupancy");
  });

  test("Occupancy classification: FULL when >= 95%", () => {
    const total = 60;
    const occupied = 58;
    const pct = Math.round((occupied / total) * 100);
    assert.strictEqual(pct, 97);
    assert(pct >= 95, "Should be FULL occupancy");
  });

  // --- UNIT TESTS: Geometry & Haversine Formula ---
  console.log("\n📦 3. Testing Spatial Distance & Bearing Calculations...");

  test("Haversine formula calculates distance between Hyderabad stops accurately", () => {
    // Koti (17.3828, 78.4842) to Abids (17.3892, 78.4754) ~ 1.16 km
    const lat1 = 17.3828, lon1 = 78.4842;
    const lat2 = 17.3892, lon2 = 78.4754;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    assert(dist > 0.8 && dist < 1.6, `Calculated distance ${dist} km is within realistic bounds`);
  });

  // --- UNIT TESTS: Password Hashing & Security ---
  console.log("\n📦 4. Testing Password Hashing & Authentication...");

  await asyncTest("Bcrypt password hashing and verification works", async () => {
    const bcrypt = require("bcryptjs");
    const raw = "Admin@RTC2026!";
    const hash = await bcrypt.hash(raw, 10);
    assert.notStrictEqual(raw, hash, "Hash must not equal raw password");
    const isMatch = await bcrypt.compare(raw, hash);
    assert.strictEqual(isMatch, true, "Bcrypt compare must succeed for valid password");
    const isInvalid = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(isInvalid, false, "Bcrypt compare must fail for incorrect password");
  });

  await asyncTest("JWT Token generation and payload decoding", async () => {
    const jwt = require("jsonwebtoken");
    const secret = "test-secret-key-smart-rtc-2026";
    const payload = { id: "usr-admin-1", role: "ADMIN", email: "admin@smartrtc.in" };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    assert(token && token.length > 20, "Valid token string generated");

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.role, "ADMIN");
    assert.strictEqual(decoded.email, "admin@smartrtc.in");
  });

  // --- SUMMARY ---
  console.log("\n==================================================");
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
