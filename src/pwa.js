/* Registers the service worker for offline / installable PWA support.
   No-op when unsupported or running inside a Capacitor native shell. */
export function registerSW() {
  const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()
  if (isNative) return
  if (!('serviceWorker' in navigator)) return
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}
