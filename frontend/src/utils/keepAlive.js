export function startBackendKeepAlive({
  intervalMs = 5 * 60 * 1000,
  immediate = true,
} = {}) {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const healthUrl = apiBase.replace(/\/api\/?$/, '') + '/health';

  let timerId = null;

  const ping = async () => {
    try {
      if (document.visibilityState === 'hidden') return;
      await fetch(healthUrl, { method: 'GET', cache: 'no-store' });
    } catch {
      // ignore
    }
  };

  const start = () => {
    if (timerId) return;
    if (immediate) ping();
    timerId = window.setInterval(ping, intervalMs);
  };

  const stop = () => {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  const onVisibility = () => {
    if (document.visibilityState === 'hidden') return;
    ping();
  };

  start();
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    stop();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

