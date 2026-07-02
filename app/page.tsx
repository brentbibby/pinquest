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

        <button
          style={{
            padding: "15px 35px",
            fontSize: "20px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "white",
            cursor: "pointer",
          }}
        >
          🚀 Start Your Adventure
        </button>
      </div>
    </main>
  );
}
