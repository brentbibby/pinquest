"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";

export default function AdminReviewPage() {
  const [pendingDiscoveries, setPendingDiscoveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
const userSnapshot = await getDoc(userRef);
setIsAdmin(userSnapshot.exists() && userSnapshot.data().isAdmin === true);
            } else {
      setIsAdmin(false);
    }

    setCheckingAdmin(false);
  });

  return () => unsubscribe();
}, []);
  useEffect(() => {
    async function loadPendingDiscoveries() {
      try {
        const querySnapshot = await getDocs(collection(db, "discoverySubmissions"));

        const pendingList = querySnapshot.docs
          .filter((doc) => doc.data().status === "pending")
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setPendingDiscoveries(pendingList);
      } catch (error) {
        console.error("Error loading pending discoveries:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPendingDiscoveries();
  }, []);
async function approveDiscovery(discoveryId: string) {
  const discovery = pendingDiscoveries.find(
    (place) => place.id === discoveryId
  );

  if (!discovery) {
    alert("Discovery submission could not be found.");
    return;
  }

  const scoreInput = prompt(
    "Enter the Explorer Score for this discovery (0-10):"
  );

  if (scoreInput === null) return;

  const explorerScore = Number(scoreInput);

  if (
    Number.isNaN(explorerScore) ||
    explorerScore < 0 ||
    explorerScore > 10
  ) {
    alert("Explorer Score must be a number from 0 to 10.");
    return;
  }

  const rewardInput = prompt(
    "Enter the PINQUEST Coin reward for this discovery:"
  );

  if (rewardInput === null) return;

  const rewardCoins = Number(rewardInput);

  if (
    Number.isNaN(rewardCoins) ||
    rewardCoins < 0 ||
    !Number.isInteger(rewardCoins)
  ) {
    alert("Reward Coins must be a whole number.");
    return;
  }

  try {
    const approvedDiscoveryRef = doc(
      db,
      "discoveries",
      discoveryId
    );

    await setDoc(approvedDiscoveryRef, {
      name: discovery.name,
      city: discovery.city,
      region: discovery.region,
      country: discovery.country,
      description: discovery.description,
      visitTime: discovery.visitTime,
      bestTime: discovery.bestTime,
      travelerTip: discovery.travelerTip,
      explorerScore,
      rewardCoins,
      status: "approved",
      submittedBy: discovery.submittedBy,
      submittedAt: discovery.submittedAt,
      latitude: discovery.latitude ?? null,
longitude: discovery.longitude ?? null,
locationName: discovery.locationName ?? "",
      reviewedAt: serverTimestamp(),
      reviewedBy: "admin",
    });

    const submissionRef = doc(
      db,
      "discoverySubmissions",
      discoveryId
    );

    await updateDoc(submissionRef, {
      status: "approved",
      explorerScore,
      rewardCoins,
      reviewedAt: serverTimestamp(),
      reviewedBy: "admin",
    });

    setPendingDiscoveries((current) =>
      current.filter((place) => place.id !== discoveryId)
    );

    alert("Discovery approved and added to the public Discovery Feed!");
  } catch (error) {
    console.error("Error approving discovery:", error);
    alert("Unable to approve this discovery.");
  }
}

async function rejectDiscovery(discoveryId: string) {

    const rejectionReason = prompt(
  "Why is this discovery being rejected?"
);

if (!rejectionReason || !rejectionReason.trim()) {
  alert("A rejection reason is required.");
  return;
}
  try {
    const discoveryRef = doc(db, "discoverySubmissions", discoveryId);

    await updateDoc(discoveryRef, {
      status: "rejected",
      rejectionReason: rejectionReason.trim(),
      reviewedAt: serverTimestamp(),
      reviewedBy: "admin",
    });

    setPendingDiscoveries((current) =>
      current.filter((discovery) => discovery.id !== discoveryId)
    );
  } catch (error) {
    console.error("Error rejecting discovery:", error);
    alert("Unable to reject this discovery.");
  }
}

if (checkingAdmin) {
  return <p style={{ padding: "40px" }}>Checking admin access...</p>;
}

if (!isAdmin) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🔒 Access Denied</h1>
      <p>You do not have permission to access the PINQUEST review queue.</p>
    </main>
  );
}
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🛡️ PINQUEST Discovery Review Queue</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "30px" }}>
        Review pending discoveries before they appear in the public Discovery Feed.
      </p>

      {loading ? (
        <p>Loading pending discoveries...</p>
      ) : pendingDiscoveries.length === 0 ? (
        <div
          style={{
            padding: "25px",
            border: "1px solid #334155",
            borderRadius: "16px",
            background: "#1e293b",
          }}
        >
          <h2>✅ Review Queue Clear</h2>
          <p>There are currently no discoveries waiting for review.</p>
        </div>
      ) : (
        pendingDiscoveries.map((place) => (
          <div
            key={place.id}
            style={{
              padding: "25px",
              marginBottom: "20px",
              border: "1px solid #334155",
              borderRadius: "16px",
              background: "#1e293b",
            }}
          >
            <h2>{place.name || "Unnamed Discovery"}</h2>

            <p>
              {place.city || "Unknown City"} •{" "}
              {place.region || "Unknown Region"} •{" "}
              {place.country || "Unknown Country"}
            </p>

            <p>
              Status: <strong>{place.status}</strong>
            </p>

            <p>Explorer Score: {place.explorerScore ?? "Not assigned"}</p>

            <p>{place.description || "No description provided."}</p>
            {typeof place.latitude === "number" &&
  typeof place.longitude === "number" && (
    <a
      href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "15px",
        marginBottom: "10px",
        padding: "12px 20px",
        background: "#2563eb",
        color: "white",
        textDecoration: "none",
        borderRadius: "10px",
        fontWeight: "bold",
      }}
    >
      📍 View on Google Maps
    </a>
  )}
         <button
  onClick={() => approveDiscovery(place.id)}
  style={{
    marginTop: "20px",
    padding: "12px 20px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ✅ Approve Discovery
</button> 
<button
  onClick={() => rejectDiscovery(place.id)}
  style={{
    marginTop: "20px",
    marginLeft: "12px",
    padding: "12px 20px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ❌ Reject Discovery
</button>
</div>
        ))
      )}
    </main>
  );
}