"use client";

import Link from "next/link";

export default function Navigation() {
  const links = [
    { name: "🏠 Dashboard", href: "/dashboard" },
    { name: "🌍 Discover", href: "/discover-feed" },
    { name: "❤️ Saved", href: "/saved" },
    { name: "📋 My Submissions", href: "/my-submissions" },
    { name: "📍 Submit Discovery", href: "/submit-discovery" },
    { name: "👤 Profile", href: "/profile" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "18px 30px",
        background: "#1e293b",
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#22c55e",
          fontWeight: "bold",
          fontSize: "20px",
          textDecoration: "none",
        }}
      >
        🌍 PINQUEST
      </Link>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}