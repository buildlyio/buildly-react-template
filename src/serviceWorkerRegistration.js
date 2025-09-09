/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import i18n from './i18n/index';
import { useCustomAlertStore } from '@zustand/customAlert/customAlertStore';

// Get the alert function directly from the store (not using React hook)
const showAlert = (message, title, buttonText) => {
  const { alert } = useCustomAlertStore.getState();
  return alert(message, title, buttonText);
};

/**
 * Displays a UI alert to the user indicating a new version of the application is available.
 * Automatically reloads the page to activate the latest version of the service worker.
 *
 * @param {ServiceWorkerRegistration} registration - The current service worker registration.
 */

const showRefreshUI = async (registration) => {
  // Show an alert notifying the user about the new version
  // Show custom alert and wait for user acknowledgment
  await showAlert(
    i18n.t('alerts.newVersionAlert'),
    i18n.t('alerts.newVersionTitle'),
    i18n.t('alerts.newVersionButton'),
  );
  // Force the page to reload and fetch the updated service worker
  window.location.reload(true);
};

/**
 * Handles a new service worker update lifecycle.
 * Executes a callback when a new service worker is installed and waiting to activate.
 *
 * @param {ServiceWorkerRegistration} registration - The current service worker registration.
 * @param {Function} callback - The function to call when the new SW is ready.
 */
const onNewServiceWorker = (registration, callback) => {
  if (!registration) return;

  // If there's already a waiting service worker, immediately trigger the callback
  if (registration.waiting) {
    // This can happen if another tab has already installed the new SW
    return callback();
  }

  /**
   * Listens for changes in the installing service worker's state.
   * When the state becomes 'installed', it means the new SW is ready to activate.
   */
  const listenInstalledStateChange = () => {
    registration.installing?.addEventListener('statechange', (event) => {
      if (event.target.state === 'installed') {
        console.log('[SW] New service worker installed');
        // Trigger the callback to inform the user or take action
        callback();
      }
    });
  };

  // If the SW is currently installing, attach state change listener
  if (registration.installing) {
    return listenInstalledStateChange();
  } else {
    registration.addEventListener('updatefound', listenInstalledStateChange);
  }
};

/**
 * Registers the service worker when the page loads.
 * Adds a hook to detect and notify when a new service worker is installed and ready to activate.
 */
const registerServiceWorker = () => {
  // Check if the browser supports service workers
  if ('serviceWorker' in navigator) {
    // Wait for the window to finish loading
    window.addEventListener('load', () => {
      // Register the service worker script
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);

          setInterval(() => registration.update(), 60 * 1000);
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update();
            }
          });

          if (!navigator.serviceWorker.controller) {
            // First load; no service worker yet
            return;
          }

          // Check for new service worker on install
          onNewServiceWorker(registration, () => {
            console.log('[SW] New service worker found and waiting');

            // Tell waiting SW to skip waiting
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          });

          // Reload the page when the new SW takes control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] Controller changed, reloading...');
            window.localStorage.removeItem('isWhatsNewShown');
            showRefreshUI(registration); // This will alert and reload
          });
        })
        .catch((registrationError) => {
          // Log any errors that occurred during registration
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Export the registration function for use in the app's entry point
export default registerServiceWorker;
