import { writeTextToCache } from '@/services/file.service'
import { shareFile } from '@/services/sharing.service'
import { buildTimestampedFileName } from '@/utils/file.utils'

/**
 * Export der Scan-Historie als JSON oder CSV.
 * Die Datei landet im Cache und wird anschließend zum Teilen angeboten.
 */

const FILE_PREFIX = 'barcodes'
const CSV_HEADER = ['Wert', 'Format', 'Typ', 'Gescannt am']

/**
 * Serialisiert die Historie als eingerücktes JSON.
 * @param {object[]} barcodes
 * @returns {string}
 */
export function buildJson(barcodes) {
  return JSON.stringify(barcodes, null, 2)
}

/**
 * Serialisiert die Historie als CSV inklusive Kopfzeile.
 * @param {object[]} barcodes
 * @returns {string}
 */
export function buildCsv(barcodes) {
  const rows = barcodes.map((barcode) => [
    barcode.displayValue,
    barcode.format,
    barcode.valueType,
    barcode.scannedAt
  ])

  return [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n')
}

/**
 * Exportiert die Historie als JSON-Datei und öffnet den Teilen-Dialog.
 * @param {object[]} barcodes
 * @returns {Promise<void>}
 */
export async function exportAsJson(barcodes) {
  const fileName = buildTimestampedFileName(FILE_PREFIX, 'json')
  await writeAndShare(fileName, buildJson(barcodes))
}

/**
 * Exportiert die Historie als CSV-Datei und öffnet den Teilen-Dialog.
 * @param {object[]} barcodes
 * @returns {Promise<void>}
 */
export async function exportAsCsv(barcodes) {
  const fileName = buildTimestampedFileName(FILE_PREFIX, 'csv')
  await writeAndShare(fileName, buildCsv(barcodes))
}

/**
 * Schreibt den Inhalt in den Cache und bietet die Datei zum Teilen an.
 * @param {string} fileName
 * @param {string} content
 * @returns {Promise<void>}
 */
async function writeAndShare(fileName, content) {
  const uri = await writeTextToCache(fileName, content)

  await shareFile({
    title: 'Barcodes Export',
    url: uri,
    dialogTitle: 'Barcodes teilen'
  })
}

/**
 * Maskiert ein CSV-Feld nach RFC 4180 (Anführungszeichen verdoppeln).
 * @param {unknown} value
 * @returns {string}
 */
function escapeCsvField(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}
