export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e40af)",
        color: "white",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
          }}
        >
          🌍 PINQUEST
        </h1>

        <h2
          style={{
            fontWeight: "normal",
            marginBottom: "2rem",
          }}
        >
          Explore. Discover. Collect Memories.
        </h2>

        <a
          href="/language"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "#2563EB",
            color: "white",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: "bold",
            marginTop: "1rem",
            marginBottom: "2rem",
          }}
        >
          🌍 Choose Your Language
        </a>

        <p
          style={{
            maxWidth: "600px",
            lineHeight: "1.8",
            marginBottom: "2rem",
          }}
        >
          Turn every journey into an adventure. Collect amazing places,
          complete quests, earn achievements, and build your own travel
          story.
        </p>

        <a
  href="/discover"
  style={{
    display: "inline-block",
    padding: "15px 35px",
    fontSize: "20px",
    borderRadius: "10px",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
    textDecoration: "none",
  }}
>
  🚀 Start Your Adventure
</a>
      </div>
    </main>
  );
}