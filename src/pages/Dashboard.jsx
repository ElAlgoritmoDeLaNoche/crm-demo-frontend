import { label } from "../utils/labels";
import { useState, useEffect } from "react";
import { api, mediaUrl } from "../services/api";
import { compact, date } from "../utils/format";
import Icon from "../components/Icon";
const today = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  month: "short",
  day: "numeric",
});
export default function Dashboard({ token, user, onNavigate, onExpired }) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    api("/dashboard", { token })
      .then((d) => {
        if (live) setData(d);
      })
      .catch((e) => {
        if (live) setError(e.message);
        if (e.status === 401) onExpired();
      });
    return () => {
      live = false;
    };
  }, [token, onExpired]);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">UNA MIRADA GLOBAL, MUCHAS POSIBILIDADES</p>
          <h1>
            Bienvenido, {user.name.split(" ")[0]}
            <span className="gold-text">.</span>
          </h1>
          <p className="muted">
            Esto está pasando en tu mundo inmobiliario.
          </p>
        </div>
        <div className="date-chip">{today}</div>
      </div>
      {error ? (
        <div className="error">{error}</div>
      ) : !data ? (
        <div className="loading">Preparando tu resumen…</div>
      ) : (
        <>
          <div className="stats-grid">
            {[
              [
                "Valor del portafolio",
                compact(data.portfolioValue),
                "En tu colección de propiedades",
                "home",
              ],
              [
                "Oportunidades activas",
                compact(data.pipelineValue),
                "Negociaciones en curso",
                "chart",
              ],
              [
                "Relaciones con clientes",
                data.contacts,
                "Personas detrás de cada oportunidad",
                "users",
              ],
              [
                "Propiedades",
                data.properties,
                "Lugares excepcionales para vivir",
                "grid",
              ],
            ].map(([title, value, caption, icon]) => (
              <article className="stat-card" key={title}>
                <div>
                  <span>{title}</span>
                  <Icon name={icon} />
                </div>
                <h2>{value}</h2>
                <p>{caption}</p>
              </article>
            ))}
          </div>
          <div className="dashboard-grid">
            <section className="panel pipeline-overview">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">LA VISIÓN GLOBAL</p>
                  <h2>Tu cartera de oportunidades</h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => onNavigate("deals")}
                >
                  Ver oportunidades ↗
                </button>
              </div>
              <div className="chart">
                {["Lead", "Qualified", "Viewing", "Negotiation", "Won"].map(
                  (stage, i) => {
                    const total = data.deals
                      .filter((d) => d.stage === stage)
                      .reduce((s, d) => s + d.value, 0);
                    const max = Math.max(
                      1,
                      ...[
                        "Lead",
                        "Qualified",
                        "Viewing",
                        "Negotiation",
                        "Won",
                      ].map((s) =>
                        data.deals
                          .filter((d) => d.stage === s)
                          .reduce((n, d) => n + d.value, 0),
                      ),
                    );
                    return (
                      <div className="chart-column" key={label(stage)}>
                        <strong>{compact(total)}</strong>
                        <div className="chart-track">
                          <div
                            className={"chart-bar bar-" + i}
                            style={{
                              height: Math.max(4, (total / max) * 100) + "%",
                            }}
                          />
                        </div>
                        <span>{label(stage)}</span>
                      </div>
                    );
                  },
                )}
              </div>
              <div className="chart-summary">
                <span>
                  <i className="stage-dot" />
                  Valor de oportunidades activas
                </span>
                <strong>{compact(data.pipelineValue)}</strong>
              </div>
            </section>
            <section className="panel agenda">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TIEMPO PARA LO QUE IMPORTA</p>
                  <h2>En tu agenda</h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => onNavigate("tasks")}
                >
                  Ver todas ↗
                </button>
              </div>
              {data.tasks
                .filter((t) => t.status !== "Completed")
                .slice(0, 4)
                .map((t) => (
                  <div className="agenda-item" key={t._id}>
                    <span className="agenda-square" />
                    <div>
                      <strong>{t.title}</strong>
                      <p>
                        {date(t.dueDate)} · {t.relatedTo || "Tu espacio de trabajo"}
                      </p>
                    </div>
                    <span
                      className={
                        "badge " + (t.priority === "High" ? "gold" : "")
                      }
                    >
                      {label(t.priority)}
                    </span>
                  </div>
                ))}
              {!data.tasks.filter((t) => t.status !== "Completed").length && (
                <p className="muted">Todo al día. Crea tu próxima tarea.</p>
              )}
              <button
                className="agenda-link"
                onClick={() => onNavigate("tasks")}
              >
                Gestionar tu agenda <Icon name="arrow" size={16} />
              </button>
            </section>
          </div>
          <div className="section-heading featured-heading">
            <div>
              <p className="eyebrow">LA COLECCIÓN</p>
              <h2>Propiedades destacadas</h2>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("properties")}
            >
              Explorar todas las propiedades <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="spotlight-grid">
            {data.featured.map((p) => (
              <button
                className="spotlight-card"
                key={p._id}
                onClick={() => onNavigate("properties")}
              >
                <img src={mediaUrl(p.images?.[0])} alt={p.title} />
                <span className="badge floating">{label(p.status)}</span>
                <div>
                  <span>{p.city}</span>
                  <h3>{p.title}</h3>
                  <strong>{compact(p.price)}</strong>
                </div>
              </button>
            ))}
          </div>
          <section className="panel activity-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">EL ÚLTIMO CAPÍTULO</p>
                <h2>Actividad reciente</h2>
              </div>
            </div>
            {data.activity.map((a) => (
              <div className="activity-item" key={a._id}>
                <span className="activity-dot" />
                <span>{a.message}</span>
                <small>{date(a.createdAt)}</small>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
}
