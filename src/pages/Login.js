import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";

// رابط الـ backend
const API_URL = "https://v-nement-scientifique.onrender.com/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      // طباعة الرد الكامل في الكونسول للتشخيص (مهم جدًا!)
      console.log("✅ رد السيرفر كامل بعد الـ login:", response.data);

      // محاولة استخراج الـ token بأي اسم محتمل
      let token =
        response.data.token ||
        response.data.accessToken ||
        response.data.jwt ||
        response.data.access_token ||
        response.data.authToken ||
        response.data.sessionToken ||
        response.data.data?.token ||
        response.data.user?.token ||
        response.data.result?.token;

      if (!token) {
        // إذا ما لقيناش الـ token، نعطي رسالة واضحة
        throw new Error(
          "لم يتم العثور على رمز الدخول (token) في رد السيرفر.\n" +
            "تحقق من console.log أعلاه لرؤية شكل الـ response الدقيق."
        );
      }

      // حفظ الـ token في localStorage
      localStorage.setItem("token", token);

      alert("Connexion réussie ! مرحبا بك 👋");
      window.location.href = "/participant"; // redirect إلى داشبورد المشارك

    } catch (err) {
      console.error("❌ خطأ في تسجيل الدخول:", err);

      let errorMsg = "Email ou mot de passe incorrect";

      // إذا السيرفر أرجع رسالة خطأ واضحة
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      alert("خطأ في تسجيل الدخول:\n" + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={loading}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" disabled={loading} /> Se souvenir de moi
            </label>
            <span className="register-text">Mot de passe oublié ?</span>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="register-link">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="register-text">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}