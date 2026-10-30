"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { claimDiscovery } from "@/lib/discovery/discoveryEngine";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, runTransaction, increment, serverTimestamp } from "firebase/firestore";
export default function DiscoveryPage() {
  const params = useParams();
const discoveryId = params.id as string;
  const [claimed, setClaimed] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");
  const [discoveryName, setDiscoveryName] = useState("Loading discovery...");
   const [description, setDescription] = useState("");
   const [city, setCity] = useState("");
const [region, setRegion] = useState("");
const [country, setCountry] = useState("");
const [rewardCoins, setRewardCoins] = useState(0);
const [explorerScore, setExplorerScore] = useState(0);
const [visitTime, setVisitTime] = useState(0);
const [bestTime, setBestTime] = useState("");
const [travelerTip, setTravelerTip] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
const [gpsMessage, setGpsMessage] = useState("");
const [gpsVerified, setGpsVerified] = useState(false);
   useEffect(() => {
      async function loadDiscovery() {
    const discoveryRef = doc(
      db,
      "discoveries",
      discoveryId
    );

    const discoverySnap = await getDoc(discoveryRef);

    if (discoverySnap.exists()) {
      const data = discoverySnap.data();
      setDiscoveryName(data.name ?? "Unnamed Discovery");
      setDescription(data.description ?? "");
      setCity(data.city ?? "");
setRegion(data.region ?? "");
setCountry(data.country ?? "");
setRewardCoins(data.rewardCoins ?? 0);
setExplorerScore(data.explorerScore ?? 0);
setVisitTime(data.visitTime ?? 0);
setBestTime(data.bestTime ?? "");
setTravelerTip(data.travelerTip ?? "");
setImageUrl(data.imageUrl ?? "");
setLatitude(typeof data.latitude === "number" ? data.latitude : null);
setLongitude(typeof data.longitude === "number" ? data.longitude : null);
    }
  }

  loadDiscovery();
}, []);
async function verifyGpsLocation(): Promise<boolean> {
  if (latitude === null || longitude === null) {
    setGpsMessage("⚠️ GPS coordinates are unavailable for this discovery.");
    return false;
  }

  if (!navigator.geolocation) {
    setGpsMessage("❌ Your device does not support GPS location.");
    return false;
  }

  setGpsMessage("📡 Checking your location...");
  setGpsVerified(false);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsAccuracy = position.coords.accuracy;

if (gpsAccuracy > 50) {
  setGpsVerified(false);
  setGpsMessage(
    `⚠️ GPS accuracy is only ±${Math.round(gpsAccuracy)} metres. PINQUEST requires accuracy within 50 metres.`
  );
  resolve(false);
  return;
}
        const toRadians = (degrees: number) =>
          (degrees * Math.PI) / 180;

        const latDifference = toRadians(
          latitude - position.coords.latitude
        );

        const lonDifference = toRadians(
          longitude - position.coords.longitude
        );

        const a =
          Math.sin(latDifference / 2) ** 2 +
          Math.cos(toRadians(position.coords.latitude)) *
            Math.cos(toRadians(latitude)) *
            Math.sin(lonDifference / 2) ** 2;

        const distance =
          6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        if (distance <= 100) {
          setGpsVerified(true);
          setGpsMessage("✅ Location verified! You're within 100 metres.");
          resolve(true);
        } else {
          setGpsMessage(
            `📍 You're ${Math.round(distance)} metres from this discovery.`
          );
          resolve(false);
        }
      },
      () => {
        setGpsMessage("❌ Unable to access your location. Please enable location permissions.");
        resolve(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setSaved(false);
      return;
    }

    const savedDiscoveryRef = doc(
      db,
      "users",
      user.uid,
      "savedDiscoveries",
      discoveryId
    );

    const savedDiscoverySnap = await getDoc(savedDiscoveryRef);

    setSaved(savedDiscoverySnap.exists());
  });

  return () => unsubscribe();
}, [discoveryId]);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setClaimed(false);
      return;
    }

    const claimRef = doc(
      db,
      "users",
      user.uid,
      "claims",
      discoveryId
    );

    const claimSnap = await getDoc(claimRef);

    setClaimed(claimSnap.exists());
  });

  return () => unsubscribe();
}, [discoveryId]);
async function saveDiscovery() {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in to save this discovery.");
    return;
  }

  try {
    const savedDiscoveryRef = doc(
      db,
      "users",
      user.uid,
      "savedDiscoveries",
      discoveryId
    );

    await setDoc(savedDiscoveryRef, {
      discoveryId,
      savedAt: serverTimestamp(),
    });

    setSaved(true);
  } catch (error) {
    console.error("Error saving discovery:", error);
  }
}

