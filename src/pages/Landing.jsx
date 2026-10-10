import { useEffect, useState } from "react";
import { api, mediaUrl } from "../services/api";
import { money } from "../utils/format";
import { propertyShareUrl } from "../utils/commercial";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";
import Icon from "../components/Icon";
const currentYear = new Date().getFullYear();
const hero =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=90";
export default function Landing({ onEnter }) {
  const [properties, setProperties] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    api("/public/properties")
      .then((p) => {
        if (live) setProperties(p);
      })
      .catch((e) => {
        if (live) setError(e.message);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Logo />
        <div className="landing-links">
          <ThemeToggle />
          <a href="#collection">Nuestra colección</a>
          <a href="#approach">Nuestro enfoque</a>
          <button className="btn dark" onClick={onEnter}>
            Acceso al CRM <Icon name="arrow" size={16} />
          </button>
        </div>
      </nav>
      <section className="hero">
        <img src={hero} alt="Residencia contemporánea de lujo con piscina" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">
            HOGARES EXCEPCIONALES. VIDAS EXTRAORDINARIAS.
          </p>
          <h1>
            Un lugar para vivir
            <br />
            <em>lo extraordinario.</em>
          </h1>
          <p>
            Espacios únicos. Conexiones auténticas.
            <br />
            Descubre una forma más cercana de vivir el mundo inmobiliario.
          </p>
          <button className="btn cream" onClick={onEnter}>
            Explorar el CRM <Icon name="arrow" />
          </button>
        </div>
        <span className="hero-foot">
          BEVERLY HILLS, CALIFORNIA{" "}
          <span>RESIDENCIA EN LA COLINA — 01 / 03</span>
        </span>
      </section>
      <section id="approach" className="intro">
        <p className="eyebrow">LA DIFERENCIA AURELIA</p>
        <h2>
          Bienes raíces, con
          <br />
          <em>una mirada humana.</em>
        </h2>
        <div>
          <p>
            Detrás de cada propiedad excepcional hay una historia. Conectamos
            personas, lugares y posibilidades con experiencia, atención al
            detalle y un trato genuinamente personal.
          </p>
          <button className="text-button" onClick={onEnter}>
            Descubre tu próximo capítulo <Icon name="arrow" />
          </button>
        </div>
      </section>
      <section id="collection" className="landing-collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UNA COLECCIÓN SELECCIONADA</p>
            <h2>Extraordinarias por naturaleza.</h2>
          </div>
          <button className="text-button" onClick={onEnter}>
            Ver el portafolio <Icon name="arrow" />
          </button>
        </div>
        <div className="landing-cards">
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {loading && <p>Cargando colección…</p>}
          {!loading && !error && !properties.length && (
            <p>No hay propiedades publicadas disponibles por el momento.</p>
          )}
          {properties.map((p) => (
            <article key={p._id}>
              <a href={propertyShareUrl(p._id)}>
                <img src={mediaUrl(p.images?.[0]) || hero} alt={p.title} />
              </a>
              <p className="eyebrow">EXCLUSIVAMENTE AURELIA</p>
              <h3>{p.title}</h3>
              <p>
                {p.city} · {money(p.price)}
              </p>
              <a className="text-button" href={propertyShareUrl(p._id)}>
                Ver propiedad y solicitar información ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-cta">
        <p className="eyebrow">TU PRÓXIMO CAPÍTULO EMPIEZA AQUÍ</p>
        <h2>
          Grandes relaciones.
          <br />
          <em>Nuevas posibilidades.</em>
        </h2>
        <button className="btn cream" onClick={onEnter}>
          Ingresar al CRM <Icon name="arrow" />
        </button>
      </section>
      <footer>
        <Logo />
        <span>
          © {currentYear} Aurelia Estates & Co. · Espacio de demostración
        </span>
      </footer>
    </div>
  );
}
