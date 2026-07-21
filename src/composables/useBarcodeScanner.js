import { alertController, actionSheetController } from '@ionic/vue'
import { cameraOutline, imageOutline, closeOutline } from 'ionicons/icons'
import * as scannerService from '@/services/scanner.service'
import { PermissionStatus } from '@/services/scanner.service'
import { pickImageFromGallery } from '@/services/image-picker.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'

/**
 * Ablauf des Scannens: Berechtigung prüfen, scannen, Ergebnis speichern
 * und den Nutzer über Fehler informieren.
 */
export function useBarcodeScanner() {
  const { addScannedBarcodes } = useBarcodeStore()
  const { showToast } = useToast()

  /**
   * Zeigt die Auswahl zwischen Kamera und Galerie.
   * @returns {Promise<void>}
   */
  async function presentScanOptions() {
    const actionSheet = await actionSheetController.create({
      header: 'Barcode scannen',
      buttons: [
        {
          text: 'Mit Kamera scannen',
          icon: cameraOutline,
          handler: () => scanWithCamera()
        },
        {
          text: 'Aus Galerie wählen',
          icon: imageOutline,
          handler: () => scanFromGallery()
        },
        {
          text: 'Abbrechen',
          icon: closeOutline,
          role: 'cancel'
        }
      ]
    })

    await actionSheet.present()
  }

  /**
   * Startet den Kamera-Scan, sofern die Berechtigung vorliegt.
   * @returns {Promise<void>}
   */
  async function scanWithCamera() {
    const permission = await scannerService.ensureCameraPermission()
    if (permission !== PermissionStatus.GRANTED) {
      await presentPermissionDeniedAlert()
      return
    }

    try {
      const scanned = await scannerService.scanWithCamera()
      if (scanned.length > 0) {
        await addScannedBarcodes(scanned)
      }
    } catch (error) {
      console.error('Fehler beim Scannen:', error)
      await showToast('Fehler beim Scannen des Barcodes.')
    }
  }

  /**
   * Lässt den Nutzer ein Bild aus der Galerie wählen und liest die darin
   * enthaltenen Barcodes.
   * @returns {Promise<void>}
   */
  async function scanFromGallery() {
    try {
      const imageSource = await pickImageFromGallery()
      // Kein Bild gewählt – der Nutzer hat den Picker geschlossen.
      if (!imageSource) return

      const scanned = await scannerService.scanFromImage(imageSource)
      if (scanned.length === 0) {
        await showToast('Kein Barcode im ausgewählten Bild erkannt.')
        return
      }

      await addScannedBarcodes(scanned)
    } catch (error) {
      // Abbruch durch den Nutzer ist kein Fehlerfall.
      if (scannerService.isCancellationError(error)) return

      console.error('Fehler beim Lesen des Bildes:', error)
      await showToast('Kein Barcode im ausgewählten Bild erkannt.')
    }
  }

  /**
   * Weist auf die fehlende Kamera-Berechtigung hin und bietet die
   * App-Einstellungen an.
   * @returns {Promise<void>}
   */
  async function presentPermissionDeniedAlert() {
    const alert = await alertController.create({
      header: 'Kamera-Berechtigung benötigt',
      message:
        'Die Kamera-Berechtigung wurde verweigert. Bitte erlaube den Kamera-Zugriff in den App-Einstellungen, um Barcodes scannen zu können.',
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        {
          text: 'Einstellungen öffnen',
          handler: () => scannerService.openAppSettings()
        }
      ]
    })

    await alert.present()
  }

  return {
    presentScanOptions,
    scanWithCamera,
    scanFromGallery
  }
}
