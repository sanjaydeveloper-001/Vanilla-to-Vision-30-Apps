import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5X3GQ21pSQmrwwQhzewXWzauUoS8f90I",
  authDomain: "notenest-411d9.firebaseapp.com",
  projectId: "notenest-411d9",
  storageBucket: "notenest-411d9.firebasestorage.app",
  messagingSenderId: "885184067583",
  appId: "1:885184067583:web:009e718512b3c2d444d9ca",
  measurementId: "G-SV5Y1ZK1HQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
