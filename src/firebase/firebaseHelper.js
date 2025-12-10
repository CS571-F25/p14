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
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

export function convertTimestamp(ts) {
  if (!ts) return new Date();
  return ts.toDate ? ts.toDate() : new Date(ts);
}

export async function addReview({
  bandName = null,
  venueName = null,
  title,
  content,
  rating = 0,
  poster = "Anonymous"
}) {
  const currentUser = auth.currentUser;

  const docRef = await addDoc(collection(db, "reviews"), {
    bandName,
    bandNameLower: bandName ? bandName.trim().toLowerCase() : null,

    venueName,
    venueNameLower: venueName ? venueName.trim().toLowerCase() : null,

    title,
    content,
    rating,
    poster,

    userUid: currentUser?.uid || null,
    created: serverTimestamp(),
  });

  return docRef.id;
}


export async function getRecentReviews(limitCount = 10) {
  const q = query(
    collection(db, "reviews"), 
    orderBy("created", "desc"), 
    limit(limitCount)
  );
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
  const formatted = bandName.trim().toLowerCase();

  const q = query(
    collection(db, "reviews"),
    where("bandNameLower", "==", formatted),
    orderBy("created", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      bandName: data.bandName,
      venueName: data.venueName,
      content: data.content,
      title: data.title,
      poster: data.poster,
      rating: data.rating,
      userUid: data.userUid,
      created: data.created?.toDate?.() || data.created,
    };
  });
}



export async function getReviewsForVenue(venueName) {
  const formatted = venueName.trim().toLowerCase();

  const q = query(
    collection(db, "reviews"),
    where("venueNameLower", "==", formatted),
    orderBy("created", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      bandName: data.bandName,
      venueName: data.venueName,
      content: data.content,
      title: data.title,
      poster: data.poster,
      rating: data.rating,
      userUid: data.userUid,
      created: data.created?.toDate?.() || data.created,
    };
  });
}


// fetch reviews by userUid
export async function getReviewsByUser(userUid) {
  const user = auth.currentUser;
  if (!user) return [];

  const email = user.email?.toLowerCase();
  const displayName = user.displayName;

  let allReviews = [];

  // 1️⃣ Get reviews that store userUid correctly
  let q1 = query(
    collection(db, "reviews"),
    where("userUid", "==", userUid),
    orderBy("created", "desc")
  );
  let snap1 = await getDocs(q1);
  allReviews.push(...snap1.docs.map(d => ({
    id: d.id,
    ...d.data(),
    created: d.data().created?.toDate?.() || d.data().created,
  })));

  // 2️⃣ Fallback: match poster email EXACTLY
  let q2 = query(
    collection(db, "reviews"),
    where("poster", "==", email),
    orderBy("created", "desc")
  );
  let snap2 = await getDocs(q2);
  allReviews.push(...snap2.docs.map(d => ({
    id: d.id,
    ...d.data(),
    created: d.data().created?.toDate?.() || d.data().created,
  })));

  // 3️⃣ Fallback: match displayName
  if (displayName) {
    let q3 = query(
      collection(db, "reviews"),
      where("poster", "==", displayName),
      orderBy("created", "desc")
    );
    let snap3 = await getDocs(q3);
    allReviews.push(...snap3.docs.map(d => ({
      id: d.id,
      ...d.data(),
      created: d.data().created?.toDate?.() || d.data().created,
    })));
  }

  // 4️⃣ Remove duplicates
  const unique = [];
  const seen = new Set();

  for (const r of allReviews) {
    if (!seen.has(r.id)) {
      unique.push(r);
      seen.add(r.id);
    }
  }

  return unique;
}



// verify ownership before deleting
export async function deleteReview(reviewId) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Must be logged in to delete reviews");
  }

  // Get the review first to verify ownership
  const reviewDoc = await getDocs(
    query(collection(db, "reviews"), where("__name__", "==", reviewId))
  );
  
  if (!reviewDoc.empty) {
    const reviewData = reviewDoc.docs[0].data();
    if (reviewData.userUid !== currentUser.uid) {
      throw new Error("You can only delete your own reviews");
    }
  }

  return await deleteDoc(doc(db, "reviews", reviewId));
}

export async function updateReview(reviewId, updates) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Must be logged in to update reviews");
  }

  // Verify ownership
  const reviewDoc = await getDocs(
    query(collection(db, "reviews"), where("__name__", "==", reviewId))
  );
  
  if (!reviewDoc.empty) {
    const reviewData = reviewDoc.docs[0].data();
    if (reviewData.userUid !== currentUser.uid) {
      throw new Error("You can only edit your own reviews");
    }
  }

  const allowedUpdates = {
    content: updates.content,
    rating: updates.rating,
    updated: serverTimestamp(),
  };

  return await updateDoc(doc(db, "reviews", reviewId), allowedUpdates);
}