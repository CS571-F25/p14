import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase"; // adjust if your firebase.js is elsewhere

// convert Firestore Timestamp to JS Date (or leave as-is)
export function convertTimestamp(ts) {
  if (!ts) return new Date();
  return ts.toDate ? ts.toDate() : new Date(ts);
}

export async function addReview({ bandName = null, venueName = null, title, content, rating = 0, poster = "Anonymous" }) {
  const docRef = await addDoc(collection(db, "reviews"), {
    bandName,
    venueName,
    title,
    content,
    rating,
    poster,
    created: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRecentReviews(limitCount = 10) {
  const q = query(collection(db, "reviews"), orderBy("created", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      created: data.created && data.created.toDate ? data.created.toDate() : data.created,
    };
  });
}

export async function getReviewsForBand(bandName) {
  const q = query(collection(db, "reviews"), where("bandName", "==", bandName), orderBy("created", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      created: data.created && data.created.toDate ? data.created.toDate() : data.created,
    };
  });
}

export async function getReviewsForVenue(venueName) {
  const q = query(collection(db, "reviews"), where("venueName", "==", venueName), orderBy("created", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      created: data.created && data.created.toDate ? data.created.toDate() : data.created,
    };
  });
}

export async function deleteReview(id) {
  return await deleteDoc(doc(db, "reviews", id));
}
