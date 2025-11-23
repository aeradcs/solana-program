use anchor_lang::prelude::*;

pub const MAX_PLAN_NAME_LEN: usize = 200;

#[account]
#[derive(InitSpace)]
pub struct CreatorProfile {
    pub creator: Pubkey,
    pub plan_id: u64,
    #[max_len(200)]
    pub name: String,
    pub price: u64,
    pub duration_days: u32,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Subscription {
    pub subscriber: Pubkey,
    pub creator: Pubkey,
    pub plan_id: u64,
    pub expires_at: i64,
    pub created_at: i64,
}
