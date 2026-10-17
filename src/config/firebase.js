import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


export const firebaseConfig = {

  apiKey: "AIzaSyBLsecSCv0JK_YDVslbNvPWnad8vZQz_kE",

  authDomain: "filcat-kitchen.firebaseapp.com",

  projectId: "filcat-kitchen",

  storageBucket: "filcat-kitchen.firebasestorage.app",

  messagingSenderId: "783287001775",

  appId: "1:783287001775:web:edc64f894c8aa618542a5a",

  measurementId: "G-5P0N3LHSBV"

};

  
export const isCloudEnabled = true;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
