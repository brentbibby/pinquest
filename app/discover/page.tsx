"use client";
export default function DiscoverPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        📍 Discovery
      </h1>

      <h2
        style={{
          color: "#94a3b8",
          fontWeight: "normal",
          marginBottom: "40px",
        }}
      >
        Moraine Lake Rockpile
      </h2>

      <div
        style={{
          maxWidth: "700px",
          background: "#1e293b",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,.35)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1508264165352-258a6f82c2f7?w=1200"
          alt="Moraine Lake"
          style={{
            width: "100%",
            height: "350px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "25px" }}>
          <p style={{ lineHeight: "1.8", fontSize: "18px" }}>
            One of the most photographed lakes in the world. Surrounded by
            towering Rocky Mountains and brilliant turquoise water, this is one
            of Canada's greatest natural treasures.
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "15px",
            }}
          >
            <button
            onClick={() => (window.location.href = "/auth")}
              style={{
                padding: "15px 25px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              📍 Pin This Discovery
            </button>

            <button
              style={{
                padding: "15px 25px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ❤️ Save for Later
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}