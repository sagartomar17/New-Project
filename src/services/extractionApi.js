const API_BASE = "http://127.0.0.1:8000";

/* GET /api/extractions */
export const getExtractions = async () => {
  const response = await fetch(`${API_BASE}/api/extractions`);

  if (!response.ok) {
    throw new Error("Failed to load extraction data");
  }

  const data = await response.json();

  return data.map((item) => ({
    id: item.requestId,
    requestId: item.requestId,
    manifestFile: item.manifestFile,
    requestedBy: item.requestedBy,
    status: item.status,
    dateCreated: item.createdDate,
    dateDisplay: new Date(item.createdDate).toLocaleDateString(),
  }));
};

/* GET /api/request-id */
export const generateRequestId = async () => {
  const response = await fetch(`${API_BASE}/api/request-id`);

  if (!response.ok) {
    throw new Error("Failed to generate request ID");
  }

  const data = await response.json();

  return data.requestId;
};

/* POST /api/extractions */
export const createExtraction = async (file, requestId, requestedBy) => {
  const response = await fetch(`${API_BASE}/api/extractions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestId,
      manifestFile: file.name,
      requestedBy,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create extraction request");
  }

  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await fetch(`${API_BASE}/api/upload/${requestId}`, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload PDF");
  }

  return await response.json();
};