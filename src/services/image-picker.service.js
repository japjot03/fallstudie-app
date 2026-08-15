import { FilePicker } from '@capawesome/capacitor-file-picker'
import { Capacitor } from '@capacitor/core'

/**
 * Auswahl eines Bildes aus der Galerie über den File Picker.
 *
 * Der MLKit-Scanner braucht je nach Plattform eine andere Bildquelle:
 * nativ einen Dateipfad, im Browser einen Blob. Dieser Service kapselt
 * den Unterschied und liefert eine einheitliche Quelle zurück.
 */

/**
 * @typedef {{path: string}|{blob: Blob}} ImageSource
 * Direkt als Options-Objekt an `readBarcodesFromImage` übergebbar.
 */

/**
 * Öffnet den File Picker und liefert das gewählte Bild als Scanner-Quelle.
 * @returns {Promise<ImageSource|null>} null, wenn nichts ausgewählt wurde
 */
export async function pickImageFromGallery() {
  const result = await FilePicker.pickImages({
    multiple: false,
    readData: false
  })

  const [selected] = result.files || []
  if (!selected) return null

  // Nativ liefert der Picker einen Dateipfad, den MLKit direkt lesen kann.
  if (Capacitor.isNativePlatform()) {
    return selected.path ? { path: selected.path } : null
  }

  // Im Browser gibt es einen Blob.
  if (selected.blob) {
    return { blob: selected.blob }
  }

  return null
}

