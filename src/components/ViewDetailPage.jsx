import React from 'react'
import { Button } from 'primereact/button'
import styles from './ViewDetailPage.module.css'

/**
 * View-detail card — renders inside the Dashboard overlay.
 * Shows full record info and exposes the Delete action.
 *
 * @param {{
 *   row:       object,
 *   onClose:   () => void,
 *   onDelete:  (row: object) => void,
 *   onDownload:(row: object) => void,
 * }} props
 */
const ViewDetailPage = ({ row, onClose, onDelete, onDownload }) => {
  if (!row) return null

  return (
    <div className={styles.card}>

      {/* ── Card header ── */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <i className="pi pi-file-pdf" />
          </div>
          <div>
            <h2 className={styles.cardTitle}>Extraction Request Details</h2>
            <p className={styles.cardSubtitle}>{row.requestId}</p>
          </div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <i className="pi pi-times" />
        </button>
      </div>

      <div className={styles.divider} />

      {/* ── Card body ── */}
      <div className={styles.cardBody}>

        {/* ── Detail grid ── */}
        <div className={styles.detailGrid}>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              <i className="pi pi-tag" /> Request ID
            </span>
            <span className={`${styles.detailValue} ${styles.requestIdBadge}`}>
              {row.requestId}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              <i className="pi pi-user" /> Requested By
            </span>
            <span className={styles.detailValue}>{row.requestedBy}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              <i className="pi pi-file" /> Manifest File
            </span>
            <span className={`${styles.detailValue} ${styles.fileValue}`}>
              <i className="pi pi-file-pdf" style={{ color: '#E8192C' }} />
              {row.manifestFile}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              <i className="pi pi-calendar" /> Date Created
            </span>
            <span className={styles.detailValue}>{row.dateDisplay}</span>
          </div>

          <div className={`${styles.detailItem} ${styles.fullWidth}`}>
            <span className={styles.detailLabel}>
              <i className="pi pi-info-circle" /> Status
            </span>
            <span className={`${styles.statusBadge} ${styles[`status_${row.status?.replace(/\s+/g, '')}`]}`}>
              {row.status}
            </span>
          </div>

        </div>

      </div>

      <div className={styles.divider} />

      {/* ── Footer: Download + Delete ── */}
      <div className={styles.footer}>
        <Button
          label="Download"
          icon="pi pi-download"
          className={`p-button-text ${styles.downloadBtn}`}
          onClick={() => onDownload(row)}
        />
        <div className={styles.footerRight}>
          <Button
            label="Close"
            className={`p-button-text ${styles.cancelBtn}`}
            onClick={onClose}
          />
          <Button
            label="Delete Request"
            icon="pi pi-trash"
            className={styles.deleteBtn}
            onClick={() => onDelete(row)}
          />
        </div>
      </div>

    </div>
  )
}

export default ViewDetailPage
