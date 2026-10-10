import { useEffect, useState } from "react";
import { api, mediaUrl, publicPdfUrl } from "../services/api";
import { money } from "../utils/format";
import { label } from "../utils/labels";
import { propertyShareUrl } from "../utils/commercial";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
export default function PublicProperty({ id, onBack }) {
  const [property, setProperty] = useState(null),
    [error, setError] = useState(""),
    [sending, setSending] = useState(false),
    [success, setSuccess] = useState(""),
    [share, setShare] = useState(""),
    [requestId] = useState(() => crypto.randomUUID());
  useEffect(() => {
    let live = true;
    api(`/public/properties/${id}`)
      .then((p) => {
        if (live) setProperty(p);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [id]);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const result = await api(`/public/properties/${id}/interest`, {
        method: "POST",
        body: { ...data, consent: data.consent === "on", requestId },
      });
      setSuccess(result.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Logo />
        <div className="landing-links">
          <ThemeToggle />
          <button className="btn outline" onClick={onBack}>
            Volver a la colección
          </button>
        </div>
      </nav>
      <main className="public-property">
        <p className="eyebrow">LA COLECCIÓN AURELIA</p>
        {!property && !error && <p>Cargando propiedad…</p>}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {property && (
          <>
            <h1>{property.title}</h1>
            <p>
              {property.address}, {property.city} · {label(property.type)}
            </p>
            <div className="public-gallery">
              {property.images?.map((img) => (
                <img key={img} src={mediaUrl(img)} alt={property.title} />
              ))}
            </div>
            <section className="public-columns">
              <div>
                <h2>{money(property.price)}</h2>
                <p>
                  {property.bedrooms} habitaciones · {property.bathrooms} baños
                  · {property.area} m²
                </p>
                <p className="property-description">{property.description}</p>
                <div className="commercial-actions">
                  <a
                    className="btn dark"
                    href={publicPdfUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Descargar ficha PDF
                  </a>
                  <button
                    className="btn outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          propertyShareUrl(id),
                        );
                        setShare("Enlace copiado");
                      } catch {
                        setShare(propertyShareUrl(id));
                      }
                    }}
                  >
                    Copiar enlace
                  </button>
                </div>
                {share && <p role="status">{share}</p>}
                <p className="muted">
                  Precio y disponibilidad sujetos a confirmación. Sitio de
                  demostración.
                </p>
              </div>
              <section className="panel">
                <h2>Me interesa esta propiedad</h2>
                {success ? (
                  <p role="status">{success}</p>
                ) : (
                  <form className="commercial-form" onSubmit={submit}>
                    <label>
                      Nombre completo
                      <input
                        name="name"
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </label>
                    <label>
                      Correo electrónico
                      <input
                        name="email"
                        type="email"
                        required
                        maxLength={200}
                      />
                    </label>
                    <label>
                      Teléfono
                      <input
                        name="phone"
                        type="tel"
                        required
                        minLength={7}
                        maxLength={30}
                      />
                    </label>
                    <label>
                      Mensaje
                      <textarea name="message" rows={3} maxLength={2000} />
                    </label>
                    <label className="honeypot" aria-hidden="true">
                      Sitio web
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                    <label className="consent">
                      <input name="consent" type="checkbox" required />
                      Autorizo que Aurelia me contacte sobre esta propiedad
                      usando los datos que proporciono.
                    </label>
                    <button className="btn dark" disabled={sending}>
                      {sending ? "Enviando…" : "Solicitar información"}
                    </button>
                  </form>
                )}
              </section>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
