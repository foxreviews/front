export default function Header() {
  return (
    <header style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between" }}>
      <strong>Fox Reviews</strong>

      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">Reviews</a>
        <button>Get started</button>
      </nav>
    </header>
  );
}
