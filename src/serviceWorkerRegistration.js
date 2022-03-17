const showRefreshUI = (registration) => {
  //   registration.waiting.postMessage('force-activate');
  if (confirm('New version available. Refresh?')) {
    window.location.reload();
  }
};

const onNewServiceWorker = (registration, callback) => {
  if (registration.waiting) {
    // SW is waiting to activate. Can occur if multiple clients open and
    // one of the clients is refreshed.
    return callback();
  }

  const listenInstalledStateChange = () => {
    registration.installing.addEventListener('statechange', (event) => {
      if (event.target.state === 'installed') {
        // A new service worker is available, inform the user
        callback();
      }
    });
  };

  if (registration.installing) {
    return listenInstalledStateChange();
  }

  // We are currently controlled so a new SW may be found.
  // Add a listener in case a new SW is found.
  registration.addEventListener('updatefound', listenInstalledStateChange);
  return null;
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        console.log('SW registered: ', registration);
        if (!navigator.serviceWorker.controller) {
          // The window client isn't currently controlled, so it's a new service
          // worker that will activate immediately
          return;
        }

        onNewServiceWorker(registration, () => {
          showRefreshUI(registration);
        });
      }).catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
};

export default registerServiceWorker;
