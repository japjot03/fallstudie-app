import { ref, onUnmounted } from 'vue'
import {
  generateQrDataUrl,
  saveQrCode,
  shareQrCode
} from '@/services/qrcode.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'
import { createBarcodeId } from '@/utils/barcode.mapper'

/** Wartezeit, bevor bei Eingabe neu generiert wird. */
const DEBOUNCE_MS = 300

/**
 * Zustand und Aktionen des QR-Code-Generators.
 */
export function useQrGenerator() {
  const { addBarcodeEntry } = useBarcodeStore()
  const { showToast } = useToast()

  const inputText = ref('')
  const qrDataUrl = ref('')

  let debounceTimer = null

  /**
   * Erzeugt den QR-Code verzögert, damit nicht bei jedem Tastendruck
   * neu gerendert wird.
   * @returns {void}
   */
  function generateDebounced() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(generate, DEBOUNCE_MS)
  }

  /**
   * Erzeugt den QR-Code zum aktuellen Eingabetext.
   * @returns {Promise<void>}
   */
  async function generate() {
    try {
      qrDataUrl.value = await generateQrDataUrl(inputText.value)
    } catch (error) {
      console.error('Fehler bei QR-Code-Generierung:', error)
      qrDataUrl.value = ''
    }
  }

  /**
   * Speichert den QR-Code im Dokumente-Verzeichnis und fügt ihn
   * der Barcode-Liste hinzu.
   * @returns {Promise<void>}
   */
  async function save() {
    if (!qrDataUrl.value) return

    try {
      await saveQrCode(qrDataUrl.value)
      await addToList()
      await showToast('QR-Code wurde gespeichert und zur Liste hinzugefügt!')
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      await showToast('Fehler beim Speichern des QR-Codes.')
    }
  }

  /**
   * Öffnet den Teilen-Dialog für den QR-Code.
   * @returns {Promise<void>}
   */
  async function share() {
    if (!qrDataUrl.value) return

    try {
      await shareQrCode(qrDataUrl.value)
    } catch (error) {
      console.error('Fehler beim Teilen:', error)
      await showToast('Fehler beim Teilen des QR-Codes.')
    }
  }

  /**
   * Fügt den generierten QR-Code als Eintrag zur Barcode-Liste hinzu.
   * @returns {Promise<void>}
   */
  async function addToList() {
    const entry = {
      id: createBarcodeId(),
      displayValue: inputText.value.trim(),
      rawValue: inputText.value.trim(),
      format: 'QR_CODE',
      valueType: detectValueType(inputText.value.trim()),
      wifi: null,
      geoPoint: null,
      scannedAt: new Date().toISOString()
    }

    await addBarcodeEntry(entry)
  }

  onUnmounted(() => clearTimeout(debounceTimer))

  return {
    inputText,
    qrDataUrl,
    generateDebounced,
    save,
    share
  }
}

/**
 * Erkennt den Werttyp anhand des Textinhalts.
 * @param {string} text
 * @returns {string}
 */
function detectValueType(text) {
  if (!text) return 'TEXT'

  try {
    const url = new URL(text)
    if (url.protocol === 'http:' || url.protocol === 'https:') return 'URL'
  } catch {
    // Kein gültiger URL.
  }

  if (/^[\d+\-() ]+$/.test(text) && text.replace(/\D/g, '').length >= 5) return 'PHONE'
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'EMAIL'

  return 'TEXT'
}
