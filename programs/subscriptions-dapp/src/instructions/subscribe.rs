use crate::state::{CreatorProfile, Subscription};
use anchor_lang::{prelude::*, system_program};

pub fn _subscribe(ctx: Context<Subscribe>, plan_id: u64, creator: Pubkey) -> Result<()> {
    let creator_profile = &ctx.accounts.creator_profile;
    let subscription = &mut ctx.accounts.subscription;
    let subscriber = &ctx.accounts.subscriber;
    let creator_account = &ctx.accounts.creator_account;
    let system_program = &ctx.accounts.system_program;

    let cpi_context = CpiContext::new(
        system_program.to_account_info(),
        system_program::Transfer {
            from: subscriber.to_account_info(),
            to: creator_account.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, creator_profile.price)?;

    subscription.subscriber = subscriber.key();
    subscription.creator = creator;
    subscription.plan_id = plan_id;
    subscription.created_at = Clock::get()?.unix_timestamp;

    let duration_seconds = (creator_profile.duration_days as i64) * 86400;
    subscription.expires_at = Clock::get()?.unix_timestamp + duration_seconds;

    Ok(())
}

#[derive(Accounts)]
#[instruction(plan_id: u64)]
pub struct Subscribe<'info> {
    #[account(
        init,
        payer = subscriber,
        space = 8 + Subscription::INIT_SPACE,
        seeds = [b"subscription", subscriber.key().as_ref(), creator_profile.creator.as_ref(), plan_id.to_le_bytes().as_ref()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,
    #[account(
        seeds = [b"plan", creator_profile.creator.as_ref(), creator_profile.plan_id.to_le_bytes().as_ref()],
        bump
    )]
    pub creator_profile: Account<'info, CreatorProfile>,
    #[account(mut)]
    pub subscriber: Signer<'info>,
    #[account(mut)]
    pub creator_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
