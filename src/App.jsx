import { useState, useCallback, useEffect } from "react";
import ThemeToggle from "./components/ThemeToggle";
import Logo from "./components/Logo";
import Icon from "./components/Icon";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Collection from "./pages/Collection";
import Settings from "./pages/Settings";
import { api } from "./services/api";
import { initials } from "./utils/format";
import "./css/app.css";
import "./css/theme.css";
const currentYear = new Date().getFullYear();
const navigation = [
  ["dashboard", "Resumen", "grid"],
  ["properties", "Propiedades", "home"],
  ["contacts", "Contactos", "users"],
  ["deals", "Oportunidades", "chart"],
  ["tasks", "Tareas y agenda", "check"],
];
export default function App() {
  const [session, setSession] = useState(() => {
      try {
        return JSON.parse(sessionStorage.getItem("aurelia-session"));
      } catch {
        return null;
      }
    }),
    [page, setPage] = useState("dashboard"),
    [view, setView] = useState("landing"),
    [search, setSearch] = useState(""),
    [mobile, setMobile] = useState(false);
  const logout = useCallback(() => {
    sessionStorage.removeItem("aurelia-session");
    setSession(null);
    setView("login");
  }, []);
  function login(s) {
    sessionStorage.setItem("aurelia-session", JSON.stringify(s));
    setSession(s);
    setPage("dashboard");
  }
  function update(user) {
    const s = { ...session, user };
    setSession(s);
    sessionStorage.setItem("aurelia-session", JSON.stringify(s));
  }
  useEffect(() => {
    if (!session?.token) return;
    api("/auth/me", { token: session.token }).catch((e) => {
      if (e.status === 401) logout();
    });
  }, [session?.token, logout]);
  function navigate(p) {
    setPage(p);
    setSearch("");
    setMobile(false);
  }
  if (!session)
    return view === "landing" ? (
      <Landing onEnter={() => setView("login")} />
    ) : (
      <Login onLogin={login} onBack={() => setView("landing")} />
    );
  return (
    <div className="workspace">
      <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
        <Logo />
        <p className="sidebar-label">TU ESPACIO DE TRABAJO</p>
        <nav>
          {navigation.map(([id, label, icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon name={icon} />
              {label}
              {page === id && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">CONEXIONES CON PROPÓSITO</span>
          <h3>
            Personas. Lugares.
            <br />
            Posibilidades.
          </h3>
          <p>
            Cada gran hogar comienza
            <br />
            con una gran relación.
          </p>
          <span className="note-mark">A</span>
        </div>
        <nav className="sidebar-bottom">
          <button
            className={page === "settings" ? "active" : ""}
            onClick={() => navigate("settings")}
          >
            <Icon name="settings" />
            Configuración
          </button>
          <button onClick={logout}>
            <Icon name="logout" />
            Cerrar sesión
          </button>
        </nav>
        <div className="sidebar-footer">
          AURELIA ESTATES & CO.<span>ESPACIO PRIVADO DE CLIENTES</span>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMobile(!mobile)}
            aria-label="Alternar navegación"
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumbs">
            Mi espacio <span>/</span>
            <strong>
              {navigation.find((n) => n[0] === page)?.[1] || "Configuración"}
            </strong>
          </div>
          <div className="topbar-right">
            <ThemeToggle />
            <div className="search-box">
              <Icon name="search" size={17} />
              <input
                aria-label="Buscar registros actuales"
                placeholder="Buscar en tu espacio…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (page === "dashboard") setPage("properties");
                }}
              />
              <kbd>⌕</kbd>
            </div>
            <button
              className="icon-button notification-button"
              onClick={() => navigate("tasks")}
              aria-label="Abrir agenda"
            >
              <Icon name="bell" />
              <i />
            </button>
            <button
              className="profile-button"
              onClick={() => navigate("settings")}
            >
              <span className="avatar">{initials(session.user.name)}</span>
              <span>
                <strong>{session.user.name}</strong>
                <small>Asesor inmobiliario</small>
              </span>
            </button>
          </div>
        </header>
        <main className="content">
          {page === "dashboard" ? (
            <Dashboard
              token={session.token}
              user={session.user}
              onNavigate={navigate}
              onExpired={logout}
            />
          ) : page === "settings" ? (
            <Settings
              token={session.token}
              user={session.user}
              onUpdate={update}
            />
          ) : (
            <Collection
              key={page}
              resource={page}
              token={session.token}
              onExpired={logout}
              search={search}
            />
          )}
          <footer className="workspace-footer">
            <span>Conexiones con propósito. La esencia de Aurelia.</span>
            <span>© {currentYear} Aurelia Estates & Co.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
