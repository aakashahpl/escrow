-- Migration 004: disputes + user ratings

ALTER TABLE users
ADD COLUMN rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0
CHECK (rating >= 0.0 AND rating <= 5.0);

CREATE TABLE disputes (
    id SERIAL PRIMARY KEY,
    escrow_id INTEGER NOT NULL REFERENCES escrows(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED_TO_SELLER', 'REFUNDED_TO_BUYER', 'CANCELLED')),
    opened_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_tx_hash VARCHAR(66),
    UNIQUE (escrow_id)
);

CREATE TABLE dispute_votes (
    id SERIAL PRIMARY KEY,
    dispute_id INTEGER NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    voter_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (dispute_id, voter_user_id)
);

