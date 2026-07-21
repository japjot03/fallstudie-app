const LOCALE = 'de-DE'

const DATE_TIME_OPTIONS = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}

/**
 * Formatiert einen ISO-Zeitstempel für die Anzeige.
 * @param {string|null} isoString
 * @returns {string} Leerstring, wenn kein gültiges Datum vorliegt.
 */
export function formatDateTime(isoString) {
  if (!isoString) return ''

  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(LOCALE, DATE_TIME_OPTIONS)
}
