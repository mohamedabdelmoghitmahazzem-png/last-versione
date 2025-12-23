import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";



export default function LoginPage() {
  return (
    <div className="login-container">

      <div className="neon-lines">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="neon-line" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      <div className="floor-glow"></div>

      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input type="text" className="input-field" />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" className="input-field" />
        </div>

        <div className="options">
          <label><input type="checkbox" /> Remember me</label>
          <span className="register-text">Forgot password?</span>
        </div>

        <button className="login-btn">Login</button>

        <p className="register-link">
          Don't have an account? <Link to="/signup" className="register-text">Register</Link>
        </p>
      </div>
    </div>
  );
}