import { useEffect, useState } from "react";
import { api } from "../services/api";
import { date } from "../utils/format";
export default function Followups({ token, onNavigate }) {
  const [sales, setSales] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    api("/dashboard", { token })
      .then((d) => {
        if (live) setSales(d.sales);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [token]);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">NO DEJES UNA RELACIÓN EN PAUSA</p>
          <h1>Seguimiento comercial</h1>
          <p className="muted">
            Recordatorios dentro del CRM. No se envían correos ni mensajes
            automáticos.
          </p>
        </div>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!sales && !error ? (
        <p>Cargando seguimiento…</p>
      ) : (
        sales && (
          <div className="public-columns">
            <section className="panel">
              <h2>Oportunidades sin actividad</h2>
              <p className="muted">
                Más de {sales.staleDays} días sin cambios o seguimiento
                registrado.
              </p>
              {!sales.staleDeals.length && <p>Todo al día.</p>}
              {sales.staleDeals.map((d) => (
                <article className="timeline-entry" key={d._id}>
                  <strong>{d.title}</strong>
                  <p>Última actividad: {date(d.lastActivityAt)}</p>
                  <div className="commercial-actions">
                    <button
                      className="text-button"
                      onClick={() => onNavigate("deals", d._id)}
                    >
                      Abrir oportunidad ↗
                    </button>
                    {d.contactId && (
                      <button
                        className="text-button"
                        onClick={() => onNavigate("contacts", d.contactId)}
                      >
                        Abrir cliente ↗
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
            <section className="panel">
              <h2>Tareas vencidas</h2>
              {!sales.overdueTasks.length && <p>No hay tareas vencidas.</p>}
              {sales.overdueTasks.map((t) => (
                <article className="timeline-entry" key={t._id}>
                  <strong>{t.title}</strong>
                  <p>Vencimiento: {date(t.dueDate)}</p>
                  <button
                    className="text-button"
                    onClick={() => onNavigate("tasks", t._id)}
                  >
                    Abrir tarea ↗
                  </button>
                </article>
              ))}
            </section>
          </div>
        )
      )}
    </>
  );
}
