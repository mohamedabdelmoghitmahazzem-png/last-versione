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

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/myevent" element={<MyEvent />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/participant" element={<Participant />} />  {/* Maintenant ça marche ! */}
        <Route path="/organizer" element={<Organizer />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;