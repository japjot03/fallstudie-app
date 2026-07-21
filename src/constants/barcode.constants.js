/**
 * Zentrale Konstanten rund um Barcodes.
 * Enthält bewusst keine Logik, damit sie überall importierbar sind.
 */

/** Schlüssel, unter dem die Scan-Historie in den Capacitor Preferences liegt. */
export const STORAGE_KEY = 'scanned_barcodes'

/**
 * MLKit liefert valueType je nach Plattform numerisch oder als String.
 * Diese Map übersetzt die numerischen Werte in sprechende Bezeichner.
 */
export const VALUE_TYPE_MAP = {
  1: 'CONTACT_INFO',
  2: 'EMAIL',
  3: 'ISBN',
  4: 'PHONE',
  5: 'PRODUCT',
  6: 'SMS',
  7: 'TEXT',
  8: 'URL',
  9: 'WIFI',
  10: 'GEO',
  11: 'CALENDAR_EVENT',
  12: 'DRIVER_LICENSE'
}

/** Fallback, wenn der valueType unbekannt ist. */
export const DEFAULT_VALUE_TYPE = 'TEXT'

/** MLKit-Formatcodes auf lesbare Namen gemappt. */
export const FORMAT_MAP = {
  0: 'UNKNOWN',
  1: 'CODE_128',
  2: 'CODE_39',
  4: 'CODE_93',
  8: 'CODABAR',
  16: 'DATA_MATRIX',
  32: 'EAN_13',
  64: 'EAN_8',
  128: 'ITF',
  256: 'QR_CODE',
  512: 'UPC_A',
  1024: 'UPC_E',
  2048: 'PDF_417',
  4096: 'AZTEC'
}

/** Fallback, wenn das Format unbekannt ist. */
export const DEFAULT_FORMAT = 'UNKNOWN'

/** Value-Types, für die eine "Öffnen"-Aktion sinnvoll ist. */
export const OPENABLE_VALUE_TYPES = ['URL', 'PHONE', 'EMAIL', 'SMS', 'GEO']
