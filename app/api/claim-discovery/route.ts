
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Please sign in." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const body = await request.json();
    const discoveryId = body?.discoveryId;
    const gpsLatitude = body?.latitude;
const gpsLongitude = body?.longitude;
const gpsAccuracy = body?.accuracy;
if (
  typeof gpsLatitude !== "number" ||
  typeof gpsLongitude !== "number" ||
  typeof gpsAccuracy !== "number" ||
  !Number.isFinite(gpsLatitude) ||
  !Number.isFinite(gpsLongitude) ||
  !Number.isFinite(gpsAccuracy) ||
  gpsLatitude < -90 ||
  gpsLatitude > 90 ||
  gpsLongitude < -180 ||
  gpsLongitude > 180 ||
  gpsAccuracy < 0 ||
  gpsAccuracy > 50
) {
  return NextResponse.json(
    { error: "Valid GPS coordinates with accuracy within 50 metres are required." },
    { status: 400 }
  );
}
const toRadians = (degrees: number) =>
  (degrees * Math.PI) / 180;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const latDifference = toRadians(lat2 - lat1);
  const lonDifference = toRadians(lon2 - lon1);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(lonDifference / 2) ** 2;

  return (
    6371000 *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
};

    if (
      typeof discoveryId !== "string" ||
      !discoveryId.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid discovery." },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    const discoveryRef = db.collection("discoveries").doc(discoveryId);
    const userRef = db.collection("users").doc(uid);
    const claimRef = userRef.collection("claims").doc(discoveryId);

    const result = await db.runTransaction(async (transaction) => {
      const discoverySnap = await transaction.get(discoveryRef);
      const claimSnap = await transaction.get(claimRef);
      const userSnap = await transaction.get(userRef);

      if (!discoverySnap.exists) {
        throw new Error("Discovery not found.");
      }

      if (claimSnap.exists) {
        return { alreadyClaimed: true };
      }

     const discoveryData = discoverySnap.data();

const targetLatitude = discoveryData?.latitude;
const targetLongitude = discoveryData?.longitude;

if (
  typeof targetLatitude !== "number" ||
  typeof targetLongitude !== "number" ||
  !Number.isFinite(targetLatitude) ||
  !Number.isFinite(targetLongitude)
) {
  throw new Error("Discovery GPS coordinates are unavailable.");
}

const distance = calculateDistance(
  gpsLatitude,
  gpsLongitude,
  targetLatitude,
  targetLongitude
);

if (distance > 100) {
  throw new Error(
    "You must be within 100 metres of the discovery to claim it."
  );
}

const rewardCoins = discoveryData?.rewardCoins;

if (
  typeof rewardCoins !== "number" ||
  !Number.isSafeInteger(rewardCoins) ||
  rewardCoins <= 0 ||
  rewardCoins > 1000
) {
  throw new Error("Invalid discovery reward.");
}

const userData = userSnap.exists ? userSnap.data()! : {};

const currentXp = userData.xp ?? 0;
const newXp = currentXp + rewardCoins;

const currentLevel = Math.floor(currentXp / 500) + 1;
const newLevel = Math.floor(newXp / 500) + 1;

const today = new Date();
const todayString = today.toISOString().slice(0, 10);

const yesterday = new Date(today);
yesterday.setUTCDate(yesterday.getUTCDate() - 1);
const yesterdayString = yesterday.toISOString().slice(0, 10);

const lastPinDate = userData.lastPinDate ?? null;
const currentStreak = userData.streak ?? 0;

let newStreak = 1;

if (lastPinDate === todayString) {
  newStreak = currentStreak;
} else if (lastPinDate === yesterdayString) {
  newStreak = currentStreak + 1;
}

transaction.set(
  userRef,
  {
    coins: FieldValue.increment(rewardCoins),
    xp: FieldValue.increment(rewardCoins),
    streak: newStreak,
    lastPinDate: todayString,
  },
  { merge: true }
);

transaction.set(claimRef, {
  discoveryId,
  claimedAt: FieldValue.serverTimestamp(),
  coinsAwarded: rewardCoins,
  xpAwarded: rewardCoins,
});

return {
  alreadyClaimed: false,
  levelUp: newLevel > currentLevel ? newLevel : null,
};
});
    return NextResponse.json(result);
  } catch (error) {
    console.error("Discovery claim error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to claim discovery.",
      },
      { status: 400 }
    );
  }
}


