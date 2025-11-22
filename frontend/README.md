# Subscriptions dApp Frontend

React + TypeScript + Vite frontend for the Solana Subscriptions dApp.

## Overview

This frontend allows users to:
- Browse subscription plans from all creators (Marketplace)
- Create their own subscription plans (Create Plan)
- View their created plans (My Plans)
- Subscribe to plans and view their subscriptions (My Subscriptions)

## Prerequisites

- Node.js 16+ and npm
- Solana CLI tools
- Anchor CLI
- Backpack wallet (recommended for local testing) or Phantom wallet (for production)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure the Solana program is built and deployed:
```bash
cd ..
anchor build
anchor deploy
```

3. Ensure the `.env` file has the correct values:
```
VITE_RPC_URL=http://localhost:8899
VITE_PROGRAM_ID=GYqT2YbmDGZzD8Px4j14Wx3Jap7BM9oqgFJ1A19NMNka
```

## Running the Application

1. Start local Solana validator (in a separate terminal):
```bash
solana-test-validator
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

4. Connect your wallet (Backpack recommended for local testing - make sure it's set to localhost network)

5. Airdrop some SOL to your wallet:
```bash
solana airdrop 2 <your-wallet-address>
```

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components (Marketplace, My Plans, etc.)
├── utils/           # Utility functions and helpers
│   ├── anchorSetup.ts    # Anchor program setup
│   ├── constants.ts      # Constants and helper functions
│   └── helpers.ts        # PDA derivation helpers
├── idl/             # Program IDL
├── types/           # TypeScript types
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS
- @coral-xyz/anchor
- @solana/web3.js
- @solana/wallet-adapter-react
- React Router DOM

## Usage

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **Create a Plan**: Go to "Create Plan" and fill out the form
3. **View Your Plans**: Check "My Plans" to see your created subscription plans
4. **Browse Plans**: Visit "Marketplace" to see all available plans
5. **Subscribe**: Click "Subscribe" on any plan in the Marketplace
6. **View Subscriptions**: Check "My Subscriptions" to see your active/expired subscriptions