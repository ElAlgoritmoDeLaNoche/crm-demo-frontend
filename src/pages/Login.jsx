import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import Logo from "../components/Logo";
import { api } from "../services/api";
export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState("demo@aurelia.estates"),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(
        await api("/auth/login", { method: "POST", body: { email, password } }),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-photo">
        <div>
          <p className="eyebrow">EL ARTE INMOBILIARIO</p>
          <h1>
            Hogares excepcionales.
            <br />
            <em>Personas conectadas.</em>
          </h1>
        </div>
      </div>
      <div className="login-panel">
        <ThemeToggle />
        <Logo />
        <form onSubmit={submit}>
          <p className="eyebrow">BIENVENIDO A TU ESPACIO PRIVADO</p>
          <h2>Un gran día empieza aquí.</h2>
          <p className="muted">
            Ingresa para gestionar las relaciones que importan.
          </p>
          <label>
            Correo electrónico
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="btn dark full" disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar al CRM →"}
          </button>
          <div className="demo-note">
            Ingresa la contraseña de tu cuenta para acceder de forma segura.
          </div>
          <button type="button" className="text-button" onClick={onBack}>
            ← Volver a Aurelia
          </button>
        </form>
      </div>
    </div>
  );
}
