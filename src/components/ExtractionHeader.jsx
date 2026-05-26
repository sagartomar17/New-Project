import React from 'react'
import { Button } from 'primereact/button'
import styles from './ExtractionHeader.module.css'

/**
 * Page header for the Dashboard:
 *   – title with live record count
 *   – Refresh button (with spinner state)
 *   – Add Extraction Request button
 *   – "Last refreshed at" timestamp
 *
 * @param {{
 *   count: number,
 *   lastRefreshed: string,
 *   loading: boolean,
 *   onRefresh: () => void,
 *   onAddRequest: () => void,
 * }} props
 */
const ExtractionHeader = ({ count, lastRefreshed, loading, onRefresh, onAddRequest }) => (
  <div className={styles.wrapper}>
    <div className={styles.pageHeader}>
      {/* Title */}
      <h1 className={styles.pageTitle}>
        M&amp;A Metadata Extractions
        <span className={styles.countBadge}>({count})</span>
      </h1>

      {/* Action buttons */}
      <div className={styles.headerActions}>
        <Button
          icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'}
          label="Refresh"
          className={`p-button-text p-button-plain ${styles.refreshBtn}`}
          onClick={onRefresh}
          disabled={loading}
        />
        <Button
          icon="pi pi-plus"
          label="Add Extraction Request"
          className={styles.addBtn}
          onClick={onAddRequest}
        />
      </div>
    </div>

    {/* Timestamp */}
    <p className={styles.refreshedAt}>Last refreshed at: {lastRefreshed}</p>
  </div>
)

export default ExtractionHeader
