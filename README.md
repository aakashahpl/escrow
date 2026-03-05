# Freelance Marketplace — Job & Contract Flow

## Overview

This platform connects **buyers** (clients who post jobs) and **sellers** (freelancers who complete work). Payments are secured by a smart contract deployed on the blockchain. The escrow contract holds funds in milestones, releasing each payment only after the buyer approves the completed work.

---

## Actors

| Actor | Role |
|---|---|
| **Buyer** | Posts jobs, funds milestones, approves completed work |
| **Seller** | Completes work, receives milestone payments upon approval |

---

## Full Flow

### Step 1 — Register Users

Both parties must register before interacting with the platform.

**Endpoint:** `POST /api/users`

**Request body:**
```json
{
  "walletAddress": "0xABC...123",
  "username": "alice",
  "email": "alice@example.com",
  "role": "BUYER"
}
```

**Role options:** `BUYER` | `SELLER` | `BOTH`

Each user is uniquely identified by their **blockchain wallet address**. This wallet is also used to interact with the smart contract on-chain.

---

### Step 2 — Buyer Posts a Job

The buyer creates a job listing describing the work they need done. No money moves at this stage — this is just a listing.

**Endpoint:** `POST /api/jobs`

**Request body:**
```json
{
  "postedBy": 1,
  "title": "Build a DeFi dashboard",
  "description": "React frontend that shows live token prices and wallet balances.",
  "budget": "2.5"
}
```

**What happens:**
- A new job record is created with `status = OPEN`
- `escrow_id` is `NULL` — no contract exists yet
- The job is visible to all sellers via `GET /api/jobs`

---

### Step 3 — Buyer & Seller Agree on Terms (Off-Platform)

The buyer reviews proposals and selects a seller. They agree off-platform (or via messaging) on:

- Milestones and deliverables
- Amount per milestone (in ETH)

---

### Step 4 — Buyer Deploys the Escrow Contract

Once terms are agreed, the buyer deploys a smart contract that holds the milestone funds. This is a **real on-chain transaction** that costs gas.

**Endpoint:** `POST /api/escrow/create`

**Request body:**
```json
{
  "buyer": "0xBUYER_WALLET",
  "seller": "0xSELLER_WALLET",
  "milestones": [
    { "amount": "1.0" },
    { "amount": "0.75" },
    { "amount": "0.75" }
  ]
}
```

**What happens:**
- A new `Escrow` smart contract is deployed on-chain with the buyer and seller wallet addresses baked in
- Each milestone amount is recorded in the contract and in the database
- Returns an `escrowId` and `contractAddress`

**Response:**
```json
{
  "success": true,
  "escrowId": 5,
  "contractAddress": "0xCONTRACT..."
}
```

---

### Step 5 — Link the Escrow to the Job

The buyer ties the deployed contract back to the job listing. This marks the job as hired and in progress.

**Endpoint:** `PATCH /api/jobs/:id/escrow`

**Request body:**
```json
{
  "escrowId": 5
}
```

**What happens:**
- `jobs.escrow_id` is set to the escrow record
- `jobs.status` changes from `OPEN` → `IN_PROGRESS`

---

### Step 6 — Buyer Funds a Milestone

Before the seller starts work on a milestone, the buyer sends the ETH for that milestone into the contract.

**Endpoint:** `POST /api/escrow/fund`

**Request body:**
```json
{
  "escrowId": 5,
  "milestoneIndex": 0
}
```

**What happens:**
- The buyer's wallet sends ETH to the contract equal to the milestone amount
- The contract locks the funds
- `milestones.funded` is set to `TRUE` in the database

---

### Step 7 — Seller Completes Work

The seller completes the deliverable for the milestone and notifies the buyer (off-platform or via messaging).

---

### Step 8 — Buyer Approves the Milestone

After reviewing the work, the buyer approves the milestone. This triggers the contract to release the funds directly to the seller's wallet.

**Endpoint:** `POST /api/escrow/approve`

**Request body:**
```json
{
  "escrowId": 5,
  "milestoneIndex": 0
}
```

**What happens:**
- The smart contract transfers the milestone ETH to the seller's wallet
- `milestones.approved` and `milestones.released` are set to `TRUE` in the database

---

### Step 9 — Repeat for Remaining Milestones

Steps 6–8 repeat for each subsequent milestone until all work is complete.

---

### Step 10 — Mark Job as Completed

Once all milestones are approved, the buyer updates the job status.

**Endpoint:** `PATCH /api/jobs/:id`

**Request body:**
```json
{
  "status": "COMPLETED"
}
```

---

## Status Reference

### Job Statuses

| Status | Meaning |
|---|---|
| `OPEN` | Job posted, no freelancer hired yet |
| `IN_PROGRESS` | Escrow deployed and linked, work underway |
| `COMPLETED` | All milestones approved, job finished |
| `CANCELLED` | Job was cancelled before completion |

### Milestone Statuses (flags)

| Flag | Meaning |
|---|---|
| `funded = false` | Buyer has not yet sent ETH for this milestone |
| `funded = true` | ETH is locked in the contract |
| `approved = true` | Buyer approved the work |
| `released = true` | ETH was sent to the seller's wallet |

---

## Complete API Reference

### Users

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Register a new user |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `GET` | `/api/users/wallet/:walletAddress` | Get user by wallet address |
| `PATCH` | `/api/users/:id` | Update user profile |
| `DELETE` | `/api/users/:id` | Delete user |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Post a new job |
| `GET` | `/api/jobs` | List all jobs (optional `?status=` filter) |
| `GET` | `/api/jobs/:id` | Get job by ID |
| `GET` | `/api/jobs/user/:userId` | Get all jobs posted by a user |
| `PATCH` | `/api/jobs/:id` | Update job fields or status |
| `PATCH` | `/api/jobs/:id/escrow` | Attach escrow to job (hire a freelancer) |
| `DELETE` | `/api/jobs/:id` | Delete job |

### Escrow & Milestones

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/escrow/create` | Deploy a new escrow smart contract |
| `POST` | `/api/escrow/fund` | Fund a milestone (buyer sends ETH to contract) |
| `POST` | `/api/escrow/approve` | Approve milestone and release ETH to seller |

---

## Visual Flow

```
Buyer registers          Seller registers
      │                        │
      └──────────┬─────────────┘
                 │
          Buyer posts job
          [status: OPEN]
                 │
         Seller is selected
        (off-platform agreement)
                 │
      Buyer deploys escrow contract
      POST /api/escrow/create
                 │
      Buyer links escrow to job
      PATCH /api/jobs/:id/escrow
      [status: IN_PROGRESS]
                 │
        ┌────────▼────────┐
        │   Milestone N   │  ← repeats for each milestone
        │                 │
        │  Buyer funds    │  POST /api/escrow/fund
        │  Seller works   │
        │  Buyer approves │  POST /api/escrow/approve
        │  ETH released   │
        └────────┬────────┘
                 │
        All milestones done
                 │
        Buyer marks complete
        PATCH /api/jobs/:id
        [status: COMPLETED]
```
