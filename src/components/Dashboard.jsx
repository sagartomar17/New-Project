import React, { useState, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import ExtractionHeader from './ExtractionHeader'
import ExtractionTable  from './ExtractionTable'
import AddExtractionPage from './AddExtractionPage'
import ViewDetailPage    from './ViewDetailPage'
import useDashboard      from '../hooks/useDashboard'
import styles from './Dashboard.module.css'

/**
 * Screen 1 — "All Requests Screen"
 *
 * view states:
 *   'list' — normal table
 *   'add'  — Add Extraction overlay
 *   'view' — View Detail overlay
 */
const Dashboard = () => {
  const [view,      setView]      = useState('list')
  const [activeRow, setActiveRow] = useState(null)

  const {
    toastRef,
    filteredData,
    lastRefreshed,
    loading,
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
    handleSubmitRequest,
    handleDownload,
    handleFileClick,
    handleDelete,
  } = useDashboard()

  /* ── lock body scroll when any overlay is open ── */
  useEffect(() => {
    document.body.style.overflow = view !== 'list' ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [view])

  /* ── navigation helpers ── */
  const openAdd  = ()    => setView('add')
  const openView = (row) => { setActiveRow(row); setView('view') }
  const goBack   = ()    => { setView('list'); setActiveRow(null) }

  return (
    <div className={styles.page}>
      <Toast ref={toastRef} position="top-right" />

      {/* ══════════════════════════════════════════
          SCREEN 1 — All Requests
          Dimmed (no blur) when overlay is open.
      ══════════════════════════════════════════ */}
      <div className={`${styles.container} ${view !== 'list' ? styles.blurred : ''}`}>

        <ExtractionHeader
          count={filteredData.length}
          lastRefreshed={lastRefreshed}
          loading={loading}
          onRefresh={handleRefresh}
          onAddRequest={openAdd}
        />

        <ExtractionTable
          data={filteredData}
          loading={loading}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          filterRequestId={filterRequestId}
          setFilterRequestId={setFilterRequestId}
          filterFile={filterFile}
          setFilterFile={setFilterFile}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          rows={rows}
          setRows={setRows}
          first={first}
          setFirst={setFirst}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onView={openView}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onFileClick={handleFileClick}
        />
      </div>

      {/* ══════════════════════════════════════════
          SCREEN 2 — Add Extraction Request overlay
      ══════════════════════════════════════════ */}
      {view === 'add' && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && goBack()}
        >
          <AddExtractionPage
            nextRequestId={nextRequestId}
            onCancel={goBack}
            onSubmit={(file, reqId) => {
              handleSubmitRequest(file, reqId)
              goBack()
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════
          View Detail overlay
      ══════════════════════════════════════════ */}
      {view === 'view' && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && goBack()}
        >
          <ViewDetailPage
            row={activeRow}
            onClose={goBack}
            onDelete={(row) => { handleDelete(row); goBack() }}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  )
}

export default Dashboard
