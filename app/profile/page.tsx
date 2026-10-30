"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
export default function ProfilePage() {
  const [explorer, setExplorer] = useState("Explorer");
const [coins, setCoins] = useState(0);
const [xp, setXp] = useState(0);
const [level, setLevel] = useState(1);
const [streak, setStreak] = useState(0);
const [discoveries, setDiscoveries] = useState(0);
const [countries, setCountries] = useState(0);
const [community, setCommunity] = useState(0);
const [signature, setSignature] = useState(0);
const [legendary, setLegendary] = useState(0);
const [recentDiscovery, setRecentDiscovery] = useState({
  name: "No discoveries yet",
  location: "",
  rewardCoins: 0,
});
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      setExplorer(currentUser.email ?? "Explorer");
      setCoins(data.coins ?? 0);
      setXp(data.xp ?? 0);
      setLevel(Math.floor((data.xp ?? 0) / 500) + 1);
      setStreak(data.streak ?? 0);
    }
const communityQuery = query(
  collection(db, "discoveries"),
  where("createdBy", "==", currentUser.uid),
  where("status", "==", "approved")
);

const communitySnap = await getDocs(communityQuery);
setCommunity(communitySnap.size);
    const claimsRef = collection(
      db,
      "users",
      currentUser.uid,
      "claims"
    );

    const claimsSnap = await getDocs(claimsRef);
    setDiscoveries(claimsSnap.size);
    const claims = claimsSnap.docs
  .map((claimDoc) => ({
    id: claimDoc.id,
    ...claimDoc.data(),
  }))
  .sort((a: any, b: any) => {
    const aTime = a.claimedAt?.toMillis?.() ?? 0;
    const bTime = b.claimedAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
const signatureResults = await Promise.all(
  claims.map(async (claim: any) => {
    const discoveryRef = doc(db, "discoveries", claim.id);
    const discoverySnap = await getDoc(discoveryRef);

    if (discoverySnap.exists()) {
      const discoveryData = discoverySnap.data();
      return (discoveryData.explorerScore ?? 0) >= 9 && (discoveryData.explorerScore ?? 0) < 9.8;
    }

    return false;
  })
);

setSignature(signatureResults.filter(Boolean).length);

const legendaryResults = await Promise.all(
  claims.map(async (claim: any) => {
    const discoveryRef = doc(db, "discoveries", claim.id);
    const discoverySnap = await getDoc(discoveryRef);

    if (discoverySnap.exists()) {
      const discoveryData = discoverySnap.data();
      return (discoveryData.explorerScore ?? 0) >= 9.8;
    }

    return false;
  })
);

setLegendary(legendaryResults.filter(Boolean).length);

const countryNames = await Promise.all(
  claims.map(async (claim: any) => {
    const discoveryRef = doc(db, "discoveries", claim.id);
    const discoverySnap = await getDoc(discoveryRef);

    if (discoverySnap.exists()) {
      return discoverySnap.data().country ?? null;
    }

    return null;
  })
);

const uniqueCountries = new Set(
  countryNames.filter((country): country is string => Boolean(country))
);

setCountries(uniqueCountries.size);
if (claims.length > 0) {
  const latestClaim = claims[0];

  const discoveryRef = doc(db, "discoveries", latestClaim.id);
  const discoverySnap = await getDoc(discoveryRef);

  if (discoverySnap.exists()) {
    const discoveryData = discoverySnap.data();

    setRecentDiscovery({
      name: discoveryData.name ?? latestClaim.id,
      location: `${discoveryData.city ?? ""} ${discoveryData.region ?? ""} ${discoveryData.country ?? ""}`.trim(),
      rewardCoins: discoveryData.rewardCoins ?? 0,
    });
  }
}
  });

  return () => unsubscribe();
}, []);
  const profile = {
  explorer,
  level,
  coins,
  xp,
  streak,
  discoveries,
  countries,
  community,
  signature,
  legendary,
};
const xpForCurrentLevel = (profile.level - 1) * 500;
const xpForNextLevel = profile.level * 500;
const xpIntoLevel = profile.xp - xpForCurrentLevel;
const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
const xpProgress = Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100));
  const achievements = [
    {
      title: "🌱 First Discovery",
      description: "Claim your very first PINQUEST discovery.",
      earned: discoveries >= 1,
    },
    {
      title: "🌍 World Traveler",
      description: "Explore 10 different countries.",
      earned: countries >= 10,
    },
    {
      title: "⭐ Community Explorer",
      description: "Claim 25 Community Discoveries.",
      earned: community >= 25,
    },
    {
      title: "💎 Legendary Hunter",
      description: "Claim your first Legendary Discovery.",
      earned: legendary >= 1,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#1e293b",
          borderRadius: "20px",
          padding: "35px",
        }}
      >
        <h1>👤 Explorer Profile</h1>

        <h2>{profile.explorer}</h2>

        <p style={{ color: "#94a3b8" }}>
          Level {profile.level} Explorer
        </p>
        <div style={{ marginBottom: "20px" }}>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "6px",
      fontSize: "14px",
      color: "#94a3b8",
    }}
  >
    <span>{profile.xp} XP</span>
    <span>{xpForNextLevel} XP</span>
  </div>

  <div
    style={{
      width: "100%",
      height: "12px",
      background: "#334155",
      borderRadius: "10px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${xpProgress}%`,
        height: "100%",
        background: "#22c55e",
        borderRadius: "10px",
      }}
    />
  </div>

  <div
    style={{
      marginTop: "6px",
      fontSize: "14px",
      color: "#94a3b8",
    }}
  >
    {Math.max(0, xpForNextLevel - profile.xp)} XP to Level {profile.level + 1}
  </div>
</div>

        <hr />

        <div style={{ lineHeight: "2", fontSize: "22px" }}>
          <p>🪙 PINQUEST Coins: <strong>{profile.coins}</strong></p>
<p>⭐ Explorer XP: <strong>{profile.xp} XP</strong></p>

<p>🔥 Discovery Streak: <strong>{profile.streak} {profile.streak === 1 ? "Day" : "Days"}</strong></p>


          <p>📍 Discoveries Claimed: <strong>{profile.discoveries}</strong></p>

          <p>🌎 Countries Explored: <strong>{profile.countries}</strong></p>

          <p>🏆 Community Discoveries: <strong>{profile.community}</strong></p>

          <p>⭐ Signature Discoveries: <strong>{profile.signature}</strong></p>

          <p>💎 Legendary Discoveries: <strong>{profile.legendary}</strong></p>
        </div>

        <hr style={{ margin: "35px 0" }} />

        <h2>🏅 Explorer Achievements</h2>

        {achievements.map((achievement, index) => (
          <div
            key={index}
            style={{
              background: achievement.earned ? "#14532d" : "#334155",
              borderRadius: "12px",
              padding: "18px",
              marginTop: "15px",
            }}
          >
            <h3>{achievement.title}</h3>

            <p>{achievement.description}</p>

            <strong>
              {achievement.earned ? "✅ Earned" : "🔒 Locked"}
            </strong>
          </div>
        ))}

        <hr style={{ margin: "35px 0" }} />

        <h2>📍 Most Recent Discovery</h2>

        <div
          style={{
            background: "#334155",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <h3>{recentDiscovery.name}</h3>

<p>{recentDiscovery.location}</p>

<p>Reward Earned: {recentDiscovery.rewardCoins} PINQUEST Coins</p>
        </div>

        <a
          href="/discover"
          style={{
            display: "inline-block",
            marginTop: "40px",
            background: "#22c55e",
            color: "white",
            padding: "14px 28px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Return to Dashboard
        </a>
      </div>
    </main>
  );
}