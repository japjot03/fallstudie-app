import { FilePicker } from '@capawesome/capacitor-file-picker'
import { Capacitor } from '@capacitor/core'

export const pickImageFromGallery = async () => {
  const { files } = await FilePicker.pickImages({ multiple: false, readData: false })
  const selected = files?.[0]
  if (!selected) return null
  return Capacitor.isNativePlatform() && selected.path ? { path: selected.path } : selected.blob ? { blob: selected.blob } : null
}
