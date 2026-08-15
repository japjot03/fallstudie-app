import { alertController } from '@ionic/vue'
import { shareText, copyToClipboard } from '@/services/sharing.service'
import { openBarcode } from '@/services/barcode-opener.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'

export const useBarcodeActions = () => {
  const { removeBarcode } = useBarcodeStore()
  const { showToast } = useToast()

  return {
    share: async (b) => shareText({ title: 'Barcode', text: `Wert: ${b.displayValue}\nFormat: ${b.format}\nTyp: ${b.valueType}`, dialogTitle: 'Teilen' }),
    copy: async (b) => {
      await copyToClipboard(b.displayValue)
      await showToast('Kopiert!')
    },
    open: async (b) => {
      try {
        if (!(await openBarcode(b))) await showToast('Typ nicht öffenbar.')
      } catch (e) { await showToast('Fehler beim Öffnen.') }
    },
    confirmDelete: async (b) => {
      const alert = await alertController.create({
        header: 'Löschen',
        message: 'Barcode löschen?',
        buttons: [
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Löschen', role: 'destructive', handler: () => removeBarcode(b.id) }
        ]
      })
      await alert.present()
    }
  }
}
