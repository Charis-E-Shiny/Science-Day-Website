import { z } from "zod";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  updateDoc, 
  increment,
  onSnapshot,
  query,
  orderBy,
  type Firestore,
  type CollectionReference,
  getDocs
} from "firebase/firestore";
import type { Poster } from "@shared/schema";

const firebaseConfig = {
  apiKey: "AIzaSyCkqGBCyzaNrKNWoe3MRLgKY8TLq9SxWEo",
  authDomain: "science-day-3dab4.firebaseapp.com",
  projectId: "science-day-3dab4",
  storageBucket: "science-day-3dab4.firebasestorage.app",
  messagingSenderId: "641167178435",
  appId: "1:641167178435:web:954d956de304aaeaae4076"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let postersRef: CollectionReference;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  postersRef = collection(db, "posters");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

export function subscribeToPosters(
  onSuccess: (posters: Poster[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(postersRef, orderBy("createdAt", "desc"));

  // Create the subscription
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const posters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Poster[];
      onSuccess(posters);
    },
    (error) => {
      console.error("Error in posters subscription:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

// Local storage key for votes
const VOTES_STORAGE_KEY = 'poster_votes';

// Get voted posters from localStorage
function getVotedPosters(): Record<string, 'up' | 'down'> {
  try {
    const votes = localStorage.getItem(VOTES_STORAGE_KEY);
    return votes ? JSON.parse(votes) : {};
  } catch {
    return {};
  }
}

// Save vote to localStorage
function saveVote(posterId: string, voteType: 'up' | 'down') {
  const votes = getVotedPosters();
  votes[posterId] = voteType;
  localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
}

export async function vote(posterId: string, type: "up" | "down") {
  const votedPosters = getVotedPosters();

  if (votedPosters[posterId]) {
    throw new Error("You have already voted on this poster");
  }

  try {
    const posterRef = doc(db, "posters", posterId);

    // Update the poster's vote count
    if (type === "up") {
      await updateDoc(posterRef, {
        upvotes: increment(1)
      });
    } else {
      await updateDoc(posterRef, {
        downvotes: increment(1)
      });
    }

    // Save the vote locally
    saveVote(posterId, type);
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
}

export function hasVoted(posterId: string): boolean {
  const votes = getVotedPosters();
  return !!votes[posterId];
}

// Add this function to get all posters data
export async function getAllPostersData() {
  try {
    const snapshot = await getDocs(postersRef);
    const posters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return posters;
  } catch (error) {
    console.error("Error getting posters data:", error);
    throw error;
  }
}

export { db, postersRef };