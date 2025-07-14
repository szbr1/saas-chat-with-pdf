
import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


 const firebaseConfig = {
    apiKey: "AIzaSyCv8ou0gcqPiOzG90laieay8QnWu7W6Rqo",
    authDomain: "chat-with-pdf-ecc24.firebaseapp.com",
    projectId: "chat-with-pdf-ecc24",
    storageBucket: "chat-with-pdf-ecc24.firebasestorage.app",
    messagingSenderId: "310120704022",
    appId: "1:310120704022:web:f368bff70c66464512ad37",
    measurementId: "G-WKMJXQRG8F"
  };

  const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore(app);
  const storage = getFirestore(app);

  export {db , storage}