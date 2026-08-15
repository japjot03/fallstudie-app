import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'

/**
 * Teilen und Zwischenablage.
 */

/**
 * Teilt einen Textinhalt über den System-Dialog.
 * @param {{title: string, text: string, dialogTitle: string}} payload
 * @returns {Promise<void>}
 */
export async function shareText({ title, text, dialogTitle }) {
  await Share.share({ title, text, dialogTitle })
}

/**
 * Kopiert Text in die Zwischenablage.
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
  await Clipboard.write({ string: text })
}

