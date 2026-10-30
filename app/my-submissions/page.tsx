"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      try {
        const submissionsQuery = query(
  collection(db, "discoverySubmissions"),
  where("submittedBy", "==", user.uid)
);

const snapshot = await getDocs(submissionsQuery);

        const mySubmissions = snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .sort((a: any, b: any) => {
    const aTime = a.submittedAt?.toMillis?.() ?? 0;
    const bTime = b.submittedAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });

        setSubmissions(mySubmissions);
      } catch (error) {
        console.error("Error loading submissions:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "40px", color: "white" }}>
        Loading your submissions...
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
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          📍 My Submissions
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Track the discoveries you have submitted to PINQUEST.
        </p>

        {submissions.length === 0 ? (
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "14px",
            }}
          >
            You haven't submitted any discoveries yet.
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "14px",
                marginBottom: "20px",
              }}
            >
              <h2>{submission.name}</h2>

              <p>
                {submission.city} • {submission.region} • {submission.country}
              </p>

              <p>
                Status:{" "}
                <strong
                  style={{
                    color:
                      submission.status === "approved"
                        ? "#22c55e"
                        : submission.status === "rejected"
                        ? "#ef4444"
                        : "#facc15",
                  }}
                >
                  {submission.status}
                </strong>
              </p>

              {submission.status === "rejected" &&
                submission.rejectionReason && (
                  <p style={{ color: "#fca5a5" }}>
                    Reason: {submission.rejectionReason}
                  </p>
                )}
                {submission.status === "approved" && (
  <a
    href={`/discovery/${submission.id}`}
    style={{
      display: "inline-block",
      marginTop: "15px",
      padding: "10px 18px",
      background: "#22c55e",
      color: "white",
      textDecoration: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    }}
  >
    📍 View Discovery
  </a>
)}
            </div>
          ))
        )}
      </div>
    </main>
  );
}