/**
 * Global Loading Manager
 * Manages global loading state that can be accessed from anywhere
 */
class GlobalLoadingManager {
  constructor() {
    this.listeners = new Set();
    this.loading = false;
    this.message = 'Loading...';
    this.requestCount = 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener({
      loading: this.loading,
      message: this.message,
    }));
  }

  show(message = 'Loading...') {
    this.requestCount++;
    this.loading = true;
    this.message = message;
    this.notify();
  }

  hide() {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.loading = false;
      this.notify();
    }
  }

  reset() {
    this.requestCount = 0;
    this.loading = false;
    this.notify();
  }

  getState() {
    return {
      loading: this.loading,
      message: this.message,
    };
  }
}

// Singleton instance
const globalLoadingManager = new GlobalLoadingManager();

export default globalLoadingManager;
