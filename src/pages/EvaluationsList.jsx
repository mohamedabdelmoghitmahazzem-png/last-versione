import { useEffect, useState } from "react";
import { Star, Download, MessageSquare } from "lucide-react";
import { getAssignedEvaluations } from "../config";
import "./EvaluationsList.css";

export function EvaluationsList() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await getAssignedEvaluations(); // backend: /evaluations/assigned
        setEvaluations(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load evaluations!");
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  if (loading) return <p>Loading evaluations...</p>;
  if (evaluations.length === 0) return <p>No evaluations assigned yet.</p>;

  return (
    <div className="evaluations-list space-y-6">
      {evaluations.map((evaluation) => (
        <div key={evaluation._id} className="evaluation-card">
          <div className="evaluation-header">
            <div className="evaluation-info">
              <h3>{evaluation.title}</h3>
              <span>{evaluation.type}</span> •{" "}
              <span className={`evaluation-status status-${evaluation.status.replace(" ", "-")}`}>
                {evaluation.status}
              </span>
            </div>
            {evaluation.overallScore && (
              <div className="evaluation-score">
                <Star size={20} className="star-icon" />
                <span>{evaluation.overallScore}/5</span>
              </div>
            )}
          </div>

          {/* Reviews */}
          {evaluation.reviews.length > 0 ? (
            evaluation.reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <h4>{review.reviewer}</h4>
                <p>Score: {review.score}/5</p>
                <p>Comments: {review.comments}</p>
              </div>
            ))
          ) : (
            <p>Evaluation in progress...</p>
          )}
        </div>
      ))}
    </div>
  );
}
