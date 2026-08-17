import { Browser } from '@capacitor/browser'
import { isOpenable, normalizeGeoPoint } from '@/utils/barcode.mapper'

const SCHEMES = { PHONE: 'tel', EMAIL: 'mailto', SMS: 'sms' }
const STRIP_WS = ['PHONE', 'SMS']

export const openBarcode = async ({ valueType, displayValue, rawValue, geoPoint }) => {
  if (!isOpenable(valueType)) return false
  if (valueType === 'URL') {
    await Browser.open({ url: displayValue })
    return true
  }
  if (valueType === 'GEO') {
    const point = normalizeGeoPoint(geoPoint, rawValue || displayValue)
    if (!point) return false

    const coordinates = `${point.latitude},${point.longitude}`
    window.open(`geo:${coordinates}?q=${coordinates}`, '_system')
    return true
  }
  const scheme = SCHEMES[valueType]
  if (!scheme) return false
  const val = STRIP_WS.includes(valueType) ? displayValue.replace(/\s/g, '') : displayValue
  window.open(`${scheme}:${val}`, '_system')
  return true
}
