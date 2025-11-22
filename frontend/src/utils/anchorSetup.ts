import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/subscriptions_dapp.json";
import type { SubscriptionsDapp } from "../types/subscriptions_dapp";

export const PROGRAM_ID = new PublicKey(import.meta.env.VITE_PROGRAM_ID);
export const RPC_URL = import.meta.env.VITE_RPC_URL;

export function getProgram(wallet: AnchorWallet | undefined) {
  if (!wallet) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program<SubscriptionsDapp>(idl as Idl, provider);

  return { program, connection, provider };
}
