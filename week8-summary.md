## Week 8 Summary: React Fundamentals & Post Feed Capstone

### Overview
Completed Phase 3, Week 8 across React fundamentals (`week8-react-fundamentals`), stateful list/card UI (`week8-card-app`), and the `week8-post-feed` capstone (`7034768` through `a82fe88`), moving from plain React + Vite components and `localStorage` persistence toward Express + Postgres in Week 9. The `week8-post-feed` capstone itself spans `26076dd` and `a82fe88`.

### Daily Breakdown
- **Day 1 (`7034768`, `5f4e830`):** Built the mental model from first principles—imperative DOM vs. declarative UI (`UI = f(state)`), JSX compilation, components, props, and `useState` (`ProfileCard` and `Counter`).
- **Day 2 (`e7495c0`):** Practiced props, `children`, default values, and keyed lists.
- **Day 3 (`49fdcf8`):** Covered conditional rendering (`&&` vs. ternary/guards), immutable updates (`map`, `filter`, spread), and component identity/keys.
- **Day 4 (`8cd7162`):** Implemented controlled form inputs, validation rules, `touched` state, and form reset.
- **Day 5 (`1fc4edc`, `75c8946`):** Worked on `useEffect`, lazy `useState` initialization, `localStorage` persistence, and restoring container layout width.
- **Day 6 (`29b5652`):** Studied `useEffect` pitfalls, stale closures, effect identity, and race conditions. Before it clicked, I wrongly assumed that an earlier async request resolving later would either be ignored automatically by React or safely merge without clobbering newer state, rather than seeing how out-of-order responses or stale closures can overwrite state from a newer render without cancellation/guarding.
- **Day 7 (`26076dd`, `a82fe88`):** Built the `week8-post-feed` capstone, added the remaining project files and lockfile in `a82fe88`, and verified a clean clone before removing `/tmp/verify-clone`.

### Key Concepts Learned
- **Staged scope gap between `26076dd` and `a82fe88`:**
  - *Symptom:* `26076dd` included only 6 files (`index.html`, `package.json`, `src/App.css`, `src/App.jsx`, `src/components/PostForm.jsx`, and `vite.config.js`), leaving out critical files like `src/main.jsx`, `src/components/PostList.jsx`, `src/components/PostItem.jsx`, `src/api.js`, `package-lock.json`, `README.md`, `.gitignore`, `.oxlintrc.json`, `public/favicon.svg`, and `public/icons.svg`—so a fresh clone couldn't run until `a82fe88`.
  - *Cause:* I staged six specific file paths directly instead of running `git status` first, which left the remaining capstone source files, components, and lockfile out of `26076dd`. Checking `git status` before committing would have shown the untracked/remaining files, while testing a clean clone proves the project actually installs and runs end-to-end—something `git status` alone cannot prove.
  - *Fix:* Added the missing source files, components, and lockfile in `a82fe88` and verified installation and startup in a clean clone.
- **`readStoredPosts()` and lazy initialization:**
  - *Symptom:* Calling `readStoredPosts()` directly in the component body ran on every render rather than initializing inside the state initializer.
  - *Cause (Regression):* A call placed directly in the component body runs on every render (and would log repeatedly across re-renders rather than only during mount), whereas passing a function to `useState` (`useState(() => readStoredPosts())`) defers initialization to a lazy initializer.
  - *Cause (`<StrictMode>` in dev):* With the lazy initializer running in dev and `<StrictMode>` wrapping `<App />` in `src/main.jsx`, reloading printed `read storage: 1` and `read storage: 2` because `<StrictMode>` intentionally invokes initializer functions twice on mount in development to surface impure side effects, while production builds skip that extra dev pass. Because React may run an initializer twice in dev, initializers should stay pure/idempotent: reading `localStorage` is safe when guarded (`try/catch` and shape checks), while writing/mutating external state inside an initializer would be risky.
  - *Fix:* Moved storage reading into the `useState` lazy initializer in `src/App.jsx` and removed the temporary `console.count` call before committing.
- **Skipped fetch on reload when `localStorage` already has posts:**
  - *Symptom:* When a post was saved to `localStorage` during the throwaway-clone error-state test, reloading skipped a fresh fetch and kept the stored posts.
  - *Cause:* The mount effect returns early when `posts !== null` (and initial `status` derives from `posts !== null ? 'success' : 'loading'`), skipping `loadPosts()` when stored posts already exist.
  - *Fix:* Keep `<PostForm />` locked with `disabled={status !== 'success'}` outside `'success'` in normal app flow.
  - *Not done yet / Week 9:* `STORAGE_KEY` in `src/App.jsx` is still `week8_post_feed_v1`; bumping to a versioned key such as `_v2` (and handling real backend persistence) has not been applied yet and is queued for follow-up/Week 9.
- **Retry overwrite replacing local posts with seed data:**
  - *Symptom:* When **Retry** succeeded after a post was added in the throwaway-clone test, the added post was overwritten on screen and in `localStorage` by the 3 seed posts with no warning.
  - *Cause:* Retry calls `loadPosts`, which awaits `fetchPosts` and runs `setPosts(seededPosts)`, replacing state and triggering the `[posts]` effect to overwrite `localStorage` with `seededPosts`.
  - *Fix:* In `App.jsx`, `loadPosts` still replaces state with `seededPosts` on success, so the guard in normal flow is keeping `<PostForm />` on `disabled={status !== 'success'}` during non-success states, with merge/reconciliation behavior deferred to Week 9 when real backend persistence is wired up.

### Skills Demonstrated
- Tracing Git commits (`git show --stat`) and verifying a clean clone that installs (`npm install`) and runs.
- Diagnosing React render/effect behavior (`useState` lazy initialization, `<StrictMode>` dev behavior, and race conditions) and isolating edge cases in a throwaway clone.
- Making deliberate scope and defer/keep decisions (`<PostForm />` keeping `disabled={status !== 'success'}` now and taking richer submission/error states in Week 9).

### Milestone
Completed the `week8-post-feed` capstone through `a82fe88`, verified a clean clone that installs (`npm install`) and runs, and documented reproduced failure modes along with the Day 6/7 explanations.
