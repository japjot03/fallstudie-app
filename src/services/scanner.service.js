import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'

export const PermissionStatus = { GRANTED: 'granted', DENIED: 'denied' }

export const ensureCameraPermission = async () => {
  const { camera } = await BarcodeScanner.checkPermissions()
  if (camera === 'granted') return PermissionStatus.GRANTED
  if (camera === 'denied') return PermissionStatus.DENIED
  const { camera: req } = await BarcodeScanner.requestPermissions()
  return req === 'granted' ? PermissionStatus.GRANTED : PermissionStatus.DENIED
}

export const openAppSettings = () => BarcodeScanner.openSettings()
export const scanWithCamera = async () => (await BarcodeScanner.scan()).barcodes || []
export const scanFromImage = async (img) => (await BarcodeScanner.readBarcodesFromImage(img)).barcodes || []

export const isCancellationError = (err) => {
  const msg = err?.message?.toLowerCase() || ''
  return ['cancel', 'abort', 'no image picked'].some(h => msg.includes(h))
}
