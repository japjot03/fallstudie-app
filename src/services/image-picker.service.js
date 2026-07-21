import { Camera, MediaTypeSelection } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

/**
 * Auswahl eines Bildes aus der Galerie.
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
 * Öffnet die Galerie und liefert das gewählte Bild als Scanner-Quelle.
 * @returns {Promise<ImageSource|null>} null, wenn nichts ausgewählt wurde
 */
export async function pickImageFromGallery() {
  const { results } = await Camera.chooseFromGallery({
    mediaType: MediaTypeSelection.Photo,
    allowMultipleSelection: false
  })

  const [selected] = results || []
  if (!selected) return null

  // Nativ liefert der Picker eine Datei-URI, die MLKit direkt lesen kann.
  if (Capacitor.isNativePlatform()) {
    return selected.uri ? { path: selected.uri } : null
  }

  // Im Browser gibt es nur einen webPath – daraus holen wir den Blob.
  if (!selected.webPath) return null
  const response = await fetch(selected.webPath)
  return { blob: await response.blob() }
}
