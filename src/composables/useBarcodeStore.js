import { ref, computed } from 'vue'
import { loadBarcodes, saveBarcodes } from '@/services/storage.service'
import { toBarcodeEntry } from '@/utils/barcode.mapper'

/**
 * Zentraler Zustand der Scan-Historie.
 *
 * Der State liegt bewusst auf Modulebene: alle Aufrufer teilen sich dieselbe
 * Liste, ohne dass ein Store-Framework nötig wäre.
 */

const barcodes = ref([])
const isLoaded = ref(false)

export function useBarcodeStore() {
  /**
   * Lädt die Historie einmalig aus dem Speicher.
   * @returns {Promise<void>}
   */
  async function initialize() {
    if (isLoaded.value) return

    try {
      barcodes.value = await loadBarcodes()
    } catch (error) {
      console.error('Fehler beim Laden der Barcodes:', error)
      barcodes.value = []
    } finally {
      isLoaded.value = true
    }
  }

  /**
   * Fügt neu gescannte Barcodes am Anfang der Liste ein.
   * @param {object[]} scannedBarcodes Rohe Scanergebnisse
   * @returns {Promise<void>}
   */
  async function addScannedBarcodes(scannedBarcodes) {
    const entries = scannedBarcodes.map(toBarcodeEntry)
    barcodes.value.unshift(...entries)
    await persist()
  }

  /**
   * Entfernt einen Eintrag anhand seiner ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async function removeBarcode(id) {
    barcodes.value = barcodes.value.filter((barcode) => barcode.id !== id)
    await persist()
  }

  /**
   * Schreibt den aktuellen Stand zurück in den Speicher.
   * @returns {Promise<void>}
   */
  async function persist() {
    try {
      await saveBarcodes(barcodes.value)
    } catch (error) {
      console.error('Fehler beim Speichern der Barcodes:', error)
    }
  }

  return {
    barcodes,
    isEmpty: computed(() => barcodes.value.length === 0),
    initialize,
    addScannedBarcodes,
    removeBarcode
  }
}


