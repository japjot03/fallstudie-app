import { ref, computed } from 'vue'
import { loadBarcodes, saveBarcodes } from '@/services/storage.service'
import { toBarcodeEntry } from '@/utils/barcode.mapper'

const barcodes = ref([])
const isLoaded = ref(false)

export const useBarcodeStore = () => {
  const persist = async () => {
    try { await saveBarcodes(barcodes.value) } catch (e) { console.error(e) }
  }

  return {
    barcodes,
    isEmpty: computed(() => barcodes.value.length === 0),
    initialize: async () => {
      if (isLoaded.value) return
      try { barcodes.value = await loadBarcodes() }
      catch (e) { barcodes.value = [] }
      finally { isLoaded.value = true }
    },
    addScannedBarcodes: async (scanned) => {
      barcodes.value.unshift(...scanned.map(toBarcodeEntry))
      await persist()
    },
    removeBarcode: async (id) => {
      barcodes.value = barcodes.value.filter(b => b.id !== id)
      await persist()
    }
  }
}
