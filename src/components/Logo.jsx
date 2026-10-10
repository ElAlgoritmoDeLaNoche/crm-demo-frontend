export default function Logo({ light = false }) {
  return (
    <div className={`brand ${light ? "light" : ""}`}>
      <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
        <path
          d="M3 36L20 4l17 32M10 24h20M14 36l6-12 6 12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M1 41h38" stroke="currentColor" />
      </svg>
      <span>
        AURELIA<small>ESTATES & CO.</small>
      </span>
    </div>
  );
}
