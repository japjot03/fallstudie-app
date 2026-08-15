import { alertController, actionSheetController } from '@ionic/vue'
import { cameraOutline, imageOutline, closeOutline } from 'ionicons/icons'
import * as scanner from '@/services/scanner.service'
import { pickImageFromGallery } from '@/services/image-picker.service'
import { vibrateOnScan } from '@/services/haptics.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'

export const useBarcodeScanner = () => {
  const { addScannedBarcodes } = useBarcodeStore()
  const { showToast } = useToast()

  const handleScanResult = async (scanned) => {
    if (!scanned?.length) return await showToast('Kein Barcode erkannt.')
    await addScannedBarcodes(scanned)
    await vibrateOnScan()
  }

  const scanWithCamera = async () => {
    const perm = await scanner.ensureCameraPermission()
    if (perm !== scanner.PermissionStatus.GRANTED) {
      const alert = await alertController.create({
        header: 'Berechtigung fehlt',
        message: 'Kamera-Berechtigung in den Einstellungen erlauben.',
        buttons: [
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Einstellungen', handler: scanner.openAppSettings }
        ]
      })
      return await alert.present()
    }
    try { await handleScanResult(await scanner.scanWithCamera()) }
    catch (e) { await showToast('Fehler beim Scannen.') }
  }

  const scanFromGallery = async () => {
    try {
      const src = await pickImageFromGallery()
      if (src) await handleScanResult(await scanner.scanFromImage(src))
    } catch (e) {
      if (!scanner.isCancellationError(e)) await showToast('Fehler beim Lesen des Bildes.')
    }
  }

  return {
    scanWithCamera,
    scanFromGallery,
    presentScanOptions: async () => {
      const sheet = await actionSheetController.create({
        header: 'Barcode scannen',
        buttons: [
          { text: 'Kamera', icon: cameraOutline, handler: scanWithCamera },
          { text: 'Galerie', icon: imageOutline, handler: scanFromGallery },
          { text: 'Abbrechen', icon: closeOutline, role: 'cancel' }
        ]
      })
      await sheet.present()
    }
  }
}
