import {
  VALUE_TYPE_MAP,
  DEFAULT_VALUE_TYPE,
  FORMAT_MAP,
  DEFAULT_FORMAT,
  OPENABLE_VALUE_TYPES
} from '@/constants/barcode.constants'

/**
 * Übersetzt den rohen valueType von MLKit in einen sprechenden Bezeichner.
 * @param {number|string} rawType
 * @returns {string}
 */
export function mapValueType(rawType) {
  if (typeof rawType === 'string') return rawType
  return VALUE_TYPE_MAP[rawType] || DEFAULT_VALUE_TYPE
}

/**
 * Übersetzt den rohen Formatcode von MLKit in einen sprechenden Bezeichner.
 * @param {number|string} rawFormat
 * @returns {string}
 */
export function mapFormat(rawFormat) {
  if (typeof rawFormat === 'string') return rawFormat
  return FORMAT_MAP[rawFormat] || DEFAULT_FORMAT
}

/**
 * Erzeugt eine eindeutige ID für einen Barcode-Eintrag.
 * @returns {string}
 */
export function createBarcodeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Wandelt ein rohes MLKit-Scanergebnis in unser internes Barcode-Modell um.
 * @param {object} scanned
 * @returns {{id: string, displayValue: string, format: string, valueType: string, scannedAt: string}}
 */
export function toBarcodeEntry(scanned) {
  return {
    id: createBarcodeId(),
    displayValue: scanned.displayValue || scanned.rawValue || '',
    format: mapFormat(scanned.format),
    valueType: mapValueType(scanned.valueType),
    scannedAt: new Date().toISOString()
  }
}

/**
 * Normalisiert einen persistierten Eintrag. Frühere App-Versionen haben ohne
 * ID gespeichert – die wird hier nachgezogen, damit Listen stabil bleiben.
 * @param {object} entry
 * @returns {object}
 */
export function normalizeBarcodeEntry(entry) {
  return {
    id: entry.id || createBarcodeId(),
    displayValue: entry.displayValue || '',
    format: entry.format || DEFAULT_FORMAT,
    valueType: entry.valueType || DEFAULT_VALUE_TYPE,
    scannedAt: entry.scannedAt || null
  }
}

/**
 * Prüft, ob ein Barcode-Typ per "Öffnen"-Aktion behandelt werden kann.
 * @param {string} valueType
 * @returns {boolean}
 */
export function isOpenable(valueType) {
  return OPENABLE_VALUE_TYPES.includes(valueType)
}
