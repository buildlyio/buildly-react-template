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
      // eslint-disable-next-line no-console
      console.log('Version check failed:', error.message);
    } finally {
      this.isChecking = false;
    }
  }

  handleVersionUpdate(newVersion) {
    this.stop();

    const message = `A new version (${newVersion}) is available. The application will refresh automatically to load the latest version.`;

    // Auto-refresh with notification
    // Create a temporary notification div instead of using alert/confirm
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #2196F3; color: white; padding: 15px; border-radius: 4px; z-index: 10000; max-width: 400px;">
        <strong>New Version Available</strong><br/>
        ${message}<br/>
        <small>Refreshing in 10 seconds...</small>
      </div>
    `;
    document.body.appendChild(notification);

    // Auto-refresh after 10 seconds
    setTimeout(() => {
      window.location.reload(true);
    }, 10000);
  }

  static getCurrentVersion() {
    return CURRENT_VERSION;
  }
}

export default new VersionChecker();
