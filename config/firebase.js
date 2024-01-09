// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn2G-N-_cgp38vskF3Z-5wtFrpxVCyVgA",
    authDomain: "destinationguide-f2c36.firebaseapp.com",
    projectId: "destinationguide-f2c36",
    storageBucket: "destinationguide-f2c36.appspot.com",
    messagingSenderId: "379451376414",
    appId: "1:379451376414:web:fdcb276c962f4972b1bf0f",
    measurementId: "G-XP4ETG5T2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);