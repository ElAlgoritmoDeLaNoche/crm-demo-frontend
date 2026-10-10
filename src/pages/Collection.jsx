import { label, resourceLabel } from "../utils/labels";
import { useState } from "react";
import { useCollection } from "../hooks/useCollection";
import { api, mediaUrl } from "../services/api";
import { money, date, initials, compact } from "../utils/format";
import Icon from "../components/Icon";
import RecordForm from "../components/RecordForm";
export default function Collection({
  resource,
  token,
  onExpired,
  search = "",
}) {
  const { records, loading, error, reload } = useCollection(
    resource,
    token,
    onExpired,
  );
  const [modal, setModal] = useState(null),
    [filter, setFilter] = useState("All"),
    [mutationError, setMutationError] = useState(""),
    [selected, setSelected] = useState(null);
  const stages = ["Lead", "Qualified", "Viewing", "Negotiation", "Won", "Lost"];
  const statuses =
    resource === "deals"
      ? stages
      : resource === "properties"
        ? ["Available", "Under offer", "Sold", "Rented"]
        : resource === "contacts"
          ? ["New", "Active", "Qualified", "Inactive"]
          : ["Pending", "In progress", "Completed"];
  const visible = records.filter(
    (r) =>
      (filter === "All" || (r.stage || r.status) === filter) &&
      [JSON.stringify(r), label(r.status), label(r.stage), label(r.type), label(r.priority)].join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  async function save(body, files) {
    const r = await api("/" + resource + (modal ? "/" + modal._id : ""), {
      token,
      method: modal ? "PATCH" : "POST",
      body,
    });
    if (files.length) {
      const data = new FormData();
      files.forEach((f) => data.append("images", f));
      try {
        await api(`/properties/${r._id}/images`, {
          token,
          method: "POST",
          body: data,
        });
      } catch (e) {
        await reload();
        setModal(r);
        throw new Error("Registro guardado, pero falló la carga de imágenes: " + e.message);
      }
    }
    await reload();
  }
  async function remove(r) {
    if (!window.confirm(`¿Eliminar ${r.title || r.name}? Esta acción no se puede deshacer.`))
      return;
    try {
      await api(`/${resource}/${r._id}`, { token, method: "DELETE" });
      setSelected(null);
      await reload();
    } catch (e) {
      setMutationError(e.message);
    }
  }
  async function stage(r, value) {
    try {
      await api(`/deals/${r._id}`, {
        token,
        method: "PATCH",
        body: { stage: value },
      });
      await reload();
    } catch (e) {
      setMutationError(e.message);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TU NEGOCIO, SIEMPRE CONECTADO</p>
          <h1>
            {resource === "deals"
              ? "Oportunidades"
              : resourceLabel(resource)}
          </h1>
          <p className="muted">
            {resource === "properties"
              ? "Espacios extraordinarios. Cada detalle en un solo lugar."
              : resource === "contacts"
                ? "Las grandes relaciones son la base de todo."
                : resource === "deals"
                  ? "Convierte conversaciones valiosas en resultados excepcionales."
                  : "Claridad para todo lo que viene."}
          </p>
        </div>
        <button className="btn dark" onClick={() => setModal(false)}>
          <Icon name="plus" size={17} />
          Agregar {resourceLabel(resource, true)}
        </button>
      </div>
      <div className="collection-toolbar">
        <div className="filter-pills">
          {["All", ...statuses].map((s) => (
            <button
              key={label(s)}
              className={filter === s ? "active" : ""}
              onClick={() => setFilter(s)}
            >
              {label(s)}
            </button>
          ))}
        </div>
        <span className="muted">{visible.length} registros</span>
      </div>
      {(error || mutationError) && (
        <div className="error" role="alert">
          {error || mutationError}
          <button onClick={reload}>Reintentar</button>
        </div>
      )}
      {loading ? (
        <div className="loading">Cargando {resourceLabel(resource).toLowerCase()}…</div>
      ) : !visible.length ? (
        <div className="empty">
          <Icon name="home" size={36} />
          <h3>No se encontraron {resourceLabel(resource).toLowerCase()}</h3>
          <p>Prueba otro filtro o crea tu primer registro.</p>
        </div>
      ) : resource === "properties" ? (
        <div className="property-grid">
          {visible.map((r) => (
            <article key={r._id} className="property-card">
              <button className="property-image" onClick={() => setSelected(r)}>
                <img
                  src={
                    mediaUrl(r.images?.[0]) ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={r.title}
                />
                <span className="badge floating">{label(r.status)}</span>
                <span className="image-count">
                  {r.images?.length || 0} fotos
                </span>
              </button>
              <div className="property-body">
                <div className="property-price">
                  {money(r.price)}
                  <span>{label(r.type)}</span>
                </div>
                <h3>{r.title}</h3>
                <p className="location">
                  <Icon name="pin" size={14} />
                  {r.city || r.address || "Ubicación sin especificar"}
                </p>
                <div className="property-specs">
                  <span>{r.bedrooms} habitaciones</span>
                  <span>{r.bathrooms} baños</span>
                  <span>{r.area} m²</span>
                </div>
                <div className="card-actions">
                  <button onClick={() => setSelected(r)}>Ver detalles ↗</button>
                  <button onClick={() => setModal(r)}>Editar</button>
                  <button onClick={() => remove(r)}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : resource === "deals" ? (
        <div className="pipeline">
          {stages.map((s) => (
            <section key={label(s)} className="pipeline-column">
              <header>
                <span className={"stage-dot " + s.toLowerCase()} />
                <h3>{label(s)}</h3>
                <span>{visible.filter((r) => r.stage === s).length}</span>
              </header>
              <p className="pipeline-total">
                {compact(
                  visible
                    .filter((r) => r.stage === s)
                    .reduce((sum, r) => sum + r.value, 0),
                )}
              </p>
              {visible
                .filter((r) => r.stage === s)
                .map((r) => (
                  <article className="deal-card" key={r._id}>
                    <p className="eyebrow">
                      {r.propertyTitle || "NEW OPPORTUNITY"}
                    </p>
                    <h4>{r.title}</h4>
                    <strong>{money(r.value)}</strong>
                    <div className="client-line">
                      <span className="avatar small">
                        {initials(r.contactName)}
                      </span>
                      {r.contactName || "Unassigned client"}
                    </div>
                    <p className="muted">
                      Close {date(r.expectedClose)} · {r.probability}%
                      confidence
                    </p>
                    <select
                      aria-label={`Etapa de ${r.title}`}
                      value={r.stage}
                      onChange={(e) => stage(r, e.target.value)}
                    >
                      {stages.map((x) => (
                        <option key={x} value={x}>{label(x)}</option>
                      ))}
                    </select>
                    <div className="card-actions">
                      <button onClick={() => setModal(r)}>Editar</button>
                      <button onClick={() => remove(r)}>Eliminar</button>
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {(resource === "contacts"
                  ? ["Cliente", "Tipo", "Estado", "Presupuesto", "Teléfono", "Acciones"]
                  : [
                      "Tarea",
                      "Relacionado con",
                      "Prioridad",
                      "Estado",
                      "Fecha de vencimiento",
                      "Acciones",
                    ]
                ).map((x) => (
                  <th key={label(x)}>{label(x)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r._id}>
                  {resource === "contacts" ? (
                    <>
                      <td>
                        <div className="client-line">
                          <span className="avatar">{initials(r.name)}</span>
                          <div>
                            <strong>{r.name}</strong>
                            <small>{r.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{label(r.type)}</td>
                      <td>
                        <span className="badge">{label(r.status)}</span>
                      </td>
                      <td>{money(r.budget)}</td>
                      <td>{r.phone || "—"}</td>
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{r.title}</strong>
                        <small>{r.description}</small>
                      </td>
                      <td>{r.relatedTo || "—"}</td>
                      <td>
                        <span
                          className={
                            "badge " + (r.priority === "High" ? "gold" : "")
                          }
                        >
                          {label(r.priority)}
                        </span>
                      </td>
                      <td>
                        <span className="badge">{label(r.status)}</span>
                      </td>
                      <td>{date(r.dueDate)}</td>
                    </>
                  )}
                  <td>
                    <div className="card-actions">
                      <button onClick={() => setModal(r)}>Editar</button>
                      <button onClick={() => remove(r)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal !== null && (
        <RecordForm
          key={modal ? modal._id : "new"}
          resource={resource}
          record={modal || null}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
      {selected && (
        <div className="modal-overlay">
          <section className="modal detail">
            <div className="modal-header">
              <h2>{selected.title}</h2>
              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                aria-label="Cerrar detalles"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="detail-gallery">
              {selected.images?.map((img) => (
                <div key={img}>
                  <img src={mediaUrl(img)} alt={selected.title} />
                  <button
                    className="text-button"
                    onClick={async () => {
                      try {
                        const result = await api(
                          `/properties/${selected._id}/images`,
                          { token, method: "DELETE", body: { image: img } },
                        );
                        setSelected(result);
                        await reload();
                      } catch (e) {
                        setMutationError(e.message);
                      }
                    }}
                  >
                    Eliminar imagen
                  </button>
                </div>
              ))}
            </div>
            <h3>{money(selected.price)}</h3>
            <p>
              {selected.address}, {selected.city}
            </p>
            <p>{selected.description || "Sin descripción."}</p>
            <p>
              {selected.bedrooms} habitaciones · {selected.bathrooms} baños ·{" "}
              {selected.area} m²
            </p>
            <button
              className="btn dark"
              onClick={() => {
                setModal(selected);
                setSelected(null);
              }}
            >
              Editar propiedad
            </button>
          </section>
        </div>
      )}
    </>
  );
}
