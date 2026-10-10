import { label as enumLabel, resourceLabel } from "../utils/labels";
import { useState } from "react";
import Icon from "./Icon";
const fields = {
  contacts: [
    ["name", "Nombre completo"],
    ["email", "Correo electrónico", "email"],
    ["phone", "Teléfono"],
    ["company", "Empresa"],
    ["type", "Tipo", ["Buyer", "Seller", "Investor", "Partner"]],
    ["status", "Estado", ["New", "Active", "Qualified", "Inactive"]],
    ["budget", "Presupuesto", "number"],
    ["notes", "Notas", "textarea"],
  ],
  properties: [
    ["title", "Título de la propiedad"],
    ["address", "Dirección"],
    ["city", "Ciudad"],
    [
      "type",
      "Tipo de propiedad",
      ["Villa", "Apartment", "Penthouse", "House", "Commercial", "Land"],
    ],
    ["status", "Estado", ["Available", "Under offer", "Sold", "Rented"]],
    ["price", "Precio de venta", "number"],
    ["bedrooms", "Habitaciones", "number"],
    ["bathrooms", "Baños", "number"],
    ["area", "Superficie (m²)", "number"],
    ["description", "Descripción", "textarea"],
    ["featured", "Propiedad destacada", "checkbox"],
  ],
  deals: [
    ["title", "Título de la oportunidad"],
    ["contactName", "Cliente"],
    ["propertyTitle", "Propiedad"],
    ["value", "Valor de la oportunidad", "number"],
    [
      "stage",
      "Etapa",
      ["Lead", "Qualified", "Viewing", "Negotiation", "Won", "Lost"],
    ],
    ["probability", "Probabilidad (%)", "number"],
    ["expectedClose", "Cierre previsto", "date"],
    ["notes", "Notas", "textarea"],
  ],
  tasks: [
    ["title", "Título de la tarea"],
    ["description", "Descripción", "textarea"],
    ["dueDate", "Fecha de vencimiento", "date"],
    ["priority", "Prioridad", ["Low", "Medium", "High"]],
    ["status", "Estado", ["Pending", "In progress", "Completed"]],
    ["relatedTo", "Cliente o propiedad relacionada"],
  ],
};
export default function RecordForm({ resource, record, onSave, onClose }) {
  const [data, setData] = useState(() =>
      Object.fromEntries(
        fields[resource]
          .map(([key, , type]) => [
            key,
            record?.[key] ??
              (Array.isArray(type)
                ? type[0]
                : type === "number"
                  ? 0
                  : type === "checkbox"
                    ? false
                    : ""),
          ])
          .map(([k, v]) => [
            k,
            k === "dueDate" || k === "expectedClose"
              ? v?.slice(0, 10) || ""
              : v,
          ]),
      ),
    ),
    [files, setFiles] = useState([]),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(data, files);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={record ? "Editar registro" : "Nuevo registro"}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
            <h2>
              {record ? "Editar" : "Crear"}{" "}
              {resourceLabel(resource, true)}
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar diálogo"
          >
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            {fields[resource].map(([key, label, type]) => (
              <label
                key={key}
                className={type === "textarea" ? "span-two" : ""}
              >
                {label}
                {Array.isArray(type) ? (
                  <select
                    value={data[key]}
                    onChange={(e) =>
                      setData({ ...data, [key]: e.target.value })
                    }
                  >
                    {type.map((x) => (
                      <option key={x} value={x}>{enumLabel(x)}</option>
                    ))}
                  </select>
                ) : type === "textarea" ? (
                  <textarea
                    value={data[key]}
                    rows={3}
                    onChange={(e) =>
                      setData({ ...data, [key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={type || "text"}
                    value={type === "checkbox" ? undefined : data[key]}
                    checked={type === "checkbox" ? data[key] : undefined}
                    required={["name", "email", "title", "dueDate"].includes(
                      key,
                    )}
                    min={type === "number" ? 0 : undefined}
                    max={key === "probability" ? 100 : undefined}
                    onChange={(e) =>
                      setData({
                        ...data,
                        [key]:
                          type === "checkbox"
                            ? e.target.checked
                            : type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                      })
                    }
                  />
                )}
              </label>
            ))}
            {resource === "properties" && (
              <label className="span-two">
                Fotografías de la propiedad (hasta 6, 8 MB cada una)
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFiles([...e.target.files])}
                />
                <small>
                  Las imágenes se validan y convierten a WebP optimizado.
                </small>
              </label>
            )}
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button className="btn dark" disabled={saving}>
              {saving
                ? "Guardando…"
                : "Guardar " +
                  resourceLabel(resource, true)}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
