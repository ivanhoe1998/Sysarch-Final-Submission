// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBSUWfp-ZVxvOprgD1E56JPUJwEjnUKs7c',
  authDomain: 'backend-website-c8449.firebaseapp.com',
  projectId: 'backend-website-c8449',
  storageBucket: 'backend-website-c8449.appspot.com',
  messagingSenderId: '1014643900655',
  appId: '1:1014643900655:web:922a1c0061dcf242191b1a',
  measurementId: 'G-SF3DPD4YKY'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Export Firebase services and Firestore methods
export { auth, firestore, collection, getDocs, addDoc, deleteDoc, doc };
