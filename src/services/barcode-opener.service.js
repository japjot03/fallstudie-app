import { Browser } from '@capacitor/browser'
import { isOpenable } from '@/utils/barcode.mapper'

/**
 * Öffnet Barcode-Inhalte in der jeweils passenden System-App
 * (Browser, Telefon, Mail, SMS, Karten).
 */

/** URL-Schemata je Barcode-Typ. */
const SCHEME_BY_VALUE_TYPE = {
  PHONE: 'tel',
  EMAIL: 'mailto',
  SMS: 'sms',
  GEO: 'geo'
}

/** Typen, bei denen Leerzeichen im Wert stören. */
const STRIP_WHITESPACE_TYPES = ['PHONE', 'SMS']

/**
 * Öffnet einen Barcode entsprechend seines Typs.
 * @param {{displayValue: string, valueType: string}} barcode
 * @returns {Promise<boolean>} false, wenn der Typ nicht geöffnet werden kann
 */
export async function openBarcode(barcode) {
  const { valueType, displayValue } = barcode

  if (!isOpenable(valueType)) return false

  if (valueType === 'URL') {
    await Browser.open({ url: displayValue })
    return true
  }

  const scheme = SCHEME_BY_VALUE_TYPE[valueType]
  if (!scheme) return false

  const value = STRIP_WHITESPACE_TYPES.includes(valueType)
    ? displayValue.replace(/\s/g, '')
    : displayValue

  window.open(`${scheme}:${value}`, '_system')
  return true
}
