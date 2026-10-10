import { useEffect, useState } from "react";
import { api } from "../services/api";
import { date, money } from "../utils/format";
import { dateTimeInput } from "../utils/commercial";
import { label } from "../utils/labels";
export default function ContactHistory({ contact, token, onClose }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [kind, setKind] = useState("Note"),
    [body, setBody] = useState(""),
    [occurredAt, setOccurredAt] = useState(() => dateTimeInput());
  useEffect(() => {
    let live = true;
    api(`/contacts/${contact._id}/history`, { token })
      .then((d) => {
        if (live) setData(d);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [contact._id, token]);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api(`/contacts/${contact._id}/history`, {
        token,
        method: "POST",
        body: { kind, body, occurredAt: new Date(occurredAt).toISOString() },
      });
      setBody("");
      setData(await api(`/contacts/${contact._id}/history`, { token }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="modal-overlay">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Historial de ${contact.name}`}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">RELACIONES CON CONTEXTO</p>
            <h2>{contact.name}</h2>
            <p>
              {contact.email} · {contact.phone}
            </p>
          </div>
          <button className="btn outline" onClick={onClose}>
            Cerrar
          </button>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form className="commercial-form" onSubmit={submit}>
          <h3>Registrar seguimiento</h3>
          <label>
            Tipo
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="Note">Nota</option>
              <option value="Call">Llamada</option>
              <option value="Visit">Visita</option>
            </select>
          </label>
          <label>
            Fecha y hora
            <input
              type="datetime-local"
              required
              value={occurredAt}
              max={dateTimeInput()}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </label>
          <label>
            Detalle
            <textarea
              required
              minLength={2}
              maxLength={5000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <button className="btn dark" disabled={saving}>
            {saving ? "Guardando…" : "Guardar actividad"}
          </button>
        </form>
        {!data ? (
          <p>Cargando historial…</p>
        ) : (
          <>
            <h3>Historial</h3>
            {!data.interactions.length && (
              <p className="muted">Aún no hay actividades registradas.</p>
            )}
            {data.interactions.map((i) => (
              <article className="timeline-entry" key={i._id}>
                <strong>
                  {{ Note: "Nota", Call: "Llamada", Visit: "Visita" }[i.kind]}
                </strong>
                <small>{new Date(i.occurredAt).toLocaleString("es-MX")}</small>
                <p>{i.body}</p>
              </article>
            ))}
            <h3>Pendientes y agenda</h3>
            {!data.tasks.length && (
              <p className="muted">
                Sin tareas vinculadas. Puedes vincularlas desde Tareas y agenda.
              </p>
            )}
            {data.tasks.map((t) => (
              <p key={t._id}>
                <strong>{t.title}</strong> · {date(t.dueDate)} ·{" "}
                {label(t.status)}
              </p>
            ))}
            <h3>Oportunidades vinculadas</h3>
            {data.deals.map((d) => (
              <p key={d._id}>
                {d.title} · {label(d.stage)} · {money(d.value)}
              </p>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
