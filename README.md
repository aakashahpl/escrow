# Escrow — Full Stack Setup (Frontend + Backend + Smart Contract)

This repo contains three parts:

- `clg-project/`: Next.js frontend (users connect MetaMask and call the API)
- `backend/`: Express + Postgres API (deploys/interacts with the escrow contract)
- `escrow_contract/`: Hardhat project (Solidity escrow contract + artifacts used by backend)

## Prerequisites

- Node.js (recommended: Node 18+)
- npm
- PostgreSQL (recommended: Postgres 14+)

Optional (for UI wallet flows):
- MetaMask extension in your browser

## Quick start (3 terminals)

From the repo root:

### 1) Smart contract: compile + start local blockchain

The backend imports the compiled Hardhat artifact from `escrow_contract/artifacts/...`, so compile once before running the backend.

```bash
cd escrow_contract
npm install
npx hardhat compile
npx hardhat node
```

Keep this terminal running. Hardhat prints **test accounts** and **private keys** — you will use one key as `DEPLOYER_PRIVATE_KEY` for the backend.

#### (Optional) Use the local chain in MetaMask

If you want to use the UI with MetaMask against your local Hardhat node:

- Add a network in MetaMask:
  - **Network name**: `Localhost 8545`
  - **RPC URL**: `http://127.0.0.1:8545`
  - **Chain ID**: `31337`
  - **Currency symbol**: `ETH`
- Import an account using one of the **private keys** printed by `npx hardhat node` (this account will have test ETH on the local chain)

### 2) Backend: set env + migrate DB + start API

#### Create Postgres DB

Example using `psql` (adjust names/passwords as you like):

```bash
# enter psql as postgres (macOS: this may differ depending on your install)
psql postgres

-- in the psql prompt:
CREATE DATABASE escrow_app;
CREATE USER escrow_user WITH PASSWORD 'StrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE escrow_app TO escrow_user;
\q
```

#### Run migrations

From the repo root:

```bash
cd backend

# run migrations in order
psql "postgresql://escrow_user:StrongPassword123!@localhost:5432/escrow_app" -f migrations/001_init.sql
psql "postgresql://escrow_user:StrongPassword123!@localhost:5432/escrow_app" -f migrations/002_users_jobs.sql
psql "postgresql://escrow_user:StrongPassword123!@localhost:5432/escrow_app" -f migrations/003_proposals.sql
psql "postgresql://escrow_user:StrongPassword123!@localhost:5432/escrow_app" -f migrations/004_disputes_ratings.sql
```

#### Create `backend/.env`

Create a file `backend/.env`:

```bash
PORT=3000
FRONTEND_URL=http://localhost:3001

DATABASE_URL=postgresql://escrow_user:StrongPassword123!@localhost:5432/escrow_app

# Hardhat local node (started in step 1)
RPC_URL=http://127.0.0.1:8545

# Copy ONE private key from the Hardhat node output (do not include quotes)
DEPLOYER_PRIVATE_KEY=YOUR_HARDHAT_PRIVATE_KEY
```

#### Install + run backend

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:3000` and serves routes under `http://localhost:3000/api`.

### 3) Frontend: set env + start Next.js

#### Create `clg-project/.env.local`

Create `clg-project/.env.local`:

```bash
# Backend base URL used by the frontend HTTP client
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### Install + run frontend

```bash
cd clg-project
npm install
npm run dev -- --port 3001
```

Open `http://localhost:3001`.

## Useful commands

### Smart contract (Hardhat)

```bash
cd escrow_contract
npx hardhat test
```

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd clg-project
npm run dev -- --port 3001
```

## Troubleshooting

### Backend fails with “Cannot find …/escrow_contract/artifacts/…/Escrow.json”

You need to compile the contract once:

```bash
cd escrow_contract
npx hardhat compile
```

### Frontend calls the wrong API URL

Ensure `clg-project/.env.local` has:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Then restart the frontend dev server.

### CORS error in browser

Make sure `backend/.env` has:

```bash
FRONTEND_URL=http://localhost:3001
```

and restart the backend.
