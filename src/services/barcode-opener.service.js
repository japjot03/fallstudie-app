import { Browser } from '@capacitor/browser'
import { isOpenable } from '@/utils/barcode.mapper'

const SCHEMES = { PHONE: 'tel', EMAIL: 'mailto', SMS: 'sms', GEO: 'geo' }
const STRIP_WS = ['PHONE', 'SMS']

export const openBarcode = async ({ valueType, displayValue }) => {
  if (!isOpenable(valueType)) return false
  if (valueType === 'URL') {
    await Browser.open({ url: displayValue })
    return true
  }
  const scheme = SCHEMES[valueType]
  if (!scheme) return false
  const val = STRIP_WS.includes(valueType) ? displayValue.replace(/\s/g, '') : displayValue
  window.open(`${scheme}:${val}`, '_system')
  return true
}
