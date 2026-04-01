import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ก๊อปปี้ค่าจากที่คุณได้มาวางลงไปตรงๆ เลยครับ
const firebaseConfig = {
    apiKey: "AIzaSyDVu4JAUV-as3a2JBF_QOrkxZseuFrI6lU",
    authDomain: "databaselocation-2219c.firebaseapp.com",
    projectId: "databaselocation-2219c",
    storageBucket: "databaselocation-2219c.firebasestorage.app",
    messagingSenderId: "874732279071",
    appId: "1:874732279071:web:2e2f88b568979fba308c2a",
    measurementId: "G-92RVRCF8KQ"
};

// ตรวจสอบเพื่อไม่ให้ Initialize ซ้ำซ้อน
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);