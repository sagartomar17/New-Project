/**
 * Seed data for M&A Metadata Extraction requests.
 * Replace / extend this with real API data in production.
 * @type {Array<{
 *   id: number,
 *   requestedBy: string,
 *   requestId: string,
 *   manifestFile: string,
 *   dateCreated: string,
 *   dateDisplay: string,
 *   status: 'Completed'|'In Progress'|'Pending'|'Failed'
 * }>}
 */
export const EXTRACTION_REQUESTS = [
  {
    id: 1,
    requestedBy:  'Emily Johnson',
    requestId:    'MAE-2026-0006',
    manifestFile: 'cover-letter.pdf',
    dateCreated:  '2026-05-13T11:28:00',
    dateDisplay:  '13-May-2026 11:28',
    status:       'Completed',
  },
  {
    id: 2,
    requestedBy:  'John Smith',
    requestId:    'MAE-2026-0005',
    manifestFile: 'form-signed.pdf',
    dateCreated:  '2026-05-13T10:45:00',
    dateDisplay:  '13-May-2026 10:45',
    status:       'Completed',
  },
  {
    id: 3,
    requestedBy:  'sarah lee',
    requestId:    'MAE-2026-0004',
    manifestFile: '1571.pdf',
    dateCreated:  '2026-05-13T09:32:00',
    dateDisplay:  '13-May-2026 09:32',
    status:       'In Progress',
  },
  {
    id: 4,
    requestedBy:  'sagar tomar',
    requestId:    'MAE-2026-0003',
    manifestFile: 'form-signed.pdf',
    dateCreated:  '2026-05-12T16:20:00',
    dateDisplay:  '12-May-2026 16:20',
    status:       'Completed',
  },
  {
    id: 5,
    requestedBy:  'harsh tomar',
    requestId:    'MAE-2026-0002',
    manifestFile: '1571.pdf',
    dateCreated:  '2026-05-12T15:14:00',
    dateDisplay:  '12-May-2026 15:14',
    status:       'Completed',
  },
  {
    id: 6,
    requestedBy:  'nikhil',
    requestId:    'MAE-2026-0001',
    manifestFile: 'cover-letter.pdf',
    dateCreated:  '2026-05-12T09:05:00',
    dateDisplay:  '12-May-2026 09:05',
    status:       'Completed',
  },
]
