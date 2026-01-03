// src/pages/Participant.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./participant.css";

// رابط الـ backend مباشرة (أو استورد من config.js لو عندك)
const API_BASE_URL = "https://v-nement-scientifique.onrender.com/api";

// إضافة interceptor مرة واحدة فقط في أعلى الملف
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Icônes بسيطة
const CalendarIcon = () => <span className="icon">📅</span>;
const LocationIcon = () => <span className="icon">📍</span>;
const BellIcon = () => <span className="icon">🔔</span>;
const MessageIcon = () => <span className="icon">✉️</span>;
const LogoutIcon = () => <span className="icon">🚪</span>;
const DownloadIcon = () => <span className="icon">⬇️</span>;
const CheckIcon = () => <span className="icon">✓</span>;

const Participant = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // حماية الصفحة: لو مفيش token → اذهب للـ login فورًا
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // جلب بيانات المستخدم + الأحداث + الإشعارات
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الملف الشخصي (الـ interceptor يضيف الـ token تلقائيًا)
        const profileRes = await axios.get(`${API_BASE_URL}/auth/profile`);
        setUser(profileRes.data.user || profileRes.data); // حسب شكل الـ response

        // بيانات ثابتة مؤقتًا (احذفها لما تضيف الـ API الحقيقية)
        setEvents([
          {
            id: 1,
            title: "Congrès National de Santé Numérique 2026",
            date: "15-17 Janvier 2026",
            location: "Constantine, Algérie",
            status: "futur",
            attestationAvailable: false,
          },
          {
            id: 2,
            title: "Workshop Intelligence Artificielle et Imagerie Médicale",
            date: "10-12 Décembre 2025",
            location: "En ligne",
            status: "termine",
            attestationAvailable: true,
          },
          {
            id: 3,
            title: "Journée Scientifique sur l'IA en Médecine",
            date: "20 Janvier 2026",
            location: "Alger",
            status: "futur",
            attestationAvailable: false,
          },
        ]);

        setNotifications([
          "Votre attestation pour le workshop du 10-12 Déc. est disponible",
          "Le programme du congrès de janvier 2026 a été mis à jour",
          "Bienvenue dans votre espace participant !",
        ]);

      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
        setError("Erreur lors du chargement des données");

        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expirée ou accès refusé. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // دالة الخروج
  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  // اسم المستخدم الكامل
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Utilisateur";
  const firstName = fullName.split(" ")[0] || "Cher participant";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Chargement en cours...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">SciHealth Events</h1>
          <nav className="flex items-center gap-6">
            <Link to="/evenements" className="hover:text-blue-600">
              Mes événements
            </Link>
            <a href="#" className="relative hover:text-blue-600">
              <BellIcon />
              Notifications
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </a>
            <Link to="/messages" className="hover:text-blue-600">
              <MessageIcon /> Messages
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{fullName}</p>
                <p className="text-sm text-gray-600">{user?.institution || "Institution non spécifiée"}</p>
              </div>
              <div className="avatar bg-blue-600 text-white">
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn hover:text-red-600" title="Déconnexion">
              <LogoutIcon />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="welcome mb-8">
          <h2 className="text-3xl font-bold mb-2">Bonjour, {firstName} 👋</h2>
          <p className="text-lg text-gray-700">Voici un aperçu de vos événements scientifiques</p>
        </div>

        {/* Événement en cours */}
        <div className="current-event placeholder bg-blue-50 p-8 rounded-lg text-center mb-10">
          <h3 className="text-2xl font-semibold mb-4">Aucun événement en cours aujourd'hui</h3>
          <p className="text-gray-700 mb-6">Accédez à un événement live dès qu'il commence.</p>
          <Link to="/live-event" className="btn-live inline-block">
            Accéder à l'événement live (exemple)
          </Link>
        </div>

        {/* Mes événements */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Mes événements</h3>
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card bg-white shadow-md rounded-lg p-6">
                <div className="header-card flex justify-between items-start mb-4">
                  <span className={`status-badge status-${event.status}`}>
                    {event.status === "futur" ? "À venir" : "Terminé"}
                  </span>
                  {event.attestationAvailable && <CheckIcon />}
                </div>

                <h4 className="text-xl font-semibold mb-4">{event.title}</h4>
                <div className="details text-gray-600 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon /> {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon /> {event.location}
                  </div>
                </div>

                <div className="actions flex gap-3">
                  <Link to={`/event/${event.id}`} className="btn-live flex-1 text-center">
                    Accéder à l'événement
                  </Link>
                  {event.attestationAvailable && (
                    <button className="btn-download flex items-center justify-center gap-2">
                      <DownloadIcon /> Attestation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Notifications récentes</h3>
          <div className="notifications space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="notif-item bg-white shadow rounded-lg p-4 flex items-start gap-4">
                <BellIcon />
                <p className="text-gray-800">{notif}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Participant;