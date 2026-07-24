import { Haptics, NotificationType } from '@capacitor/haptics'

/**
 * Haptisches Feedback für die App.
 */

/**
 * Deutlich spürbare Vibration als Bestätigung eines erfolgreichen Scans.
 * Kombiniert eine Notification-Vibration mit einer zusätzlichen Vibration,
 * damit das Feedback auf allen Geräten spürbar ist.
 * @returns {Promise<void>}
 */
export async function vibrateOnScan() {
  try {
    await Haptics.vibrate({ duration: 300 })
    await Haptics.notification({ type: NotificationType.Success })
  } catch (error) {
    // Haptik nicht verfügbar (z.B. im Browser) – still ignorieren.
    console.warn('Haptics nicht verfügbar:', error)
  }
}
