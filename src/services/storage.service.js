import { Preferences } from '@capacitor/preferences'
import { STORAGE_KEY } from '@/constants/barcode.constants'
import { normalizeBarcodeEntry } from '@/utils/barcode.mapper'

/**
 * Lädt alle gespeicherten Barcodes.
 * @returns {Promise<object[]>} Leeres Array, wenn nichts gespeichert ist.
 * @throws {Error} Wenn die gespeicherten Daten nicht lesbar sind.
 */
export async function loadBarcodes() {
  const { value } = await Preferences.get({ key: STORAGE_KEY })
  if (!value) return []

  const parsed = JSON.parse(value)
  if (!Array.isArray(parsed)) return []

  return parsed.map(normalizeBarcodeEntry)
}

/**
 * Schreibt die komplette Historie zurück in den Speicher.
 * @param {object[]} barcodes
 * @returns {Promise<void>}
 */
export async function saveBarcodes(barcodes) {
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(barcodes)
  })
}
