import React from 'react'
import styles from './StatusBadge.module.css'

const STATUS_CLASS_MAP = {
  Completed:    styles.completed,
  'In Progress': styles.inProgress,
  Failed:       styles.failed,
  Pending:      styles.pending,
}

/**
 * Coloured pill badge that reflects an extraction request's status.
 * @param {{ status: string }} props
 */
const StatusBadge = ({ status }) => (
  <span className={`${styles.badge} ${STATUS_CLASS_MAP[status] ?? styles.default}`}>
    {status}
  </span>
)

export default StatusBadge
