import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import "./AuthorOverview.css";
import { getMyProposals } from "../api/index"
export default function AuthorOverview() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's proposals on mount
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await getMyProposals();
        setProposals(res.data); // assumes backend returns array of proposals
      } catch (err) {
        console.error(err);
        alert("Failed to load your proposals!");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  if (loading) return <p>Loading proposals...</p>;

  // Calculate stats
  const totalSubmitted = proposals.length;
  const accepted = proposals.filter(p => p.status === "accepted").length;
  const pending = proposals.filter(p => p.status === "under review").length;
  const acceptanceRate = totalSubmitted ? Math.round((accepted / totalSubmitted) * 100) : 0;

  return (
    <div className="author-overview space-y-6">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome, Author!</h2>
        <p>Manage your proposals and stay updated with your submissions.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue-bg">
            <FileText className="blue-text" />
          </div>
          <p className="stat-value">{totalSubmitted}</p>
          <p className="stat-label">Proposals Submitted</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon green-bg">
            <CheckCircle className="green-text" />
          </div>
          <p className="stat-value">{accepted}</p>
          <p className="stat-label">Proposals Accepted</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange-bg">
            <Clock className="orange-text" />
          </div>
          <p className="stat-value">{pending}</p>
          <p className="stat-label">Pending Review</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple-bg">
            <TrendingUp className="purple-text" />
          </div>
          <p className="stat-value">{acceptanceRate}%</p>
          <p className="stat-label">Acceptance Rate</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="recent-submissions">
        <h3>Your Recent Submissions</h3>
        {proposals.length === 0 ? (
          <p>No proposals submitted yet.</p>
        ) : (
          proposals
            .slice(-5)
            .reverse()
            .map((p) => (
              <div key={p._id} className="submission-item">
                <h4>{p.title}</h4>
                <p>
                  Type: {p.type} • Status:{" "}
                  <span className={`status-${p.status.replace(" ", "-")}`}>
                    {p.status}
                  </span> • Date: {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
