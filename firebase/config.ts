import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6S6d56AU_yPQcrFK56GnPNax-3J9FyPI",
  authDomain: "roadguard-52d98.firebaseapp.com",
  projectId: "roadguard-52d98",
  storageBucket: "roadguard-52d98.firebasestorage.app",
  messagingSenderId: "459181113742",
  appId: "1:459181113742:web:415bd4a1e89fdf46c464df",
  measurementId: "G-6E1QZZYJ3K"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (__DEV__) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    console.log('Emulator connection failed (this is normal in production):', error);
  }
}

export default app;
