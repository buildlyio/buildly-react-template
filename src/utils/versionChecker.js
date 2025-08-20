const CURRENT_VERSION = VERSION; // eslint-disable-line no-undef
const VERSION_CHECK_INTERVAL = 30000; // 30 seconds
const VERSION_ENDPOINT = '/version.json';

class VersionChecker {
  constructor() {
    this.intervalId = null;
    this.isChecking = false;
  }

  start() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.checkVersion();
    }, VERSION_CHECK_INTERVAL);

    // Initial check after 5 seconds
    setTimeout(() => {
      this.checkVersion();
    }, 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async checkVersion() {
    if (this.isChecking) {
      return;
    }

    this.isChecking = true;

    try {
      const response = await fetch(VERSION_ENDPOINT, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.version && data.version !== CURRENT_VERSION) {
          this.handleVersionUpdate(data.version);
        }
      }
    } catch (error) {
      console.log('Version check failed:', error.message);
    } finally {
      this.isChecking = false;
    }
  }

  handleVersionUpdate(newVersion) {
    this.stop();
    
    const message = `A new version (${newVersion}) is available. The application will refresh automatically to load the latest version.`;
    
    // Show alert and refresh
    if (window.confirm(`${message}\n\nClick OK to refresh now, or Cancel to continue (refresh will happen automatically in 10 seconds).`)) {
      window.location.reload(true);
    } else {
      // Auto-refresh after 10 seconds if user cancels
      setTimeout(() => {
        window.location.reload(true);
      }, 10000);
    }
  }

  getCurrentVersion() {
    return CURRENT_VERSION;
  }
}

export default new VersionChecker();