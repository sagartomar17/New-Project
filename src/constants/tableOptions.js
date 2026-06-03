/**
 * tableOptions.js
 * ───────────────
 * Shared constants for the extraction table UI.
 *
 * REQUESTED_BY_OPTIONS is intentionally absent — that dropdown is built
 * dynamically from live API data inside ExtractionTable so it always
 * reflects real users, not a hardcoded list.
 */

/** Dropdown options for the "Status" column filter */
export const STATUS_OPTIONS = [
  { label: 'Select One',   value: null          },
  { label: 'Completed',    value: 'Completed'   },
  { label: 'In Progress',  value: 'In Progress' },
  { label: 'Pending',      value: 'Pending'     },
  { label: 'Failed',       value: 'Failed'      },
]

/** Available row-per-page choices for the paginator */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50]
