const STORAGE_KEY = "portal_local_auth_users";
const SESSION_KEY = "portal_local_auth_session";

function readStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors in private browsing / restricted environments
  }
}

function removeStorage(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function getStoredUsers() {
  return readStorage(STORAGE_KEY) || [];
}

export function saveStoredUser(user) {
  const users = getStoredUsers();
  const existingIndex = users.findIndex((item) => item.username === user.username);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  writeStorage(STORAGE_KEY, users);
  return user;
}

export function findStoredUser(username) {
  const normalized = (username || "").trim().toLowerCase();
  return getStoredUsers().find((user) => user.username === normalized) || null;
}

export function setStoredSession(session) {
  writeStorage(SESSION_KEY, session);
}

export function getStoredSession() {
  return readStorage(SESSION_KEY);
}

export function clearStoredSession() {
  removeStorage(SESSION_KEY);
}
