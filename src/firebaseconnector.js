import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();
