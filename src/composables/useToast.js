import { toastController } from '@ionic/vue'

const DEFAULT_DURATION = 2000
const DEFAULT_POSITION = 'bottom'

/**
 * Kurze Statusmeldungen am unteren Bildschirmrand.
 */
export function useToast() {
  /**
   * @param {string} message
   * @param {{duration?: number, position?: string}} [options]
   * @returns {Promise<void>}
   */
  async function showToast(message, options = {}) {
    const toast = await toastController.create({
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      position: options.position ?? DEFAULT_POSITION
    })

    await toast.present()
  }

  return { showToast }
}
