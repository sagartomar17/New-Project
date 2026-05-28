const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const pad = (n) => String(n).padStart(2, '0')

/**
 * Returns true when two Date values fall on the same calendar day.
 * @param {Date} a
 * @param {Date} b
 */
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate()

/**
 * Formats a Date into "DD-Mon-YYYY HH:MM:SS UTC" display string.
 * Used for the "Last refreshed at" timestamp.
 * @param {Date} date
 * @returns {string}
 */
export const formatRefreshTime = (date) => {
  const d = date || new Date()
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} UTC`
}

/**
 * Formats a Date into "DD-Mon-YYYY HH:MM" display string.
 * Used for table record dates.
 * @param {Date} date
 * @returns {string}
 */
export const formatRecordDate = (date) => {
  const d = date || new Date()
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
