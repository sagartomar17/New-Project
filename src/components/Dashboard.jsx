import React, { useState } from "react";
import { Toast } from "primereact/toast";
import ExtractionHeader from "./ExtractionHeader";
import ExtractionTable from "./ExtractionTable";
import AddExtractionModal from "./AddExtractionModal";
import useDashboard from "../hooks/useDashboard";
import styles from "./Dashboard.module.css";

/**
 * Dashboard page — thin orchestration layer.
 *
 * "Add Extraction Request" button opens a modal dialog (not a full-page replace).
 * All API integration is handled by useDashboard (table data) and
 * AddExtractionModal (request-ID generation + create submission).
 */
const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    toastRef,
    filteredData,
    lastRefreshed,
    loading,
    refreshOverlay,
    nextRequestId,
    /* filters */
    filterBy,
    setFilterBy,
    filterRequestId,
    setFilterRequestId,
    filterFile,
    setFilterFile,
    filterDate,
    setFilterDate,
    filterStatus,
    setFilterStatus,
    /* table */
    rows,
    setRows,
    first,
    setFirst,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    /* handlers */
    handleRefresh,
    handleExtractionCreated,
    handleView,
    handleDownload,
    handleFileClick,
    handleDelete,
  } = useDashboard();

  return (
    <div className={styles.page}>
      <Toast ref={toastRef} position="top-right" />

      {/* Full-screen overlay shown for 2.5 s when Refresh is clicked */}
      {refreshOverlay && (
        <div className={styles.refreshOverlay}>
          <div className={styles.refreshSpinnerBox}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2.8rem" }} />
            <p className={styles.refreshOverlayText}>Refreshing data…</p>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* Header: title + action buttons + timestamp */}
        <ExtractionHeader
          count={filteredData.length}
          lastRefreshed={lastRefreshed}
          loading={loading}
          onRefresh={handleRefresh}
          onAddRequest={() => setShowModal(true)}
        />

        {/* Data table with inline filters */}
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
          onView={handleView}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onFileClick={handleFileClick}
        />
      </div>

      {/* Add Extraction Request modal
          – nextRequestId is pre-fetched from the backend (always fresh)
          – onExtractionCreated receives (requestId, File) and POSTs to the API
          – the modal closes itself only on success (returns true) */}
      <AddExtractionModal
        visible={showModal}
        onHide={() => setShowModal(false)}
        nextRequestId={nextRequestId}
        onExtractionCreated={handleExtractionCreated}
      />
    </div>
  );
};

export default Dashboard;
