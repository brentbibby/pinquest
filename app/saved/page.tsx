"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export default function SavedPage() {
  const [savedDiscoveries, setSavedDiscoveries] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSavedDiscoveries([]);
        return;
      }

      const savedSnapshot = await getDocs(
        collection(db, "users", user.uid, "savedDiscoveries")
      );

      const discoveries = await Promise.all(
        savedSnapshot.docs.map(async (savedDoc) => {
          const discoveryRef = doc(
            db,
            "discoveries",
            savedDoc.id
          );

          const discoverySnap = await getDoc(discoveryRef);

          if (!discoverySnap.exists()) {
            return null;
          }

          return {
            id: discoverySnap.id,
            ...discoverySnap.data(),
          };
        })
      );

      setSavedDiscoveries(
        discoveries.filter((discovery) => discovery !== null)
      );
    });

    return () => unsubscribe();
  }, []);
async function removeSavedDiscovery(discoveryId: string) {
  const user = auth.currentUser;

  if (!user) {
    return;
  }

  await deleteDoc(
    doc(db, "users", user.uid, "savedDiscoveries", discoveryId)
  );

  setSavedDiscoveries((current) =>
    current.filter((place) => place.id !== discoveryId)
  );
}
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
      <h1>❤️ My Saved Discoveries</h1>

      <p>Your saved PINQUEST discoveries will appear here.</p>

      {savedDiscoveries.map((place) => (
        <div
          key={place.id}
          style={{
            background: "#1e293b",
            borderRadius: "18px",
            padding: "25px",
            marginTop: "25px",
          }}
        >
          <h2>{place.name}</h2>

          <p>
            {place.city} • {place.region} • {place.country}
          </p>

          <p>⭐ Explorer Score: {place.explorerScore}/10</p>

          <p>🪙 Reward: {place.rewardCoins} PINQUEST Coins</p>

          <a
            href={`/discovery/${place.id}`}
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "#22c55e",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📍 Explore
          </a>
          <button
  onClick={() => removeSavedDiscovery(place.id)}
  style={{
    marginLeft: "12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  💔 Remove
</button>
        </div>
      ))}
    </main>
  );
}