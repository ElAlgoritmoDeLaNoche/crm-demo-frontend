const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  home: "M3 10l9-7 9 7v11H3z M9 21v-8h6v8",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  chart: "M4 20V10 M10 20V4 M16 20v-8 M22 20H2",
  check: "M9 11l3 3L22 4 M21 12v8H3V3h13",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2",
  search: "M21 21l-5-5 M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  plus: "M12 5v14 M5 12h14",
  logout: "M9 3H3v18h6 M9 12h12 M16 7l5 5-5 5",
  close: "M6 6l12 12 M6 18L18 6",
  bell: "M18 8a6 6 0 0 0-12 0v7l-2 3h16l-2-3z M10 21h4",
  bed: "M3 18V8 M3 13h18v5 M6 13V8h12v5 M3 18v3 M21 18v3",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  menu: "M3 6h18 M3 12h18 M3 18h18",
};
export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={paths[name] || paths.home} />
    </svg>
  );
}
