import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import styles from "./AddExtractionModal.module.css";

/**
 * Modal for submitting a new M&A metadata extraction request.
 * The user types their own Request ID and uploads a PDF manifest.
 *
 * @param {{
 *   visible:  boolean,
 *   onHide:   () => void,
 *   onSubmit: (file: File, requestId: string) => void,
 * }} props
 */
const AddExtractionModal = ({ visible, onHide, onSubmit }) => {
  const [requestId, setRequestId] = useState("");
  const [requestIdErr, setRequestIdErr] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPdfError, setShowPdfError] = useState(false);
  const fileInputRef = useRef(null);

  /* ── helpers ── */
  const isPdf = (file) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  const processFile = (file) => {
    if (!isPdf(file)) {
      setShowPdfError(true);
      return;
    }
    setUploadedFile(file);
  };

  const resetAndClose = () => {
    setRequestId("");
    setRequestIdErr(false);
    setUploadedFile(null);
    setDragOver(false);
    onHide();
  };

  /* ── request ID input ── */
  const handleRequestIdChange = (e) => {
    setRequestId(e.target.value);
    if (e.target.value.trim()) setRequestIdErr(false);
  };

  /* ── drag-and-drop handlers ── */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  /* ── file-input handler ── */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = ""; // allow re-selecting same file after error
  };

  /* ── submit ── */
  const handleSubmit = () => {
    const trimmed = requestId.trim();
    if (!trimmed) {
      setRequestIdErr(true);
      return;
    }
    if (!uploadedFile) return;
    onSubmit(uploadedFile, trimmed);
    resetAndClose();
  };

  /* ── PDF error footer ── */
  const pdfErrorFooter = (
    <div className={styles.pdfErrorFooter}>
      <Button
        label="OK"
        className={styles.submitBtn}
        onClick={() => setShowPdfError(false)}
      />
    </div>
  );

  /* ── drop-zone class composition ── */
  const dropZoneClass = [
    styles.dropZone,
    dragOver ? styles.dropZoneActive : "",
    uploadedFile ? styles.dropZoneSuccess : "",
  ]
    .join(" ")
    .trim();

  const canSubmit = requestId.trim().length > 0 && !!uploadedFile;

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
          {/* ── Request ID (user-entered) ── */}
          <div className={styles.field}>
            <label className={styles.label}>
              Request ID <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${styles.requestIdInput} ${requestIdErr ? styles.inputError : ""}`}
              value={requestId}
              onChange={handleRequestIdChange}
              placeholder="e.g. MAE-2026-0007"
              autoFocus
            />
            {requestIdErr && (
              <small className={styles.errorText}>
                <i className="pi pi-exclamation-circle" /> Request ID is
                required.
              </small>
            )}
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
                e.key === "Enter" &&
                !uploadedFile &&
                fileInputRef.current?.click()
              }
              aria-label="Upload PDF file"
            >
              {uploadedFile ? (
                /* ── selected file preview ── */
                <div className={styles.filePreview}>
                  <i className="pi pi-file-pdf" />
                  <span className={styles.fileName}>{uploadedFile.name}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    title="Remove file"
                    type="button"
                  >
                    <i className="pi pi-times" />
                  </button>
                </div>
              ) : (
                /* ── empty state ── */
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

            {/* hidden file input — no accept filter so user can pick any file;
                non-PDF files are caught by processFile and trigger the error popup */}
            <input
              ref={fileInputRef}
              type="file"
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

      {/* ────────────── PDF validation error popup ────────────── */}
      <Dialog
        header="Invalid File Type"
        visible={showPdfError}
        style={{ width: "22rem" }}
        onHide={() => setShowPdfError(false)}
        draggable={false}
        resizable={false}
        footer={pdfErrorFooter}
        className={styles.errorDialog}
      >
        <div className={styles.errorBody}>
          <i className="pi pi-exclamation-triangle" />
          <p>
            Please upload a <strong>PDF</strong> file only.
            <br />
            <span className={styles.errorSub}>
              Other formats (Excel, Word, etc.) are not accepted.
            </span>
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default AddExtractionModal;
