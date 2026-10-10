import { useState } from "react";
import { api } from "../services/api";
export default function Settings({ token, user, onUpdate }) {
  const [data, setData] = useState({
      name: user.name,
      company: user.company || "",
      phone: user.phone || "",
    }),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await api("/auth/me", {
        token,
        method: "PATCH",
        body: data,
      });
      onUpdate(result);
      setMessage("Tu perfil se actualizó correctamente.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">A TU MEDIDA</p>
          <h1>Configuración del espacio</h1>
          <p className="muted">Tu perfil, tu toque personal.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <h2>Perfil personal</h2>
        <form onSubmit={submit}>
          {["name", "company", "phone"].map((k) => (
            <label key={k}>
              {{ name: "Nombre", company: "Empresa", phone: "Teléfono" }[k]}
              <input
                required={k === "name"}
                value={data[k]}
                onChange={(e) => setData({ ...data, [k]: e.target.value })}
              />
            </label>
          ))}
          <label>
            Correo electrónico
            <input value={user.email} disabled />
          </label>
          <p role="status">{message}</p>
          <button className="btn dark" disabled={busy}>
            {busy ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </section>
      <section className="panel settings-panel">
        <h2>Acerca de este espacio</h2>
        <p>Aurelia Estates · CRM inmobiliario privado</p>
        <p className="muted">
          Todos los importes se muestran en pesos mexicanos (MXN). Las imágenes se guardan en el servidor de la API.
          Tu sesión vence después de ocho horas.
        </p>
      </section>
    </>
  );
}
