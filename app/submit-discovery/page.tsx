"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
export default function SubmitDiscoveryPage() {
  const [name, setName] = useState("");
const [city, setCity] = useState("");
const [region, setRegion] = useState("");
const [country, setCountry] = useState("");
const [description, setDescription] = useState("");
const [travelerTip, setTravelerTip] = useState("");
const [visitTime, setVisitTime] = useState("");
const [bestTime, setBestTime] = useState("");
const [submitting, setSubmitting] = useState(false);
const [message, setMessage] = useState("");
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
const [locationName, setLocationName] = useState("");
async function useCurrentLocation() {
  if (!navigator.geolocation) {
    setMessage("GPS location is not supported by your browser.");
    return;
  }

  setMessage("📍 Detecting your location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLocationName("Current GPS Location");
      setMessage("✅ Location detected successfully!");
    },
    () => {
      setMessage(
        "❌ Unable to detect your location. Please check location permissions."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
    }
  );
}
async function handleSubmit() {
  const user = auth.currentUser;

  if (!user) {
    setMessage("Please sign in before submitting a discovery.");
    return;
  }

  if (!name || !city || !region || !country || !description) {
    setMessage("Please complete all required fields.");
    return;
  }
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const submissionsQuery = query(
  collection(db, "discoverySubmissions"),
  where("submittedBy", "==", user.uid),
  where("submittedAt", ">=", Timestamp.fromDate(startOfToday))
);

const submissionsSnapshot = await getDocs(submissionsQuery);

if (submissionsSnapshot.size >= 5) {
  setMessage(
    "🚫 Daily limit reached. You can submit up to 5 discoveries per day."
  );
  return;
}
  setSubmitting(true);
  setMessage("");

  try {
    // Check for existing discoveries with the same name and location
const existingDiscoveries = await getDocs(
  collection(db, "discoveries")
);

const existingSubmissions = await getDocs(
  query(
    collection(db, "discoverySubmissions"),
    where("submittedBy", "==", user.uid)
  )
);

const normalize = (value: string) =>
  value.trim().toLowerCase();

const isDuplicate = [
  ...existingDiscoveries.docs,
  ...existingSubmissions.docs,
].some((document) => {
  const data = document.data();

  return (
    normalize(data.name || "") === normalize(name) &&
    normalize(data.city || "") === normalize(city) &&
    normalize(data.country || "") === normalize(country) &&
    data.status !== "rejected"
  );
});

if (isDuplicate) {
  setMessage(
    "⚠️ This discovery may already exist in PINQUEST. Please check before submitting."
  );
  return;
}
    await addDoc(collection(db, "discoverySubmissions"), {
      name,
      city,
      region,
      country,
      description,
      travelerTip,
      visitTime,
      bestTime,
      status: "pending",
      submittedBy: user.uid,
      submittedAt: serverTimestamp(),
      latitude,
longitude,
locationName,
    });

    setMessage("✅ Discovery submitted for review!");
  } catch (error) {
    console.error("Error submitting discovery:", error);
    setMessage("❌ We couldn't submit your discovery. Please try again.");
  } finally {
    setSubmitting(false);
  }
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          📍 Submit a Discovery
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Found somewhere worth exploring? Submit it to PINQUEST for review.
        </p>

        <label
          htmlFor="discoveryName"
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Discovery Name
        </label>

        <input
          id="discoveryName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Example: Johnston Canyon Lower Falls"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
                <label
          htmlFor="city"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          City
        </label>

        <input
          id="city"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Example: Banff"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
                <label
          htmlFor="region"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          Region / Province / State
        </label>

        <input
          id="region"
          type="text"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          placeholder="Example: Alberta"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
                <label
          htmlFor="country"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          Country
        </label>

        <input
          id="country"
          type="text"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="Example: Canada"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
         <button
  type="button"
  onClick={useCurrentLocation}
  style={{
    marginTop: "15px",
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  📍 Use My Current Location
</button>  
{locationName && (
  <p
    style={{
      marginTop: "10px",
      color: "#22c55e",
      fontWeight: "bold",
    }}
  >
    ✅ Location captured successfully!
  </p>
)}    
                <label
          htmlFor="description"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          Why is this place worth discovering?
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Tell us what makes this location special and worth visiting."
          rows={5}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
            resize: "vertical",
          }}
        />
               <label
          htmlFor="travelerTip"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          💡 Traveler Tip
        </label>

        <textarea
          id="travelerTip"
          value={travelerTip}
          onChange={(event) => setTravelerTip(event.target.value)}
          placeholder="Share a helpful tip for travelers visiting this discovery."
          rows={3}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
            resize: "vertical",
          }}
        /> 
                <label
          htmlFor="visitTime"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          ⏱️ Recommended Visit Time
        </label>

        <input
          id="visitTime"
          type="text"
          value={visitTime}
          onChange={(event) => setVisitTime(event.target.value)}
          placeholder="Example: 45"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
                <label
          htmlFor="bestTime"
          style={{
            display: "block",
            marginTop: "20px",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          🌅 Best Time to Visit
        </label>

        <input
          id="bestTime"
          type="text"
          value={bestTime}
          onChange={(event) => setBestTime(event.target.value)}
          placeholder="Example: Early morning or sunset"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            fontSize: "16px",
          }}
        />
                <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            background: submitting ? "#64748b" : "#22c55e",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "📍 Submit for Review"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}