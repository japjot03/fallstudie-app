import { actionSheetController } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { exportAsJson, exportAsCsv } from '@/services/export.service'
import { useBarcodeStore } from '@/composables/useBarcodeStore'
import { useToast } from '@/composables/useToast'

/**
 * Export der Historie inklusive Format-Auswahl.
 */
export function useBarcodeExport() {
  const { barcodes } = useBarcodeStore()
  const { showToast } = useToast()

  /**
   * Zeigt die Auswahl des Exportformats.
   * @returns {Promise<void>}
   */
  async function presentExportOptions() {
    const actionSheet = await actionSheetController.create({
      header: 'Barcodes exportieren',
      buttons: [
        {
          text: 'Als JSON exportieren',
          handler: () => runExport(exportAsJson)
        },
        {
          text: 'Als CSV exportieren',
          handler: () => runExport(exportAsCsv)
        },
        {
          text: 'Abbrechen',
          icon: closeOutline,
          role: 'cancel'
        }
      ]
    })

    await actionSheet.present()
  }

  /**
   * Führt einen Export aus und meldet Fehler an den Nutzer.
   * @param {(barcodes: object[]) => Promise<void>} exporter
   * @returns {Promise<void>}
   */
  async function runExport(exporter) {
    try {
      await exporter(barcodes.value)
    } catch (error) {
      console.error('Fehler beim Exportieren:', error)
      await showToast('Fehler beim Exportieren.')
    }
  }

  return { presentExportOptions }
}
