import { useState, useRef, useCallback } from 'react'
import { EXTRACTION_REQUESTS } from '../data/mockExtractions'
import { isSameDay, formatRefreshTime, formatRecordDate } from '../utils/dateUtils'

/**
 * Encapsulates all state and logic for the Dashboard page:
 *   – data + loading
 *   – column filters
 *   – pagination & sort
 *   – action handlers (refresh, submitRequest, view, download, delete, file-click)
 */
const useDashboard = () => {
  const toastRef = useRef(null)

  /* ── data ── */
  const [data, setData]                          = useState(EXTRACTION_REQUESTS)
  const [lastRefreshed, setLastRefreshed]        = useState(formatRefreshTime(new Date('2026-05-13T11:28:41')))
  const [loading,       setLoading]              = useState(false)

  /* ── filter state ── */
  const [filterBy,        setFilterBy]           = useState(null)
  const [filterRequestId, setFilterRequestId]    = useState('')
  const [filterFile,      setFilterFile]         = useState('')
  const [filterDate,      setFilterDate]         = useState(null)
  const [filterStatus,    setFilterStatus]       = useState(null)

  /* ── table state ── */
  const [rows,      setRows]      = useState(10)
  const [first,     setFirst]     = useState(0)
  const [sortField, setSortField] = useState('dateCreated')
  const [sortOrder, setSortOrder] = useState(-1)

  /* ── derived filtered data ── */
  const filteredData = data.filter((row) => {
    if (filterBy        && row.requestedBy !== filterBy)                                         return false
    if (filterRequestId && !row.requestId.toLowerCase().includes(filterRequestId.toLowerCase())) return false
    if (filterFile      && !row.manifestFile.toLowerCase().includes(filterFile.toLowerCase()))   return false
    if (filterStatus    && row.status !== filterStatus)                                          return false
    if (filterDate      && !isSameDay(new Date(row.dateCreated), filterDate))                    return false
    return true
  })

  /* ── action handlers ── */
  const handleRefresh = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setLastRefreshed(formatRefreshTime(new Date()))
      setLoading(false)
      toastRef.current?.show({
        severity: 'success', summary: 'Refreshed',
        detail: 'Data is up to date.', life: 2500,
      })
    }, 800)
  }, [])

  /** Called by AddExtractionModal on a valid PDF submit */
  const handleSubmitRequest = useCallback((file, reqId) => {
    const now = new Date()
    const newRecord = {
      id:           Date.now(),
      requestedBy:  'Current User',
      requestId:    reqId,
      manifestFile: file.name,
      dateCreated:  now.toISOString(),
      dateDisplay:  formatRecordDate(now),
      status:       'Pending',
    }
    setData((prev) => [newRecord, ...prev])
    toastRef.current?.show({
      severity: 'success',
      summary:  'Request Submitted',
      detail:   `Extraction request ${reqId} has been submitted successfully.`,
      life:     3000,
    })
  }, [])

  const handleView = (row) =>
    toastRef.current?.show({
      severity: 'info', summary: `View ${row.requestId}`,
      detail: `Viewing details for ${row.manifestFile}`, life: 2500,
    })

  const handleDownload = (row) =>
    toastRef.current?.show({
      severity: 'success', summary: 'Download Started',
      detail: `Downloading ${row.manifestFile}`, life: 2500,
    })

  const handleFileClick = (row) =>
    toastRef.current?.show({
      severity: 'info', summary: 'File Preview',
      detail: `Opening ${row.manifestFile}`, life: 2500,
    })

  /** Permanently removes a row from the dataset */
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
    handleSubmitRequest,
    handleView,
    handleDownload,
    handleFileClick,
    handleDelete,
  }
}

export default useDashboard
