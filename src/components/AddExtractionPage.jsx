import React, { useState, useRef } from 'react'
import styles from './AddExtractionPage.module.css'

/**
 * Screen 2 — "Add Extraction Request"
 * Matches the design screenshot exactly:
 *   Header  : title + X close
 *   Divider
 *   Body    : Request ID (auto-generated, gray input) + Manifest Upload drop-zone
 *   Divider
 *   Footer  : [Cancel]  [Submit Request]
 */
const AddExtractionPage = ({ nextRequestId, onCancel, onSubmit }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileErr,      setFileErr]      = useState('')
  const [dragOver,     setDragOver]     = useState(false)
  const fileInputRef = useRef(null)

  /* ── drag-and-drop ── */
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = ()  => setDragOver(false)
  const handleDrop      = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) { setUploadedFile(file); setFileErr('') }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) { setUploadedFile(file); setFileErr('') }
    e.target.value = ''
  }

  /* ── submit ── */
  const handleSubmit = () => {
    if (!uploadedFile) { setFileErr('Please upload a manifest file.'); return }
    onSubmit(uploadedFile, nextRequestId)
  }

  /* ── drop-zone class ── */
  const dropZoneClass = [
    styles.dropZone,
    dragOver     ? styles.dropZoneActive  : '',
    uploadedFile ? styles.dropZoneSuccess : '',
    fileErr      ? styles.dropZoneError   : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.card}>

      {/* ── Header ── */}
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Add Extraction Request</h2>
        <button
          className={styles.closeBtn}
          onClick={onCancel}
          aria-label="Close"
          type="button"
        >
          <i className="pi pi-times" />
        </button>
      </div>

      <div className={styles.divider} />

      {/* ── Body ── */}
      <div className={styles.cardBody}>

        {/* Request ID — auto-generated, read-only */}
        <div className={styles.field}>
          <label className={styles.label}>
            Request ID <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.requestIdInput}
            value={nextRequestId}
            readOnly
          />
          <small className={styles.autoHint}>(Auto-generated)</small>
        </div>

        {/* Manifest Upload */}
        <div className={styles.field}>
          <label className={styles.label}>
            Manifest Upload <span className={styles.required}>*</span>
          </label>

          <div
            className={dropZoneClass}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && !uploadedFile && fileInputRef.current?.click()}
            aria-label="Upload manifest file"
          >
            {uploadedFile ? (
              <div className={styles.filePreview}>
                <i className="pi pi-file" />
                <span className={styles.fileName}>{uploadedFile.name}</span>
                <button
                  className={styles.removeBtn}
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setFileErr('') }}
                  title="Remove file"
                  type="button"
                >
                  <i className="pi pi-times" />
                </button>
              </div>
            ) : (
              <>
                <i className="pi pi-cloud-upload" />
                <p className={styles.dropText}>
                  Drag and drop file here or{' '}
                  <span className={styles.selectLink}>Select file</span>
                </p>
              </>
            )}
          </div>

          {fileErr
            ? <small className={styles.fieldError}><i className="pi pi-exclamation-circle" /> {fileErr}</small>
            : <small className={styles.hint}>Upload Excel manifest with SharePoint document links</small>
          }

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={onCancel} type="button">
          Cancel
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit} type="button">
          Submit Request
        </button>
      </div>

    </div>
  )
}

export default AddExtractionPage
