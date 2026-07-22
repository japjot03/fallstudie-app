import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

/**
 * Dünne Hülle um das Capacitor-Filesystem.
 * Bündelt das wiederkehrende "schreiben und URI holen"-Muster.
 */

/**
 * Schreibt eine Textdatei in den Cache und liefert deren URI zurück.
 * @param {string} fileName
 * @param {string} data UTF-8-Text
 * @returns {Promise<string>} URI der geschriebenen Datei
 */
export async function writeTextToCache(fileName, data) {
  await Filesystem.writeFile({
    path: fileName,
    data,
    directory: Directory.Cache,
    encoding: Encoding.UTF8
  })

  return getCacheFileUri(fileName)
}

/**
 * Schreibt Base64-Daten (z.B. ein Bild) in den Cache und liefert deren URI.
 * @param {string} fileName
 * @param {string} base64Data Base64 ohne Data-URL-Präfix
 * @returns {Promise<string>} URI der geschriebenen Datei
 */
export async function writeBase64ToCache(fileName, base64Data) {
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Cache
  })

  return getCacheFileUri(fileName)
}

/**
 * Schreibt Base64-Daten dauerhaft in das Dokumente-Verzeichnis.
 * @param {string} fileName
 * @param {string} base64Data Base64 ohne Data-URL-Präfix
 * @returns {Promise<void>}
 */
export async function writeBase64ToDocuments(fileName, base64Data) {
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Documents
  })
}

/**
 * Ermittelt die plattformspezifische URI einer Datei im Cache.
 * @param {string} fileName
 * @returns {Promise<string>}
 */
async function getCacheFileUri(fileName) {
  const { uri } = await Filesystem.getUri({
    path: fileName,
    directory: Directory.Cache
  })

  return uri
}
