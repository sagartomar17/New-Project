import React from 'react'
import { Toast } from 'primereact/toast'
import ExtractionHeader from './ExtractionHeader'
import ExtractionTable  from './ExtractionTable'
import useDashboard     from '../hooks/useDashboard'
import styles           from './Dashboard.module.css'

/**
 * Dashboard page — thin orchestration layer.
 * All state lives in useDashboard; UI is split into focused child components.
 */
const Dashboard = () => {
  const {
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
    handleAddRequest,
    handleView,
    handleDownload,
    handleFileClick,
  } = useDashboard()

  return (
    <div className={styles.page}>
      <Toast ref={toastRef} position="top-right" />

      <div className={styles.container}>
        {/* ── Header: title + action buttons + timestamp ── */}
        <ExtractionHeader
          count={filteredData.length}
          lastRefreshed={lastRefreshed}
          loading={loading}
          onRefresh={handleRefresh}
          onAddRequest={handleAddRequest}
        />

        {/* ── Data table with inline filters ── */}
        <ExtractionTable
          data={filteredData}
          loading={loading}
          filterBy={filterBy}               setFilterBy={setFilterBy}
          filterRequestId={filterRequestId} setFilterRequestId={setFilterRequestId}
          filterFile={filterFile}           setFilterFile={setFilterFile}
          filterDate={filterDate}           setFilterDate={setFilterDate}
          filterStatus={filterStatus}       setFilterStatus={setFilterStatus}
          rows={rows}           setRows={setRows}
          first={first}         setFirst={setFirst}
          sortField={sortField} setSortField={setSortField}
          sortOrder={sortOrder} setSortOrder={setSortOrder}
          onView={handleView}
          onDownload={handleDownload}
          onFileClick={handleFileClick}
        />
      </div>
    </div>
  )
}

export default Dashboard
