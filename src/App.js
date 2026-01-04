import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/fotter";        // Attention ici aussi : "fotter" → "footer" ?
import Home from "./pages/home";
import Evenements from "./pages/Evenements";
import MyEvent from "./pages/myevent";
import Signup from "./pages/sign up";             // Attention : espace dans le nom !
import Login from "./pages/Login";  
import Participant from "./pages/particpant";  
import Organizer from "./pages/Organizer";   // ← CORRIGÉ !
import Cs from "./pages/cs";
import DashboardContent from "./pages/DashboardContent";
import Event from "./pages/event";                         // → Event.jsx (حرف E كبير)
import EvaluationForm from "./pages/EvaluationForm"; 
import Superadmin from './pages/Superadmin';
import WorkshopDetailedPage from './pages/WorkshopDetailedPage';

function App() {
  return (
    <Router>
      {/* Navbar في الأعلى */}
      <Navbar />

      {/* جميع المسارات */}
      <Routes>
       

        <Route path="/" element={<Home />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/myevent" element={<MyEvent />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/participant" element={<Participant />} />  {/* Maintenant ça marche ! */}
        <Route path="/organizer" element={<Organizer />} />
      <Route path="/cs" element={<Cs />} />
     <Route path="/evaluation" element={<EvaluationForm />} />
        <Route path="/dashboardContent" element={<DashboardContent />} />
         <Route path="/event" element={<Event />} />
         <Route path="/superadmin" element={<Superadmin />} />
          <Route
          path="/WorkshopDetailedPage"
          element={<WorkshopDetailedPage />}
        />
       <Route
          path="*"
          element={
            <div style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem" }}>
              <h1>404</h1>
              <p>الصفحة غير موجودة 😔</p>
              <a href="/">العودة إلى الصفحة الرئيسية</a>
            </div>
          }
        />
      </Routes>

      {/* Footer في الأسفل */}
      <Footer />
    </Router>
  );
}

export default App;