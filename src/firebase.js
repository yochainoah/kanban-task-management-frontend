// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYGZvXdmT8JFUW4qOiWqWaAjKmdT6D7O0",
  authDomain: "kanban-auth-30167.firebaseapp.com",
  projectId: "kanban-auth-30167",
  storageBucket: "kanban-auth-30167.appspot.com",
  messagingSenderId: "930064666679",
  appId: "1:930064666679:web:301298357fbd2a532e6fb2",
  measurementId: "G-L89SBP92R9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;