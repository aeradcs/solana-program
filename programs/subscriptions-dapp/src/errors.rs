use anchor_lang::prelude::*;

#[error_code]
pub enum SubscriptionsDappError {
    #[msg("Subscription has expired")]
    SubscriptionExpired,
}
