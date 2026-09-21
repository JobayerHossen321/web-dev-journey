# Week 7, Day 4: Async/Await Migration to PostgreSQL

## Overview
Migrated the full authentication API (register, login, logout, session middleware, protected route) from synchronous `better-sqlite3` calls to asynchronous PostgreSQL queries using `pg`, with `$1`-style parameterized placeholders. What started as a straightforward syntax conversion surfaced a chain of real-world environment and schema issues that needed independent debugging — schema drift, an unexecuted migration file, session-column misuse, and Codespaces service persistence quirks.

## Daily Breakdown

**Theory first — async failure modes**
Worked through why `pool.query()` returns a `Promise` rather than a synchronous result, and traced the exact failure chain of forgetting `async`/`await`: a pending Promise, `result.rows` evaluating to `undefined`, and `res.json(undefined)` silently sending a `200` with an empty body — a bug that fails silently rather than loudly.

**Express 5 error-forwarding behavior**
Established that Express 5 (confirmed via `npm list express` → `5.2.1`) auto-forwards rejected Promises from `async` handlers to centralized error middleware, unlike Express 4. Used this to make a deliberate design split: explicit `try/catch` on write routes (register) that need to inspect specific Postgres error codes, versus relying on automatic forwarding for read routes and generic failures.

**Folder/project structure decision**
Discovered Day 2–3 work had already been placed in a dedicated `week7-postgres` folder (not `week5-node-express`), containing `pool.js` (connection pool config) and `schema.sql` (table definitions). Confirmed this as the correct home for the migration going forward.

**Route conversion**
Copied `server.js` from `week5-node-express` and converted every route (`/api/register`, `/api/login`, `/api/logout`, `requireAuth` middleware, `/api/me`) to `async` functions using `await pool.query(...)` with `$1`/`$2` placeholders in place of SQLite's `?` and `.get()/.run()` calls.

**Debugging chain (all diagnosed hands-on via testing):**
1. **Missing `username` column in INSERT** — `users` table requires `username` (`UNIQUE NOT NULL`), but the initial insert omitted it entirely, causing a silent `500` masked as "Internal server error."
2. **Session table column misuse** — `sessions.id` is an auto-generated `SERIAL` integer, but the code was inserting the hex session token into `id` instead of the correct `token` column, and never supplying `token` at all. Fixed by inserting into `token`, letting `id` auto-generate, and updating `requireAuth`/`logout` lookups to query by `token`.
3. **`ECONNREFUSED`** — Postgres service wasn't running in the Codespace (`sudo service postgresql start` required); traced via `pg_isready` and `service postgresql status`.
4. **`relation "users" does not exist` (`42P01`)** — `schema.sql` had been written on Day 2 but never actually executed against the database. Root-caused via Postgres server logs, then fixed with `psql -f schema.sql`.
5. **`psql` peer-vs-TCP auth failure** — distinguished Postgres's peer authentication (Unix socket, OS-user-based) from `scram-sha-256` password authentication (TCP), and used `-h localhost -p 5432` to force the correct auth path.
6. **Schema/code field mismatch** — `schema.sql` used `username`; `server.js` referenced `name`. Fixed by aligning the code to the schema and adding a new `isValidUsername` validator, consistent with existing `isValidEmail`/`isValidPassword` patterns.
7. **Unique-constraint disambiguation bug** — the `23505` handler initially reported "Email is already registered" for *any* unique violation, including duplicate usernames. Fixed by checking `err.constraint` to branch between "Username is already taken" and "Email is already registered," then verified both cases independently via curl.

**End-to-end verification**
Full auth lifecycle tested and confirmed correct:
`register (201)` → `login (200, cookie set)` → `/api/me while authenticated (200, correct user)` → `logout (200, cookie cleared)` → `/api/me after logout with replayed cookie (401)` — confirming session deletion is server-side and real, not just a cleared client cookie.

## Key Concepts Learned
- Promise-based async control flow and the specific silent-failure signature of forgetting `await`
- Express 5's automatic Promise-rejection forwarding vs. Express 4's manual `try/catch` requirement
- Postgres parameterized query syntax (`$1, $2...`) and the `RETURNING` clause replacing `lastInsertRowid`
- Postgres error codes: `23505` (unique_violation), `42P01` (undefined_table), and `err.constraint` for disambiguating which column collided
- `ON DELETE CASCADE` vs `ON DELETE SET NULL` foreign key semantics and their effect on whether a delete can ever raise `23503`
- Peer authentication vs. password (`scram-sha-256`) authentication in `pg_hba.conf`, and how socket vs. TCP connections trigger different rules
- Why writing a `.sql` schema file doesn't create tables — it must be explicitly executed
- Codespaces/container service persistence: Postgres doesn't survive container pauses gracefully and requires manual restart each session

## Skills Demonstrated
- Reading raw Postgres error objects and server logs to root-cause failures rather than guessing
- Systematic column-by-column schema-vs-query comparison to catch mismatches
- Independent test-driven verification (curl + cookie files) of a full session-based auth lifecycle
- Recognizing and removing a self-introduced debug `console.log` before considering work complete
- Catching and correcting an assumption-driven code comment ("if name exists in schema...") by going back to source of truth

## Milestone
The authentication API is now fully running on PostgreSQL with async/await throughout, correct parameterized queries, environment-aware error handling, and verified session security — feature-complete parity with the Week 6 SQLite version, migrated to the production-realistic database layer planned for the eventual AWS RDS move in Phase 4.
