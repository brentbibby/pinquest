"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
export default function DiscoverFeedPage() {
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  useEffect(() => {
  async function loadData() {
    const querySnapshot = await getDocs(collection(db, "discoveries"));

    const discoveryList = querySnapshot.docs
  .filter((doc) => doc.data().status === "approved")
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

    setDiscoveries(discoveryList);

    const user = auth.currentUser;

    if (user) {
      const savedSnapshot = await getDocs(
        collection(db, "users", user.uid, "savedDiscoveries")
      );

      const ids = savedSnapshot.docs.map((doc) => doc.id);
      setSavedIds(ids);
    }
  }

  loadData();
}, []);
async function saveDiscovery(discoveryId: string) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in before saving a discovery.");
    return;
  }

  await setDoc(
    doc(db, "users", user.uid, "savedDiscoveries", discoveryId),
    {
      discoveryId,
      savedAt: serverTimestamp(),
    }
  );
setSavedIds((current) => [...current, discoveryId]);
  
}
async function unsaveDiscovery(discoveryId: string) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in before removing a saved discovery.");
    return;
  }

  await deleteDoc(
    doc(db, "users", user.uid, "savedDiscoveries", discoveryId)
  );

  setSavedIds((current) =>
    current.filter((id) => id !== discoveryId)
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
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        🌎 Discover
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "40px",
        }}
      >
        Amazing experiences recommended by travelers around the world.
      </p>

      
        {discoveries.map((place) => (
  <div
    key={place.id}
    style={{
            background: "#1e293b",
            borderRadius: "18px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 10px 25px rgba(0,0,0,.35)",
          }}
        >
          <h2>{place.name}</h2>

          <p>{place.country}</p>

          <p>⭐ Explorer Score: {place.explorerScore != null ? `${place.explorerScore}/10` : "Not rated"}</p>

          <p>🪙 Reward: {place.rewardCoins != null ? `${place.rewardCoins} PINQUEST Coins` : "Not set"}</p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <a
  href={`/discovery/${place.id}`}
  style={{
    display: "inline-block",
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  }}
>
  📍 Explore
</a>

            <button
 onClick={() =>
  savedIds.includes(place.id)
    ? unsaveDiscovery(place.id)
    : saveDiscovery(place.id)
}          
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
{savedIds.includes(place.id) ? "❤️ Saved" : "💗 Save"}
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}