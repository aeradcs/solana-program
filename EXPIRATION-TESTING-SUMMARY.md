# Expiration Testing Solution - Summary

## Problem

You need to test subscription expiration logic locally, but your program has a **minimum 1-day duration** requirement. Waiting 24+ hours to test expiration is impractical.

## Solution

We've implemented a **conditional compilation** approach using Rust feature flags that allows you to switch between:
- **Dev Mode**: Durations in **seconds** (for fast testing)
- **Production Mode**: Durations in **days** (for real deployment)

## What Changed

### 1. Backend (Anchor Program)

**File: `Cargo.toml`**
- Added `dev-testing` feature flag

**File: `src/lib.rs`**
```rust
// Dev mode: max 3600 seconds (1 hour)
#[cfg(feature = "dev-testing")]
pub const MAX_DURATION_DAYS: u32 = 3600;

// Production: max 365 days (1 year)
#[cfg(not(feature = "dev-testing"))]
pub const MAX_DURATION_DAYS: u32 = 365;
```

**File: `src/instructions/subscribe.rs`**
```rust
// Dev mode: treat duration as seconds
#[cfg(feature = "dev-testing")]
let duration_seconds = creator_profile.duration_days as i64;

// Production: treat duration as days (multiply by 86400)
#[cfg(not(feature = "dev-testing"))]
let duration_seconds = (creator_profile.duration_days as i64)
    .checked_mul(86400)
    .ok_or(SubscriptionsDappError::MathOverflow)?;
```

### 2. Frontend

**File: `frontend/.env.development`**
```
VITE_DEV_TESTING=true
```

**File: `frontend/src/pages/CreatePlan.tsx`**
- Conditional labels: "Duration (in seconds)" vs "Duration (in days)"
- Dev mode indicator: `[DEV MODE]` badge
- Warning message for small values
- Adjusted error messages

### 3. Build Scripts

**`build-dev.sh`** - Build with dev-testing feature
**`build-production.sh`** - Build for production (normal days)

### 4. Documentation

- `TESTING_EXPIRATION.md` - Comprehensive guide
- `QUICK-REFERENCE.md` - Quick commands cheat sheet
- `tests/README-EXPIRATION-TESTS.md` - Test-specific guide
- `tests/test-expiration-dev.ts` - Automated expiration tests

## How to Use

### For Local Testing (Short Durations)

```bash
# 1. Build with dev-testing feature
./build-dev.sh

# 2. Start validator and deploy
solana-test-validator  # Terminal 1
anchor deploy          # Terminal 2

# 3. Run frontend
cd frontend
npm run dev

# 4. Create a test plan
#    - Duration: 30 (this means 30 SECONDS, not days)
#    - Subscribe and wait 30 seconds
#    - Status will change to Expired
```

### For Production (Normal Days)

```bash
# 1. Build without dev-testing feature
./build-production.sh

# 2. Deploy to network
anchor deploy --provider.cluster devnet

# 3. Duration: 30 now means 30 DAYS
```

## Testing Examples

### Manual UI Testing (Dev Mode)

1. **Start environment:**
   ```bash
   ./build-dev.sh
   solana-test-validator
   anchor deploy
   cd frontend && npm run dev
   ```

2. **Create 30-second plan:**
   - Go to "Create Plan"
   - Name: "30-Second Test"
   - Price: 0.1 SOL
   - Duration: **30** (notice it says "in seconds")
   - Create Plan

3. **Subscribe and verify:**
   - Switch to different wallet
   - Subscribe to the plan
   - Go to "My Subscriptions"
   - Status: ✅ **Active**

4. **Wait and verify expiration:**
   - Wait 30+ seconds
   - Refresh or check status
   - Status: ❌ **Expired**

### Automated Testing (Dev Mode)

```bash
# Run expiration tests
./build-dev.sh
anchor test --skip-build tests/test-expiration-dev.ts

# Tests will:
# - Create plan with 10-second duration
# - Subscribe
# - Check immediately (Active)
# - Wait 12 seconds
# - Check again (Expired)
```

## Important Safety Notes

⚠️ **NEVER deploy dev-testing builds to mainnet or devnet!**

Always verify before deploying:
```bash
# Check your cluster
solana config get
# Should show mainnet/devnet, NOT localhost

# Verify you built for production
ls -la target/deploy/
# Should be built with ./build-production.sh
```

## Quick Reference Table

| Aspect | Dev Mode | Production Mode |
|--------|----------|-----------------|
| Build | `./build-dev.sh` | `./build-production.sh` |
| Duration Unit | Seconds | Days |
| Min Duration | 1 second | 1 day |
| Max Duration | 3600 seconds | 365 days |
| Example | 30 = 30 sec | 30 = 30 days |
| Frontend Label | "Duration (in seconds)" | "Duration (in days)" |
| Indicator | `[DEV MODE]` badge | No badge |
| Use For | Local testing only | Real deployment |

## Files Reference

### Must Read
- `QUICK-REFERENCE.md` - Fast commands and mode switching
- `TESTING_EXPIRATION.md` - Detailed guide with all scenarios

### Tests
- `tests/test-expiration-dev.ts` - Automated expiration tests
- `tests/README-EXPIRATION-TESTS.md` - How to run tests

### Scripts
- `build-dev.sh` - Build for testing (seconds)
- `build-production.sh` - Build for production (days)

## Troubleshooting

### "Duration exceeds maximum" error with small values

**Problem:** Program built without dev-testing feature

**Solution:**
```bash
./build-dev.sh
anchor deploy
```

### Subscription not expiring after waiting

**Problem:** Program might be using production mode (days)

**Solution:** Verify build mode and rebuild if needed

### Frontend still shows "days" instead of "seconds"

**Problem:** Environment variable not detected

**Solution:**
```bash
# Check .env.development exists
ls frontend/.env.development

# Restart dev server
cd frontend
npm run dev
```

## Success Criteria

You'll know it's working when:
- ✅ Frontend shows "Duration (in seconds)" with `[DEV MODE]` badge
- ✅ You can create a plan with duration=30
- ✅ Subscription shows Active immediately
- ✅ After 30 seconds, subscription shows Expired
- ✅ The `check_subscription` instruction returns `false` after expiration

## Next Steps

1. **Test manually** - Create a 30-second plan and verify it expires
2. **Run automated tests** - Verify all scenarios pass
3. **Switch to production mode** - Before deploying to devnet/mainnet
4. **Document findings** - Note any edge cases you discover

## Questions?

Refer to the detailed guides in this directory for comprehensive information.

---

**Created:** 2024
**Purpose:** Fast, practical testing of time-based subscription expiration
**Status:** Ready to use