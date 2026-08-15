import { toastController } from '@ionic/vue'

export const useToast = () => ({
  showToast: async (message, { duration = 2000, position = 'bottom' } = {}) => {
    const toast = await toastController.create({ message, duration, position })
    await toast.present()
  }
})
