import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { PROGRAM_ID } from './anchorSetup';

export function getCreatorProfilePda(
  creator: PublicKey,
  planId: BN
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('plan'),
      creator.toBuffer(),
      planId.toArrayLike(Buffer, 'le', 8),
    ],
    PROGRAM_ID
  );
}

export function getSubscriptionPda(
  subscriber: PublicKey,
  creator: PublicKey,
  planId: BN
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('subscription'),
      subscriber.toBuffer(),
      creator.toBuffer(),
      planId.toArrayLike(Buffer, 'le', 8),
    ],
    PROGRAM_ID
  );
}
