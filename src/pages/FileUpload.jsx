import { useEffect, useState } from "react";
import {
  Upload,
  File,
  FileText,
  Image,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./FileUpload.css";
import { submitProposal, getMyProposals } from "../api/index";

export function FileUpload({ eventId }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch current user's proposals and files
  const fetchProposals = async () => {
    try {
      const res = await getMyProposals();
      if (res.data && res.data.length > 0) {
        // Show files of the first proposal (or modify if you want multiple proposals)
        setUploadedFiles(res.data[0].files || []);
      } else {
        setUploadedFiles([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load proposals.");
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("eventId", eventId); // backend needs eventId
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      await submitProposal(formData);
      alert("Proposal submitted successfully!");
      setFiles([]);
      fetchProposals();
    } catch (err) {
      console.error("Submit proposal failed:", err);
      alert(err.message || "Failed to submit proposal.");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText size={24} className="icon-red" />;
      case "DOCX":
        return <File size={24} className="icon-blue" />;
      case "JPG":
      case "PNG":
        return <Image size={24} className="icon-green" />;
      default:
        return <File size={24} className="icon-gray" />;
    }
  };

  const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="file-upload space-y-6">
      {/* Proposal Submission Card */}
      <div className="upload-area card">
        <div className="upload-header">
          <h2>Submit Proposal</h2>
          <p>Add your proposal title, abstract, and files for the event</p>
        </div>

        <form onSubmit={handleSubmit} className="proposal-form">
          <div className="upload-dropzone">
            <div className="upload-icon">
              <Upload size={32} />
            </div>
            <p>Drag and drop your files here</p>
            <p>or click to browse your files</p>
            <label className="upload-button">
              Select Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                hidden
                accept=".pdf,.docx,.pptx,.jpg,.png"
              />
            </label>
          </div>

          <p>{files.length} file(s) selected</p>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>
      </div>

      {/* Uploaded Files List */}
      <div className="uploaded-files card">
        <div className="upload-header">
          <h2>Uploaded Files</h2>
          <p>{uploadedFiles.length} file(s) uploaded</p>
        </div>

        <div className="files-list">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-icon">{getFileIcon(file.type)}</div>

              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <div className="file-meta">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span className="file-category">{file.category}</span>
                  <span>•</span>
                  <span>{file.uploadDate}</span>
                </div>
              </div>

              <div className="file-actions">
                {file.status === "Validated" ? (
                  <span className="file-status valid">
                    <CheckCircle size={16} /> Validated
                  </span>
                ) : (
                  <span className="file-status pending">
                    <AlertCircle size={16} /> {file.status}
                  </span>
                )}

                <button
                  className="btn-icon"
                  onClick={() => handleDownload(file.url, file.name)}
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
