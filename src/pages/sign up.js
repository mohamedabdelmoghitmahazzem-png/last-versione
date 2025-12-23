import React, { useState } from "react";
import "./sign up.css";

export default function Signup() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "Participant",
  });

  const roles = [
    "Participant",
    "Auteur",
    "Organisateur",
    "Comité Scientifique",
    "Invité",
    "Animateur Workshop",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
    alert("Signup Successful!");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Créer un compte</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Votre email"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Créer un mot de passe"
              required
            />
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="signup-btn">
            S'inscrire
          </button>
        </form>

        <div className="signup-login">
          Vous avez déjà un compte ? <a href="/login">Connexion</a>
        </div>
      </div>
    </div>
  );
}
