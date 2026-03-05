
-- Initial migration to create escrows and milestones tables
-- For ubuntu users, you can run this SQL script using psql command line tool:
--1.Open terminal and type  sudo -u postgres psql
--2. Create a new database => CREATE DATABASE <your_database>;
--3. Create a new user => CREATE USER <escrow_user> WITH PASSWORD <'StrongPassword123!'>;
--4. Grant privileges to the user => GRANT ALL PRIVILEGES ON DATABASE <your_database> TO <escrow_user>;
--3. Exit psql: \q
--4. Then run =>  psql -U <escrow_user> -h localhost -d <escrow_app> -f migrations/001_init.sql

CREATE TABLE escrows (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42) UNIQUE NOT NULL,
    buyer_address VARCHAR(42) NOT NULL,
    seller_address VARCHAR(42) NOT NULL,
    total_amount NUMERIC(20, 0) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    escrow_id INTEGER REFERENCES escrows(id) ON DELETE CASCADE,
    milestone_index INTEGER NOT NULL,
    amount NUMERIC(20, 0) NOT NULL,
    funded BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);