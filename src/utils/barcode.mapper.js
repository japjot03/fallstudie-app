import { VALUE_TYPE_MAP, DEFAULT_VALUE_TYPE, FORMAT_MAP, DEFAULT_FORMAT, OPENABLE_VALUE_TYPES } from '@/constants/barcode.constants'

export const mapValueType = (t) => typeof t === 'string' ? t : VALUE_TYPE_MAP[t] || DEFAULT_VALUE_TYPE
export const mapFormat = (f) => typeof f === 'string' ? f : FORMAT_MAP[f] || DEFAULT_FORMAT
export const createBarcodeId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const toFiniteNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const isValidGeoPoint = (latitude, longitude) => (
  latitude !== null && longitude !== null &&
  latitude >= -90 && latitude <= 90 &&
  longitude >= -180 && longitude <= 180
)

const parseGeoUri = (value) => {
  if (typeof value !== 'string') return null

  const match = value.trim().match(
    /^geo:\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*[,;?]|\s*$)/i
  )
  if (!match) return null

  const latitude = toFiniteNumber(match[1])
  const longitude = toFiniteNumber(match[2])
  return isValidGeoPoint(latitude, longitude) ? { latitude, longitude } : null
}

export const normalizeGeoPoint = (geoPoint, encodedValue = '') => {
  const latitude = toFiniteNumber(geoPoint?.latitude ?? geoPoint?.lat)
  const longitude = toFiniteNumber(geoPoint?.longitude ?? geoPoint?.lng)

  if (isValidGeoPoint(latitude, longitude)) return { latitude, longitude }
  return parseGeoUri(encodedValue)
}

export const toBarcodeEntry = (scanned) => {
  const displayValue = scanned.displayValue || scanned.rawValue || ''
  const rawValue = scanned.rawValue || ''

  return {
    id: createBarcodeId(),
    displayValue,
    rawValue,
    format: mapFormat(scanned.format),
    valueType: mapValueType(scanned.valueType),
    wifi: scanned.wifi || null,
    geoPoint: normalizeGeoPoint(scanned.geoPoint, rawValue || displayValue),
    scannedAt: new Date().toISOString()
  }
}

export const normalizeBarcodeEntry = (entry) => {
  const displayValue = entry.displayValue || ''
  const rawValue = entry.rawValue || ''

  return {
    ...entry,
    id: entry.id || createBarcodeId(),
    displayValue,
    rawValue,
    format: entry.format || DEFAULT_FORMAT,
    valueType: entry.valueType || DEFAULT_VALUE_TYPE,
    wifi: entry.wifi || null,
    geoPoint: normalizeGeoPoint(entry.geoPoint, rawValue || displayValue),
    scannedAt: entry.scannedAt || null
  }
}

export const isOpenable = (type) => OPENABLE_VALUE_TYPES.includes(type)
