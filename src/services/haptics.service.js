import { Haptics, ImpactStyle } from '@capacitor/haptics'

/**
 * Haptisches Feedback für die App.
 */

/**
 * Kurze Vibration als Bestätigung eines erfolgreichen Scans.
 * @returns {Promise<void>}
 */
export async function vibrateOnScan() {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium })
  } catch (error) {
    // Haptik nicht verfügbar (z.B. im Browser) – still ignorieren.
    console.warn('Haptics nicht verfügbar:', error)
  }
}
