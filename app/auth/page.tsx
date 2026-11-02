"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
export default function AuthPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleSignIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Welcome back to PINQUEST!");
    window.location.href = "/dashboard";
  } catch (error) {
    alert("Sign in failed. Please check your email and password.");
  }
};
  const handleCreateAccount = async () => {
    if (!firstName.trim()) {
  alert("Please enter your first name.");
  return;
}
  try {
    const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

await setDoc(doc(db, "users", userCredential.user.uid), {
  email: userCredential.user.email,
  firstName: firstName.trim() || "Explorer",
  coins: 0,
  xp: 0,
  level: 1,
  streak: 0,
});
    alert("Welcome to PINQUEST! Your account has been created.");
    window.location.href = "/dashboard";
  } catch (error: any) {
  alert(`Account creation failed: ${error.code}`);
}
};
return (
  <main
    style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "35px",
        background: "#1e293b",
        borderRadius: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🌍 PINQUEST Sign In
      </h1>
<input
  type="text"
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  style={{
    width: "100%",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    fontSize: "18px",
    boxSizing: "border-box",
  }}
/>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: "15px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "none",
          boxSizing: "border-box",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleSignIn}
        style={{
          width: "100%",
          padding: "15px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Sign In
      </button>
      
      
<button
  onClick={handleCreateAccount}
  style={{
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Create Account
</button>
    </div>
  </main>
);
}