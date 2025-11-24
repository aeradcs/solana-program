# Project Description

**Deployed Frontend URL:** [To be deployed]

**Solana Program ID:** 8hSScVud3dY7iV2r4aGDFBduXAZh5j31X3P8GnCaznZd

## Project Overview

### Description
A decentralized subscription platform built on Solana that enables creators to offer subscription-based services and users to subscribe to them. Creators can create multiple subscription plans with custom pricing and duration, while subscribers can browse available plans, subscribe to any creator's offerings, and manage their active subscriptions. The dApp handles automatic payment transfers and tracks subscription expiration using on-chain timestamps.

### Key Features
- **Create Subscription Plans**: Creators can set up unlimited subscription tiers with custom names, prices (in SOL), and durations
- **Browse Marketplace**: Users can explore all available subscription plans from all creators on the platform
- **Subscribe to Plans**: Users can subscribe to any creator's plan with automatic SOL transfer and expiration tracking
- **Manage Subscriptions**: View all active and expired subscriptions with real-time status updates
- **View Creator Dashboard**: Creators can monitor all their published subscription plans

### How to Use the dApp
1. **Connect Wallet** - Connect your Solana wallet (Phantom or Backpack)
2. **Create Plans** (Creator flow) - Navigate to "Create Plan", enter plan name, price in SOL, and duration in days
3. **Browse Plans** - Visit "Marketplace" to see all available subscription plans from all creators
4. **Subscribe** - Click "Subscribe" on any plan to start a subscription (transfers SOL to creator)
5. **Manage** - View your created plans in "My Plans" or your subscriptions in "My Subscriptions"

## Program Architecture
The Subscriptions dApp uses a dual-account architecture with PDAs for data isolation. The program manages CreatorProfile accounts (subscription plans) and Subscription accounts (user subscriptions), with three core instructions handling plan creation, subscription purchases, and status verification.

### PDA Usage
The program uses Program Derived Addresses to create unique accounts for plans and subscriptions, ensuring data isolation and preventing conflicts.

**PDAs Used:**
- **CreatorProfile PDA**: Derived from seeds `["plan", creator_pubkey, plan_id_bytes]` - ensures each creator can create unlimited unique plans
- **Subscription PDA**: Derived from seeds `["subscription", subscriber_pubkey, creator_pubkey, plan_id_bytes]` - ensures each user can subscribe to multiple plans from the same creator

### Program Instructions
**Instructions Implemented:**
- **create_subscription_plan**: Creates a new subscription plan with specified name, price, and duration; validates inputs and initializes CreatorProfile account
- **subscribe**: Subscribes user to a plan, transfers SOL from subscriber to creator, calculates expiration timestamp, and initializes Subscription account
- **check_subscription**: Verifies if a subscription is still active by comparing current time with expiration timestamp; returns boolean result

### Account Structure
```rust
#[account]
pub struct CreatorProfile {
    pub creator: Pubkey,        // Plan creator's wallet
    pub plan_id: u64,           // Unique plan identifier
    pub name: String,           // Plan name (max 200 chars)
    pub price: u64,             // Price in lamports
    pub duration_days: u32,     // Subscription duration
    pub created_at: i64,        // Plan creation timestamp
}

#[account]
pub struct Subscription {
    pub subscriber: Pubkey,     // Subscriber's wallet
    pub creator: Pubkey,        // Creator's wallet
    pub plan_id: u64,           // Subscribed plan ID
    pub expires_at: i64,        // Expiration timestamp
    pub created_at: i64,        // Subscription start timestamp
}
```

## Testing

### Test Coverage
Comprehensive test suite with 17 tests covering all instructions, including edge cases and error scenarios to ensure program security and data integrity.

**Happy Path Tests:**
- **Create Plan Success**: Successfully creates subscription plan with valid parameters
- **Subscribe Success**: User successfully subscribes to a plan with SOL transfer
- **Check Active Subscription**: Correctly identifies active subscriptions

**Unhappy Path Tests:**
- **Invalid Price**: Rejects plans with zero or excessive prices (max 1000 SOL)
- **Invalid Duration**: Rejects plans with zero or excessive duration (max 365 days)
- **Invalid Name**: Rejects empty names or names exceeding 200 characters
- **Insufficient Funds**: Prevents plan creation or subscription without sufficient balance
- **Duplicate Plan**: Prevents creating duplicate plans with same creator and plan_id
- **Self-Subscription**: Blocks creators from subscribing to their own plans
- **Creator Mismatch**: Validates creator account matches plan owner
- **Expired Subscription**: Correctly identifies and returns false for expired subscriptions

### Running Tests
```bash
anchor test
```

### Additional Notes for Evaluators

This project demonstrates practical use of PDAs for multi-instance data structures (multiple plans per creator, multiple subscriptions per user). The biggest challenge was implementing proper timestamp-based expiration logic and ensuring all error cases were handled gracefully. The frontend uses read-only connections to allow browsing without wallet connection, improving UX. All validation happens both client-side (for UX) and on-chain (for security).