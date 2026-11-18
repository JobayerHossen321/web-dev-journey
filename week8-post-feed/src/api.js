const SEED_POSTS = [
  {
    id: 'seed-1',
    title: 'Welcome to the Week 8 Capstone',
    body: 'This feed currently uses a simulated async API and localStorage. Next week it connects to Express + Postgres.',
    createdAt: '2026-11-15T09:00:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Derived State Over useEffect',
    body: 'Never store values in state that can be calculated directly from existing state or props during render.',
    createdAt: '2026-11-15T09:15:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'Lifting State Up',
    body: 'When siblings need shared data, move that state to their lowest common ancestor and pass callbacks down.',
    createdAt: '2026-11-15T09:30:00.000Z',
  },
];

export function fetchPosts({ signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timerId = setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('Network error: Failed to load posts from server.'));
      } else {
        resolve(SEED_POSTS);
      }
    }, 800);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timerId);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}