return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hero Image */}

      {imageUrl && (
  <img
    src={imageUrl}
    alt="Discovery"
    style={{
      width: "100%",
      height: "420px",
      objectFit: "cover",
    }}
  />
)}

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "10px",
          }}
        >
          📍 {discoveryName}
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          {city} • {region} • {country}
        </p>

        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <div>⭐ Explorer Score: <strong>{explorerScore} / 10</strong></div>

          <div>🪙 Reward: <strong>{rewardCoins} Coins</strong></div>

          {Number(visitTime) > 0 && (
  <div>
    ⏱️ Visit Time: <strong>{visitTime} Minutes</strong>
  </div>
)}

{bestTime.trim() !== "" && (
  <div>
    🌅 Best Time: <strong>{bestTime}</strong>
  </div>
)}
        </div>
        {explorerScore >= 9.8 ? (
  <div
    style={{
      display: "inline-block",
      background: "#4c1d95",
      padding: "10px 18px",
      borderRadius: "20px",
      fontWeight: "bold",
      marginBottom: "30px",
    }}
  >
    💎 LEGENDARY DISCOVERY
  </div>
) : explorerScore >= 9 ? (
  <div
    style={{
      display: "inline-block",
      background: "#92400e",
      padding: "10px 18px",
      borderRadius: "20px",
      fontWeight: "bold",
      marginBottom: "30px",
    }}
  >
    ⭐ SIGNATURE DISCOVERY
  </div>
) : null}

        <h2>About this Discovery</h2>

        <p
          style={{
            lineHeight: "1.9",
            fontSize: "18px",
          }}
        >
          {description}
        </p>
{travelerTip.trim() !== "" && (
        <div
          style={{
            marginTop: "40px",
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h3>💡 Traveler Tip</h3>

          <p>
            {travelerTip}
        
          </p>
        </div>
        )}
{latitude !== null &&
  longitude !== null && (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "20px",
        marginBottom: "30px",
        padding: "14px 24px",
        background: "#2563eb",
        color: "white",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      🧭 Navigate to Discovery
    </a>
  )}
   {justClaimed && (
  <div
    style={{
      marginBottom: "30px",
      padding: "30px",
      borderRadius: "20px",
      background: "#1e293b",
      textAlign: "center",
      border: "2px solid #facc15",
    }}
  >
    <div style={{ fontSize: "42px", marginBottom: "10px" }}>
      🎉
    </div>

    <h2 style={{ margin: "10px 0", fontSize: "30px" }}>
      {explorerScore >= 9.8
  ? "💎 LEGENDARY DISCOVERY!"
  : explorerScore >= 9
  ? "⭐ SIGNATURE DISCOVERY!"
  : "🎉 CONGRATULATIONS!"}
    </h2>

    <h3 style={{ margin: "10px 0", fontSize: "22px" }}>
      {explorerScore >= 9.8
  ? "You found one of PINQUEST's rarest discoveries."
  : explorerScore >= 9
  ? "An exceptional place added to your Passport."
  : "Great Discovery!"}
    </h3>

    <div style={{ fontSize: "26px", marginTop: "20px" }}>
      🪙 +{rewardCoins} PINQUEST Coins
    </div>

    <p style={{ fontSize: "18px", marginTop: "20px" }}>
      Every pin tells a story.
    </p>
  </div>
)}
{levelUp !== null && (
  <div
    style={{
      marginTop: "25px",
      padding: "30px",
      borderRadius: "20px",
      background: "#1e293b",
      textAlign: "center",
      border: "2px solid #22c55e",
    }}
  >
    <div style={{ fontSize: "48px", marginBottom: "10px" }}>
      🎉
    </div>

    <h2 style={{ margin: "10px 0", fontSize: "32px" }}>
      LEVEL UP!
    </h2>

    <h3 style={{ margin: "10px 0", fontSize: "26px" }}>
      ⭐ LEVEL {levelUp} EXPLORER
    </h3>

    <p style={{ fontSize: "18px", marginTop: "15px" }}>
      Your adventures have taken you to the next level!
    </p>

    <p style={{ fontSize: "18px", marginTop: "10px" }}>
      Keep exploring. Your next discovery is waiting.
    </p>
  </div>
)}
   <button
   onClick={async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("Please sign in before claiming a discovery.");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  const claimRef = doc(
    db,
    "users",
    currentUser.uid,
    "claims",
    discoveryId
  );
const locationVerified = await verifyGpsLocation();

if (!locationVerified) {
  return;
}
  try {
    const claimResult = await runTransaction(db, async (transaction) => {
      const claimSnap = await transaction.get(claimRef);
      const userSnap = await transaction.get(userRef);
const userData = userSnap.exists() ? userSnap.data() : {};
const currentXp = userData.xp ?? 0;
const newXp = currentXp + rewardCoins;
const currentLevel = Math.floor(currentXp / 500) + 1;
const newLevel = Math.floor(newXp / 500) + 1;
const currentStreak = userData.streak ?? 0;
const lastPinDate = userData.lastPinDate ?? null;

const today = new Date();

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const todayString = formatLocalDate(today);

let newStreak = 1;

if (lastPinDate) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayString = formatLocalDate(yesterday);

  if (lastPinDate === todayString) {
    newStreak = currentStreak;
  } else if (lastPinDate === yesterdayString) {
    newStreak = currentStreak + 1;
  }
}
      if (claimSnap.exists()) {
        return true;
      }

      transaction.set(
        userRef,
        {
          coins: increment(rewardCoins),
          xp: increment(rewardCoins),
          streak: newStreak,
lastPinDate: todayString,
        },
        { merge: true }
      );

      transaction.set(claimRef, {
        discoveryId: discoveryId,
        claimedAt: serverTimestamp(),
        coinsAwarded: rewardCoins,
        xpAwarded: rewardCoins,
      });

      return newLevel > currentLevel ? newLevel : null;
    });

    if (claimResult === true) {
  alert("You already pinned this discovery.");
  return;
}

if (typeof claimResult === "number") {
  setLevelUp(claimResult);
}

setClaimed(true);
setJustClaimed(true);
  } catch (error) {
    console.error("Claim failed:", error);
    alert("PINQUEST could not save this discovery. Please try again.");
  }
}}
  disabled={claimed}
  style={{
    marginTop: "50px",
    width: "100%",
    padding: "22px",
    fontSize: "24px",
    border: "none",
    borderRadius: "15px",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  {claimed ? "✅ DISCOVERY PINNED" : "📍 PIN THIS DISCOVERY"}
</button>  
{gpsMessage && (
  <p
    style={{
      marginTop: "15px",
      marginBottom: "15px",
      padding: "15px",
      background: "#1e293b",
      borderRadius: "10px",
      textAlign: "center",
      fontSize: "18px",
      color: gpsVerified ? "#22c55e" : "#facc15",
    }}
  >
    {gpsMessage}
  </p>
)}
<button
  onClick={saveDiscovery}
  disabled={saved}
  style={{
    marginTop: "15px",
    width: "100%",
    padding: "18px",
    fontSize: "20px",
    border: "none",
    borderRadius: "15px",
    background: saved ? "#64748b" : "#e11d48",
    color: "white",
    cursor: saved ? "default" : "pointer",
    fontWeight: "bold",
  }}
>
  {saved ? "❤️ SAVED" : "❤️ SAVE DISCOVERY"}
</button>   


      </div>
    </main>
  );
}