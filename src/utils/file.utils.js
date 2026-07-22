/**
 * Baut einen Dateinamen mit Zeitstempel, damit Exporte sich nicht überschreiben.
 * @param {string} prefix z.B. "barcodes"
 * @param {string} extension z.B. "csv"
 * @returns {string}
 */
export function buildTimestampedFileName(prefix, extension) {
  return `${prefix}_${Date.now()}.${extension}`
}

/**
 * Extrahiert den Base64-Anteil aus einer Data-URL.
 * Capacitor Filesystem erwartet reines Base64 ohne "data:...;base64,"-Präfix.
 * @param {string} dataUrl
 * @returns {string} Leerstring, wenn die Data-URL ungültig ist.
 */
export function extractBase64FromDataUrl(dataUrl) {
  if (!dataUrl) return ''
  const [, base64] = dataUrl.split(',')
  return base64 || ''
}
