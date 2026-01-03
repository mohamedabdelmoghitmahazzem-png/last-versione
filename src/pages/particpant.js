import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./participant.css";

const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CalendarIcon = () => <span className="icon">📅</span>;
const LocationIcon = () => <span className="icon">📍</span>;
const BellIcon = () => <span className="icon">🔔</span>;
const MessageIcon = () => <span className="icon">✉️</span>;
const QuestionIcon = () => <span className="icon">❓</span>;
const PollIcon = () => <span className="icon">📊</span>;
const CertificateIcon = () => <span className="icon">🏆</span>;
const LogoutIcon = () => <span className="icon">🚪</span>;

const Participant = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await axios.get(`${API_BASE_URL}/auth/profile`);
        setUser(profileRes.data.user || profileRes.data);

        // Fetch registered events
        try {
          const regRes = await axios.get(`${API_BASE_URL}/registrations/my-registrations`);
          let registeredEvents = [];

          if (Array.isArray(regRes.data)) {
            registeredEvents = regRes.data;
          } else if (regRes.data.registrations) {
            registeredEvents = regRes.data.registrations.map(r => r.event || r);
          } else if (regRes.data.data?.registrations) {
            registeredEvents = regRes.data.data.registrations.map(r => r.event || r);
          }

          setEvents(registeredEvents);
        } catch (err) {
          console.warn("No registered events");
          setEvents([]);
        }

      } catch (err) {
        console.error("Error loading data:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Participant";
  const firstName = fullName.split(" ")[0] || "Participant";

  // Safe location rendering (handles object or string)
  const renderLocation = (location) => {
    if (!location) return "Location not set";
    if (typeof location === "string") return location;
    if (typeof location === "object") {
      const parts = [];
      if (location.venue) parts.push(location.venue);
      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.country) parts.push(location.country);
      return parts.filter(Boolean).join(", ") || "Location not set";
    }
    return "Location not set";
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="participant-dashboard">
      <header className="header">
        <div className="container">
          <h1>SciHealth Events</h1>
          <nav>
            <Link to="/evenements">Browse Events</Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogoutIcon /> Logout
            </button>
            <div className="user-info">
              <p>{fullName}</p>
              <p>{user?.institution || "No institution specified"}</p>
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        <h2>Welcome back, {firstName}!</h2>

        <section>
          <h3>My Registered Events</h3>
          {events.length === 0 ? (
            <div className="empty-state">
              <p>You are not registered for any event yet.</p>
              <Link to="/evenements" className="btn-primary">
                Browse Events and Register
              </Link>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <h4>{event.title || "Untitled Event"}</h4>
                  <p>
                    <CalendarIcon />{" "}
                    {event.date ? new Date(event.date).toLocaleDateString() : "Date not set"}
                  </p>
                  <p>
                    <LocationIcon /> {renderLocation(event.location)}
                  </p>

                  <div className="actions">
                    <Link to={`/event/${event._id}`} className="btn">
                      Attend Sessions
                    </Link>
                    <Link to={`/event/${event._id}/qa`} className="btn">
                      <QuestionIcon /> Ask Questions
                    </Link>
                    <Link to={`/event/${event._id}/polls`} className="btn">
                      <PollIcon /> Answer Polls
                    </Link>
                    {event.certificateGenerated && (
                      <button className="btn">
                        <CertificateIcon /> Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Participant;