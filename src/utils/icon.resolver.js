import {
  linkOutline,
  callOutline,
  mailOutline,
  chatbubbleOutline,
  locationOutline,
  barcodeOutline
} from 'ionicons/icons'

const ICON_BY_VALUE_TYPE = {
  URL: linkOutline,
  PHONE: callOutline,
  EMAIL: mailOutline,
  SMS: chatbubbleOutline,
  GEO: locationOutline
}

/**
 * Liefert das passende Ionicon zu einem Barcode-Typ.
 * @param {string} valueType
 * @returns {string} Icon-Definition für <ion-icon>
 */
export function resolveIconForValueType(valueType) {
  return ICON_BY_VALUE_TYPE[valueType] || barcodeOutline
}
