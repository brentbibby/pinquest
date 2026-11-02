
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
const welcomeGreetings = [
  "Welcome back, {name}! Your next adventure awaits! 🌍",
  "Great to see you again, {name}! Ready to explore?",
  "Adventure is calling, {name}! 🧭",
  "The world is waiting for you, {name}!",
  "Where will curiosity take you today, {name}?",
  "Another day, another adventure, {name}! 🌎",
  "Ready to discover something amazing, {name}?",
  "Your next unforgettable moment awaits, {name}!",
  "Let's make some memories, {name}! 📍",
  "There's always more to explore, {name}!",
  "Every journey begins with curiosity, {name}!",
  "Welcome aboard, {name}! Let's explore the world! 🚀",
];
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [travelerName, setTravelerName] = useState("Explorer");
  const [greetingIndex] = useState(() => {
  if (typeof window === "undefined") return 0;

  const previous = Number(
    sessionStorage.getItem("pinquestLastGreeting") ?? -1
  );

  const next = (previous + 1) % welcomeGreetings.length;

  sessionStorage.setItem("pinquestLastGreeting", String(next));

  return next;
});
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
const [level, setLevel] = useState(1);
const [streak, setStreak] = useState(0);
const [claimedDiscoveries, setClaimedDiscoveries] = useState<string[]>([]);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
setTravelerName(data.firstName || currentUser.displayName || "Explorer");
        setCoins(data.coins ?? 0);
        setXp(data.xp ?? 0);
        setLevel(Math.floor((data.xp ?? 0) / 500) + 1);
        setStreak(data.streak ?? 0);
        const claimsRef = collection(
  db,
  "users",
  currentUser.uid,
  "claims"
);

const claimsSnap = await getDocs(claimsRef);

const claimedNames = await Promise.all(
  claimsSnap.docs.map(async (claimDoc) => {
    const discoveryRef = doc(db, "discoveries", claimDoc.id);
    const discoverySnap = await getDoc(discoveryRef);

    if (discoverySnap.exists()) {
      return discoverySnap.data().name ?? claimDoc.id;
    }

    return claimDoc.id;
  })
);

setClaimedDiscoveries(claimedNames);
      } else {
        await setDoc(userRef, {
          email: currentUser.email,
          coins: 0,
          xp: 0,
          level: 1,
          streak: 0,
        });
      }
    }
  });

  return () => unsubscribe();
}, []);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e40af)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
      {welcomeGreetings[greetingIndex].replace("{name}", travelerName)}
      </h1>

      <a
  href="/saved"
  style={{
    display: "inline-block",
    marginBottom: "25px",
    background: "#2563eb",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  ❤️ My Saved Discoveries
</a>

      <p
        style={{
          fontSize: "1.2rem",
          color: "#cbd5e1",
          marginBottom: "40px",
        }}
      >
        Your next adventure is waiting...
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>🪙 Coins</h2>
          <h1>{coins}</h1>
        </div>

        <div
  style={{
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
  }}
>
  <h2>⭐ Explorer XP</h2>
  <h1>{xp} XP</h1>
</div><div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>🏆 Explorer Level</h2>
          <h1>{level}</h1>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>🔥 Discovery Streak</h2>
          <h1>{streak} {streak === 1 ? "Day" : "Days"}</h1>
        </div>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
        <h2>📍 Nearby Discoveries</h2>

        <ul
          style={{
            lineHeight: "2",
            fontSize: "18px",
          }}
        >
          <li>🏔️ Moraine Lake Rockpile</li>
          <li>💦 Johnston Canyon Falls</li>
          <li>🌄 Peyto Lake Viewpoint</li>
        </ul>
<div
  style={{
    marginTop: "30px",
    padding: "25px",
    background: "#1e293b",
    borderRadius: "15px",
  }}
>
  <h2>📍 My Pinned Discoveries</h2>

  {claimedDiscoveries.length === 0 ? (
    <p>No discoveries pinned yet.</p>
  ) : (
    <ul
      style={{
        lineHeight: "2",
        fontSize: "18px",
      }}
    >
      {claimedDiscoveries.map((discoveryId) => (
        <li key={discoveryId}>
          🏔️{" "}
          {discoveryId
            .split("-")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ")}
        </li>
      ))}
    </ul>
  )}
</div>


        <button
        onClick={() => (window.location.href = "/discover-feed")}
          style={{
            marginTop: "30px",
            padding: "15px 35px",
            fontSize: "20px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          🚀 Start Exploring
        </button>
      </div>
    </main>
  );
}