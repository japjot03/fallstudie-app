import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'

/**
 * Zugriff auf den MLKit-Barcodescanner.
 * Liefert rohe Scanergebnisse zurück – das Mapping übernimmt der Aufrufer.
 */

/** Mögliche Ergebnisse der Berechtigungsprüfung. */
export const PermissionStatus = {
  GRANTED: 'granted',
  DENIED: 'denied'
}

/**
 * Prüft die Kamera-Berechtigung und fordert sie bei Bedarf an.
 * @returns {Promise<string>} Ein Wert aus {@link PermissionStatus}
 */
export async function ensureCameraPermission() {
  const { camera } = await BarcodeScanner.checkPermissions()
  if (camera === 'granted') return PermissionStatus.GRANTED
  if (camera === 'denied') return PermissionStatus.DENIED

  const requested = await BarcodeScanner.requestPermissions()
  return requested.camera === 'granted'
    ? PermissionStatus.GRANTED
    : PermissionStatus.DENIED
}

/**
 * Öffnet die App-Einstellungen, damit der Nutzer die Berechtigung nachziehen kann.
 * @returns {Promise<void>}
 */
export async function openAppSettings() {
  await BarcodeScanner.openSettings()
}

/**
 * Startet den Kamera-Scanner.
 * @returns {Promise<object[]>} Rohe Scanergebnisse
 */
export async function scanWithCamera() {
  const { barcodes } = await BarcodeScanner.scan()
  return barcodes || []
}

/**
 * Liest Barcodes aus einem bereits ausgewählten Bild.
 *
 * Die Bildquelle kommt vom Image-Picker: nativ ein Dateipfad, im Browser
 * ein Blob. Ohne eine dieser Angaben findet MLKit kein Bild.
 * @param {{path: string}|{blob: Blob}} imageSource
 * @returns {Promise<object[]>} Rohe Scanergebnisse
 */
export async function scanFromImage(imageSource) {
  const { barcodes } = await BarcodeScanner.readBarcodesFromImage(imageSource)
  return barcodes || []
}

/** Textbausteine, an denen ein Abbruch durch den Nutzer erkennbar ist. */
const CANCELLATION_HINTS = ['cancel', 'abort', 'no image picked']

/**
 * Erkennt, ob ein Fehler nur ein Abbruch durch den Nutzer war.
 * In dem Fall soll keine Fehlermeldung erscheinen.
 * @param {Error} error
 * @returns {boolean}
 */
export function isCancellationError(error) {
  const message = error?.message?.toLowerCase() ?? ''
  return CANCELLATION_HINTS.some((hint) => message.includes(hint))
}
