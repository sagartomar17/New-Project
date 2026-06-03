import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import styles from "./AddExtractionModal.module.css";

/**
 * AddExtractionModal
 * ───────────────────
 * Modal for submitting a new M&A metadata extraction request.
 *
 * Behaviour
 * ---------
 * • On open: pre-fills the Request ID from the `nextRequestId` prop —
 *   the field is editable so the user can override it.
 * • File upload: drag-and-drop or click-to-browse; PDF only.
 * • On submit: calls onExtractionCreated(requestId, fileName) which adds
 *   the new row directly to the dashboard table (no backend needed).
 *
 * @param {{
 *   visible:                boolean,
 *   onHide:                 () => void,
 *   nextRequestId:          string,
 *   onExtractionCreated:    (requestId: string, fileName: string) => void,
 * }} props
 */
const AddExtractionModal = ({ visible, onHide, nextRequestId, onExtractionCreated }) => {
  /* ── Request ID state ── */
  const [requestId, setRequestId] = useState("")

  /* ── File state ── */
  const [uploadedFile,  setUploadedFile]  = useState(null)
  const [dragOver,      setDragOver]      = useState(false)
  const [showFileError, setShowFileError] = useState(false)

  const fileInputRef = useRef(null)

  /* ── Pre-fill request ID whenever the modal opens ── */
  useEffect(() => {
    if (visible) {
      setRequestId(nextRequestId)
    }
  }, [visible, nextRequestId])

  /* ── helpers ── */
  const isPdf = (file) =>
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")

  const processFile = (file) => {
    if (!isPdf(file)) { setShowFileError(true); return }
    setUploadedFile(file)
  }

  const resetAndClose = () => {
    setUploadedFile(null)
    setDragOver(false)
    setShowFileError(false)
    setRequestId("")
    onHide()
  }

  /* ── drag-and-drop ── */
  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = ()  => setDragOver(false)
  const handleDrop      = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  /* ── file input ── */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!uploadedFile || !requestId.trim()) return
    // Pass the actual File object (needed for multipart upload to the backend)
    const success = await onExtractionCreated(requestId.trim(), uploadedFile)
    if (success) resetAndClose()
    // On failure the modal stays open so the user can see the error toast and retry
  }

  /* ── derived values ── */
  const canSubmit = !!uploadedFile && !!requestId.trim()

  const dropZoneClass = [
    styles.dropZone,
    dragOver     ? styles.dropZoneActive  : "",
    uploadedFile ? styles.dropZoneSuccess : "",
  ].join(" ").trim()

  /* ── file-error dialog footer ── */
  const fileErrorFooter = (
    <div className={styles.pdfErrorFooter}>
      <Button
        label="OK"
        className={styles.submitBtn}
        onClick={() => setShowFileError(false)}
      />
    </div>
  )

  return (
    <>
      {/* ────────────────── Main modal ────────────────── */}
      <Dialog
        header="Add Extraction Request"
        visible={visible}
        style={{ width: "50rem" }}
        onHide={resetAndClose}
        draggable={false}
        resizable={false}
        className={styles.dialog}
      >
        <div className={styles.body}>

          {/* ── Request ID ── */}
          <div className={styles.field}>
            <label className={styles.label}>
              Request ID <span className={styles.required}>*</span>
            </label>

            <input
              type="text"
              className={styles.requestIdInput}
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="e.g. MAE-2026-0007"
              aria-label="Request ID"
            />

            <small className={styles.hint}>
              Auto-generated — you may edit this before submitting.
            </small>
          </div>

          {/* ── Manifest Upload ── */}
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
              onKeyDown={(e) =>
                e.key === "Enter" && !uploadedFile && fileInputRef.current?.click()
              }
              aria-label="Upload PDF manifest file"
            >
              {uploadedFile ? (
                /* selected-file preview */
                <div className={styles.filePreview}>
                  <i className="pi pi-file-pdf" />
                  <span className={styles.fileName}>{uploadedFile.name}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
                    title="Remove file"
                    type="button"
                  >
                    <i className="pi pi-times" />
                  </button>
                </div>
              ) : (
                /* empty-state prompt */
                <>
                  <i className="pi pi-cloud-upload" />
                  <p className={styles.dropText}>
                    Drag and drop file here or{" "}
                    <span className={styles.selectLink}>Select file</span>
                  </p>
                </>
              )}
            </div>

            <small className={styles.hint}>
              Upload PDF manifest with SharePoint document links
            </small>

            {/* hidden file input — PDF only */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />
          </div>

          {/* ── Footer buttons ── */}
          <div className={styles.footer}>
            <Button
              label="Cancel"
              className={`p-button-text ${styles.cancelBtn}`}
              onClick={resetAndClose}
            />
            <Button
              label="Submit Request"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!canSubmit}
            />
          </div>

        </div>
      </Dialog>

      {/* ────────────── File-type validation error ────────────── */}
      <Dialog
        header="Invalid File Type"
        visible={showFileError}
        style={{ width: "22rem" }}
        onHide={() => setShowFileError(false)}
        draggable={false}
        resizable={false}
        footer={fileErrorFooter}
        className={styles.errorDialog}
      >
        <div className={styles.errorBody}>
          <i className="pi pi-exclamation-triangle" />
          <p>
            Please upload a <strong>PDF</strong> file only (.pdf).
            <br />
            <span className={styles.errorSub}>
              Other formats (Excel, Word, etc.) are not accepted.
            </span>
          </p>
        </div>
      </Dialog>
    </>
  )
}

export default AddExtractionModal
