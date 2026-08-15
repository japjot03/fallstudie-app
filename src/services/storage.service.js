import { Preferences } from '@capacitor/preferences'
import { STORAGE_KEY } from '@/constants/barcode.constants'
import { normalizeBarcodeEntry } from '@/utils/barcode.mapper'

export const loadBarcodes = async () => {
  const { value } = await Preferences.get({ key: STORAGE_KEY })
  if (!value) return []
  const parsed = JSON.parse(value)
  return Array.isArray(parsed) ? parsed.map(normalizeBarcodeEntry) : []
}

export const saveBarcodes = async (barcodes) => {
  await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(barcodes) })
}
