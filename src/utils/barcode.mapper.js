import { VALUE_TYPE_MAP, DEFAULT_VALUE_TYPE, FORMAT_MAP, DEFAULT_FORMAT, OPENABLE_VALUE_TYPES } from '@/constants/barcode.constants'

export const mapValueType = (t) => typeof t === 'string' ? t : VALUE_TYPE_MAP[t] || DEFAULT_VALUE_TYPE
export const mapFormat = (f) => typeof f === 'string' ? f : FORMAT_MAP[f] || DEFAULT_FORMAT
export const createBarcodeId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export const toBarcodeEntry = (scanned) => ({
  id: createBarcodeId(),
  displayValue: scanned.displayValue || scanned.rawValue || '',
  rawValue: scanned.rawValue || '',
  format: mapFormat(scanned.format),
  valueType: mapValueType(scanned.valueType),
  wifi: scanned.wifi || null,
  geoPoint: scanned.geoPoint || null,
  scannedAt: new Date().toISOString()
})

export const normalizeBarcodeEntry = (entry) => ({
  ...entry,
  id: entry.id || createBarcodeId(),
  displayValue: entry.displayValue || '',
  rawValue: entry.rawValue || '',
  format: entry.format || DEFAULT_FORMAT,
  valueType: entry.valueType || DEFAULT_VALUE_TYPE
})

export const isOpenable = (type) => OPENABLE_VALUE_TYPES.includes(type)
