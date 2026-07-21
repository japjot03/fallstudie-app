import { ref, onUnmounted } from 'vue'
import {
  generateQrDataUrl,
  saveQrCode,
  shareQrCode
} from '@/services/qrcode.service'
import { useToast } from '@/composables/useToast'

/** Wartezeit, bevor bei Eingabe neu generiert wird. */
const DEBOUNCE_MS = 300

/**
 * Zustand und Aktionen des QR-Code-Generators.
 */
export function useQrGenerator() {
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
   * Speichert den QR-Code im Dokumente-Verzeichnis.
   * @returns {Promise<void>}
   */
  async function save() {
    if (!qrDataUrl.value) return

    try {
      await saveQrCode(qrDataUrl.value)
      await showToast('QR-Code wurde gespeichert!')
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

  onUnmounted(() => clearTimeout(debounceTimer))

  return {
    inputText,
    qrDataUrl,
    generateDebounced,
    save,
    share
  }
}
