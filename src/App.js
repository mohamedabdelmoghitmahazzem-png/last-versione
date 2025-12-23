import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/fotter";
import Home from "./pages/home";
import Evenements from "./pages/Evenements";
import MyEvent from "./pages/myevent";
import Signup from "./pages/sign up";
import Login from "./pages/Login";   // ✅ Correct import

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/myevent" element={<MyEvent />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />   // ✅ Correct usage
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
