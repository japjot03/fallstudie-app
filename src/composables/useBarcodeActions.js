import { alertController } from '@ionic/vue'
import { shareText, copyToClipboard } from '@/services/sharing.service'
import { openBarcode as openBarcodeTarget } from '@/services/barcode-opener.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'

/**
 * Aktionen auf einem einzelnen Barcode: teilen, kopieren, öffnen, löschen.
 */
export function useBarcodeActions() {
  const { removeBarcode } = useBarcodeStore()
  const { showToast } = useToast()

  /**
   * Teilt Wert, Format und Typ des Barcodes als Text.
   * @param {object} barcode
   * @returns {Promise<void>}
   */
  async function share(barcode) {
    try {
      await shareText({
        title: 'Barcode',
        text: `Wert: ${barcode.displayValue}\nFormat: ${barcode.format}\nTyp: ${barcode.valueType}`,
        dialogTitle: 'Barcode teilen'
      })
    } catch (error) {
      console.error('Fehler beim Teilen:', error)
    }
  }

  /**
   * Kopiert den Barcode-Wert in die Zwischenablage.
   * @param {object} barcode
   * @returns {Promise<void>}
   */
  async function copy(barcode) {
    try {
      await copyToClipboard(barcode.displayValue)
      await showToast('In die Zwischenablage kopiert!')
    } catch (error) {
      console.error('Fehler beim Kopieren:', error)
    }
  }

  /**
   * Öffnet den Barcode in der passenden System-App.
   * @param {object} barcode
   * @returns {Promise<void>}
   */
  async function open(barcode) {
    try {
      const opened = await openBarcodeTarget(barcode)
      if (!opened) {
        await showToast('Dieser Barcode-Typ kann nicht geöffnet werden.')
      }
    } catch (error) {
      console.error('Fehler beim Öffnen:', error)
      await showToast('Fehler beim Öffnen des Barcodes.')
    }
  }

  /**
   * Fragt vor dem Löschen nach einer Bestätigung.
   * @param {object} barcode
   * @returns {Promise<void>}
   */
  async function confirmDelete(barcode) {
    const alert = await alertController.create({
      header: 'Barcode löschen',
      message: 'Möchtest du diesen Barcode wirklich löschen?',
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => removeBarcode(barcode.id)
        }
      ]
    })

    await alert.present()
  }

  return { share, copy, open, confirmDelete }
}
