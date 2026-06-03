import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import StatusBadge from "./StatusBadge";
import {
  REQUESTED_BY_OPTIONS,
  STATUS_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
} from "../constants/tableOptions";
import styles from "./ExtractionTable.module.css";

/**
 * Data table for extraction requests.
 * Receives all filter / pagination / sort state from the parent hook
 * so state is lifted (enabling the header count badge to stay in sync).
 */
const ExtractionTable = ({
  data,
  loading,
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
  /* pagination / sort */
  rows,
  setRows,
  first,
  setFirst,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  /* action handlers */
  onView,
  onDelete,
  onDownload,
  onFileClick,
}) => {
  /* ── column body templates ── */
  const manifestFileBody = (row) => (
    <button className={styles.fileLink} onClick={() => onFileClick(row)}>
      {row.manifestFile}
    </button>
  );

  const statusBody = (row) => <StatusBadge status={row.status} />;

  const actionsBody = (row) => (
    <div className={styles.actions}>
      {/* Eye — view details */}
      <button
        className={styles.iconBtn}
        onClick={() => onView(row)}
        title="View details"
        aria-label={`View ${row.requestId}`}
      >
        <i className="pi pi-eye" />
      </button>

      {/* Trash — delete row directly */}
      <button
        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
        onClick={() => onDelete(row)}
        title="Delete"
        aria-label={`Delete ${row.requestId}`}
      >
        <i className="pi pi-trash" />
      </button>

      {/* Download */}
      <button
        className={styles.iconBtn}
        onClick={() => onDownload(row)}
        title="Download"
        aria-label={`Download ${row.manifestFile}`}
      >
        <i className="pi pi-download" />
      </button>
    </div>
  );

  /* ── filter elements ── */
  const requestedByFilter = (
    <Dropdown
      value={filterBy}
      options={REQUESTED_BY_OPTIONS}
      onChange={(e) => {
        setFilterBy(e.value);
        setFirst(0);
      }}
      placeholder="Select One"
      className={styles.filterDropdown}
      showClear={!!filterBy}
    />
  );

  const requestIdFilter = (
    <span className={styles.searchWrap}>
      <i className={`pi pi-search ${styles.searchIcon}`} />
      <InputText
        value={filterRequestId}
        onChange={(e) => {
          setFilterRequestId(e.target.value);
          setFirst(0);
        }}
        placeholder="Search by request ID"
        className={`${styles.filterInput} ${styles.filterInputPadded}`}
      />
    </span>
  );

  const fileFilter = (
    <span className={styles.searchWrap}>
      <i className={`pi pi-search ${styles.searchIcon}`} />
      <InputText
        value={filterFile}
        onChange={(e) => {
          setFilterFile(e.target.value);
          setFirst(0);
        }}
        placeholder="Search by file name"
        className={`${styles.filterInput} ${styles.filterInputPadded}`}
      />
    </span>
  );

  const dateFilter = (
    <Calendar
      value={filterDate}
      onChange={(e) => {
        setFilterDate(e.value);
        setFirst(0);
      }}
      placeholder="Pick a date"
      showIcon
      dateFormat="dd-M-yy"
      inputClassName={styles.filterInput}
      className={styles.filterCalendar}
      showButtonBar
      onClearButtonClick={() => {
        setFilterDate(null);
        setFirst(0);
      }}
    />
  );

  const statusFilter = (
    <Dropdown
      value={filterStatus}
      options={STATUS_OPTIONS}
      onChange={(e) => {
        setFilterStatus(e.value);
        setFirst(0);
      }}
      placeholder="Select One"
      className={styles.filterDropdown}
      showClear={!!filterStatus}
    />
  );

  /* ── paginator slots ── */
  const paginatorLeft = (
    <div className={styles.paginatorLeft}>
      <span className={styles.rowsLabel}>Rows per page:</span>
      <Dropdown
        value={rows}
        options={ROWS_PER_PAGE_OPTIONS.map((v) => ({
          label: String(v),
          value: v,
        }))}
        onChange={(e) => {
          setRows(e.value);
          setFirst(0);
        }}
        className={styles.rowsDropdown}
      />
    </div>
  );

  const paginatorRight = (
    <span className={styles.pageInfo}>
      {first + 1}–{Math.min(first + rows, data.length)} of {data.length}
    </span>
  );

  /* ── empty state ── */
  const emptyMessage = (
    <div className={styles.emptyState}>
      <i
        className="pi pi-inbox"
        style={{ fontSize: "2.5rem", color: "#CBD5E0", marginBottom: "12px" }}
      />
      <p style={{ color: "#718096", fontSize: "14px" }}>
        No extraction requests found.
      </p>
      <p style={{ color: "#A0AEC0", fontSize: "12px", marginTop: "4px" }}>
        Try adjusting your filters.
      </p>
    </div>
  );

  /* ── render ── */
  return (
    <div className={styles.tableCard}>
      <DataTable
        value={data}
        loading={loading}
        emptyMessage={emptyMessage}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          setSortField(e.sortField);
          setSortOrder(e.sortOrder);
        }}
        paginator
        rows={rows}
        first={first}
        onPage={(e) => setFirst(e.first)}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        filterDisplay="row"
        rowHover
        scrollable
        scrollHeight="flex"
        className={styles.dataTable}
        tableStyle={{ minWidth: "860px" }}
      >
        <Column
          field="requestedBy"
          header="Requested By"
          filter
          filterElement={requestedByFilter}
          showFilterMenu={false}
          style={{ minWidth: "160px" }}
        />
        <Column
          field="requestId"
          header="Request ID"
          filter
          filterElement={requestIdFilter}
          showFilterMenu={false}
          style={{ minWidth: "180px" }}
        />
        <Column
          field="manifestFile"
          header="Manifest File"
          body={manifestFileBody}
          filter
          filterElement={fileFilter}
          showFilterMenu={false}
          style={{ minWidth: "180px" }}
        />
        <Column
          field="dateCreated"
          header="Date Created"
          body={(row) => row.dateDisplay}
          sortable
          filter
          filterElement={dateFilter}
          showFilterMenu={false}
          style={{ minWidth: "180px" }}
        />
        <Column
          field="status"
          header="Status"
          body={statusBody}
          filter
          filterElement={statusFilter}
          showFilterMenu={false}
          style={{ minWidth: "150px" }}
        />
        <Column
          header="Actions"
          body={actionsBody}
          style={{ minWidth: "100px", textAlign: "center" }}
          headerStyle={{ textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
};

export default ExtractionTable;
