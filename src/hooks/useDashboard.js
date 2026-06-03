import { useState, useRef, useCallback, useEffect } from 'react'
import { isSameDay, formatRefreshTime } from '../utils/dateUtils'
import { getExtractions, generateRequestId, createExtraction } from '../services/extractionApi'

/**
 * useDashboard
 * ─────────────
 * Encapsulates all state and logic for the Dashboard page.
 *
 * Data flow
 * ---------
 *  Mount          → loadData() → GET /api/extractions
 *  Refresh button → loadData() → GET /api/extractions  (+ success toast)
 *  Modal opens    → nextRequestId is pre-fetched with the data; always fresh
 *  Form submit    → handleExtractionCreated(requestId, file)
 *                     → POST /api/extractions  (multipart)
 *                     → loadData() to refresh the table
 *
 * Filters, pagination, and sort are kept in local state because they are
 * pure UI concerns and do not need to round-trip to the server.
 */
const useDashboard = () => {
  const toastRef = useRef(null)

  /* ── data ─────────────────────────────────────────────────────────────── */
  const [data,            setData]            = useState([])
  const [lastRefreshed,   setLastRefreshed]   = useState('')
  const [loading,         setLoading]         = useState(false)
  const [refreshOverlay,  setRefreshOverlay]  = useState(false)

  /* ── next request ID (kept fresh from the backend) ─────────────────── */
  const [nextRequestId, setNextRequestId] = useState('MAE-2026-0001')

  /* ── filter state ─────────────────────────────────────────────────────── */
  const [filterBy,        setFilterBy]        = useState(null)
  const [filterRequestId, setFilterRequestId] = useState('')
  const [filterFile,      setFilterFile]      = useState('')
  const [filterDate,      setFilterDate]      = useState(null)
  const [filterStatus,    setFilterStatus]    = useState(null)

  /* ── table state ─────────────────────────────────────────────────────── */
  const [rows,      setRows]      = useState(10)
  const [first,     setFirst]     = useState(0)
  const [sortField, setSortField] = useState('dateCreated')
  const [sortOrder, setSortOrder] = useState(-1)

  /* ── core data loader ────────────────────────────────────────────────── */
  /**
   * Fetches records AND the next request ID in one go so both stay in sync.
   * @param {boolean} showSuccessToast - show a "Refreshed" toast after load
   */
  const loadData = useCallback(async (showSuccessToast = false) => {
    setLoading(true)
    try {
      // Run both requests in parallel
      const [records, nextId] = await Promise.all([
        getExtractions(),
        generateRequestId(),
      ])
      setData(records)
      setNextRequestId(nextId)
      setLastRefreshed(formatRefreshTime(new Date()))

      if (showSuccessToast) {
        toastRef.current?.show({
          severity: 'success',
          summary:  'Refreshed',
          detail:   'Data is up to date.',
          life:     2500,
        })
      }
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary:  'Load Failed',
        detail:   err.message ?? 'Could not load extraction requests.',
        life:     4000,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── load on mount ───────────────────────────────────────────────────── */
  useEffect(() => {
    loadData()
  }, [loadData])

  /* ── derived filtered data ───────────────────────────────────────────── */
  const filteredData = data.filter((row) => {
    if (filterBy        && row.requestedBy !== filterBy)                                         return false
    if (filterRequestId && !row.requestId.toLowerCase().includes(filterRequestId.toLowerCase())) return false
    if (filterFile      && !row.manifestFile.toLowerCase().includes(filterFile.toLowerCase()))   return false
    if (filterStatus    && row.status !== filterStatus)                                          return false
    if (filterDate      && !isSameDay(new Date(row.dateCreated), filterDate))                    return false
    return true
  })

  /* ── action handlers ─────────────────────────────────────────────────── */

  /**
   * Re-fetches data and shows a full-screen overlay loader for at least 2.5 s.
   * The overlay and the actual fetch run in parallel so the UI never blocks
   * longer than necessary beyond the minimum display time.
   */
  const handleRefresh = useCallback(async () => {
    setRefreshOverlay(true)
    try {
      // Both run concurrently — overlay stays until the longer one finishes
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 2500)), // min 2.5 s display
        loadData(false),                                      // actual data fetch
      ])
    } finally {
      setRefreshOverlay(false)
    }
  }, [loadData])

  /**
   * Submits a new extraction request to the backend.
   * Called by AddExtractionModal after the user fills in the form.
   *
   * @param {string} requestId - request ID entered/generated in the modal
   * @param {File}   file      - the PDF File object from the file input
   * @returns {Promise<boolean>} true on success (modal should close), false on error
   */
  const handleExtractionCreated = useCallback(async (requestId, file) => {
    try {
      // POST /api/extractions  — saves to backend/data/extractions.json
      await createExtraction(file, requestId, 'Sagar Tomar')

      // Refresh the table and pre-fetch the next request ID
      await loadData()
      setFirst(0)   // jump to page 1 so the new row is visible

      toastRef.current?.show({
        severity: 'success',
        summary:  'Request Submitted',
        detail:   `Extraction request ${requestId} has been submitted successfully.`,
        life:     3000,
      })
      return true   // signal success → modal will close
    } catch (err) {
      toastRef.current?.show({
        severity: 'error',
        summary:  'Submission Failed',
        detail:   err.message ?? 'Could not submit the extraction request.',
        life:     4000,
      })
      return false  // signal failure → modal stays open so user can retry
    }
  }, [loadData])

  const handleView = (row) =>
    toastRef.current?.show({
      severity: 'info',
      summary:  `View ${row.requestId}`,
      detail:   `Viewing details for ${row.manifestFile}`,
      life:     2500,
    })

  const handleDownload = (row) =>
    toastRef.current?.show({
      severity: 'success',
      summary:  'Download Started',
      detail:   `Downloading ${row.manifestFile}`,
      life:     2500,
    })

  const handleFileClick = (row) =>
    toastRef.current?.show({
      severity: 'info',
      summary:  'File Preview',
      detail:   `Opening ${row.manifestFile}`,
      life:     2500,
    })

  /** Removes a row from local state (optimistic delete — no backend call yet). */
  const handleDelete = useCallback((row) => {
    setData((prev) => prev.filter((r) => r.id !== row.id))
    toastRef.current?.show({
      severity: 'success',
      summary:  'Request Deleted',
      detail:   `Extraction request ${row.requestId} has been deleted.`,
      life:     3000,
    })
  }, [])

  return {
    toastRef,
    filteredData,
    lastRefreshed,
    loading,
    refreshOverlay,
    nextRequestId,
    /* filters */
    filterBy,        setFilterBy,
    filterRequestId, setFilterRequestId,
    filterFile,      setFilterFile,
    filterDate,      setFilterDate,
    filterStatus,    setFilterStatus,
    /* table */
    rows,      setRows,
    first,     setFirst,
    sortField, setSortField,
    sortOrder, setSortOrder,
    /* handlers */
    handleRefresh,
    handleExtractionCreated,
    handleView,
    handleDownload,
    handleFileClick,
    handleDelete,
  }
}

export default useDashboard
