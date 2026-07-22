import QRCode from 'qrcode'
import {
  writeBase64ToCache,
  writeBase64ToDocuments
} from '@/services/file.service'
import { shareFile } from '@/services/sharing.service'
import {
  buildTimestampedFileName,
  extractBase64FromDataUrl
} from '@/utils/file.utils'

/**
 * Erzeugen, Speichern und Teilen von QR-Codes.
 */

const FILE_PREFIX = 'qrcode'

const QR_OPTIONS = {
  width: 280,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}

/**
 * Generiert einen QR-Code als Data-URL.
 * @param {string} text
 * @returns {Promise<string>} Data-URL, oder Leerstring bei leerem Text
 */
export async function generateQrDataUrl(text) {
  const trimmed = text?.trim()
  if (!trimmed) return ''

  return QRCode.toDataURL(trimmed, QR_OPTIONS)
}

/**
 * Speichert einen QR-Code dauerhaft im Dokumente-Verzeichnis.
 * @param {string} dataUrl
 * @returns {Promise<void>}
 */
export async function saveQrCode(dataUrl) {
  const fileName = buildTimestampedFileName(FILE_PREFIX, 'png')
  await writeBase64ToDocuments(fileName, extractBase64FromDataUrl(dataUrl))
}

/**
 * Legt den QR-Code im Cache ab und öffnet den Teilen-Dialog.
 * @param {string} dataUrl
 * @returns {Promise<void>}
 */
export async function shareQrCode(dataUrl) {
  const fileName = buildTimestampedFileName(FILE_PREFIX, 'png')
  const uri = await writeBase64ToCache(fileName, extractBase64FromDataUrl(dataUrl))

  await shareFile({
    title: 'QR-Code',
    url: uri,
    dialogTitle: 'QR-Code teilen'
  })
}
