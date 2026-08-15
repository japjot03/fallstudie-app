import { Haptics, NotificationType } from '@capacitor/haptics'

export const vibrateOnScan = async () => {
  try {
    await Haptics.vibrate({ duration: 300 })
    await Haptics.notification({ type: NotificationType.Success })
  } catch (e) {
    console.warn(e)
  }
}
