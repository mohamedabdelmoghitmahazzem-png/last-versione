import { useState, useEffect } from "react";
import { Save, Send } from "lucide-react";
import { getMyProposals } from "../api/index";
import "./submission.css";

export default function SubmissionForm({ eventId }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "orale",
    theme: "",
    abstract: "",
    keywords: "",
    coAuthors: "",
  });

  const [files, setFiles] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load existing proposals
  useEffect(() => {
    async function fetchProposals() {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyProposals(token);
        setMyProposals(res.data);
      } catch (err) {
        console.error("Failed to load proposals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e, isDraft) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    if (!formData.title || !formData.abstract) {
      alert("Please enter title and abstract.");
      return;
    }

    if (!isDraft && files.length === 0) {
      alert("Select at least one file for submission.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("type", formData.type);
    data.append("theme", formData.theme);
    data.append("keywords", formData.keywords);
    data.append("coAuthors", formData.coAuthors);
    data.append("draft", isDraft);
    if (eventId) data.append("eventId", eventId);
    files.forEach((file) => data.append("files", file));

    try {
      setSubmitting(true);
      const response = await fetch(
        "https://v-nement-scientifique.onrender.com/cfp/submit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to submit proposal");
      }

      alert(isDraft ? "Draft saved!" : "Proposal submitted successfully!");
      setFormData({
        title: "",
        type: "orale",
        theme: "",
        abstract: "",
        keywords: "",
        coAuthors: "",
      });
      setFiles([]);

      // Refresh proposals
      const res = await getMyProposals(token);
      setMyProposals(res.data);
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err.message || "Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading your proposals...</p>;

  return (
    <div className="submission-container">
      <div className="submission-card">
        <div className="submission-header">
          <h2>Submit a Presentation Proposal</h2>
          <p>Fill out the form below to submit your proposal</p>
        </div>

        <form className="submission-form">
          {/* Title */}
          <div className="form-group">
            <label>
              Presentation Title <span>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter the title of your presentation"
              required
            />
          </div>

          {/* Type */}
          <div className="form-group">
            <label>
              Presentation Type <span>*</span>
            </label>
            <div className="type-grid">
              {[
                { value: "orale", label: "Oral Presentation", icon: "🎤" },
                { value: "affichée", label: "Poster Presentation", icon: "📋" },
                { value: "poster", label: "Poster", icon: "🖼️" },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`type-card ${
                    formData.type === type.value ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  />
                  <span className="icon">{type.icon}</span>
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="form-group">
            <label>
              Theme <span>*</span>
            </label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({ ...formData, theme: e.target.value })
              }
              required
            >
              <option value="">Select a theme</option>
              <option value="ia">Artificial Intelligence</option>
              <option value="ml">Machine Learning</option>
              <option value="data">Data Science</option>
              <option value="cybersec">Cybersecurity</option>
              <option value="iot">Internet of Things</option>
              <option value="blockchain">Blockchain</option>
            </select>
          </div>

          {/* Abstract */}
          <div className="form-group">
            <label>
              Abstract <span>*</span>
            </label>
            <textarea
              rows="8"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              required
            />
          </div>

          {/* Keywords */}
          <div className="form-group">
            <label>
              Keywords <span>*</span>
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              required
            />
          </div>

          {/* Co-authors */}
          <div className="form-group">
            <label>Co-authors (optional)</label>
            <textarea
              rows="4"
              value={formData.coAuthors}
              onChange={(e) =>
                setFormData({ ...formData, coAuthors: e.target.value })
              }
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>
              Upload Files <span>*</span>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx,.jpg,.png"
            />
            {files.length > 0 && (
              <div className="selected-files">
                {files.map((file, i) => (
                  <p key={i}>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, true)}
            >
              <Save size={18} /> Save Draft
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, false)}
            >
              <Send size={18} /> Submit
            </button>
          </div>
        </form>

        {/* My Proposals */}
        <div className="my-proposals">
          <h3>My Proposals</h3>
          {myProposals.length === 0 ? (
            <p>No proposals submitted yet.</p>
          ) : (
            <ul>
              {myProposals.map((p) => (
                <li key={p._id || p.id}>
                  <strong>{p.title}</strong> — {p.type} — Status: {p.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
