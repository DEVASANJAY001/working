const listeners = new Map();

export const eventBus = {
  subscribe(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event).add(callback);
    return () => {
      listeners.get(event)?.delete(callback);
    };
  },

  publish(event, data) {
    listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event listener for ${event}:`, err);
      }
    });
  }
};

// Enable cross-tab real-time sync using window storage event listener
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key) {
      try {
        const val = e.newValue ? JSON.parse(e.newValue) : null;
        eventBus.publish(e.key, val);
      } catch {
        // Fallback for non-JSON string values if any
        eventBus.publish(e.key, e.newValue);
      }
    }
  });
}
