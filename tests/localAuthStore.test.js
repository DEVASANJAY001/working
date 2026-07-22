import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearStoredSession,
  findStoredUser,
  getStoredSession,
  saveStoredUser,
  setStoredSession,
} from '../src/services/localAuthStore.js';

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

test('local auth store can save, find, and persist a session', () => {
  const storage = createLocalStorageMock();
  global.window = { localStorage: storage };

  saveStoredUser({
    username: 'demo@example.com',
    password: 'secret123',
    name: 'Demo User',
    confirmed: false,
  });

  const user = findStoredUser('demo@example.com');
  assert.ok(user);
  assert.equal(user.name, 'Demo User');

  setStoredSession({ username: 'demo@example.com', name: 'Demo User', isAuthenticated: true });
  assert.deepEqual(getStoredSession(), {
    username: 'demo@example.com',
    name: 'Demo User',
    isAuthenticated: true,
  });

  clearStoredSession();
  assert.equal(getStoredSession(), null);
});
