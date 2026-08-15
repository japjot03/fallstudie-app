import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'

export const shareText = async (options) => Share.share(options)
export const copyToClipboard = async (string) => Clipboard.write({ string })
