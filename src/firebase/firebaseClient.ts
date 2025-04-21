// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {FirebaseStorage, getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtne4VdBjDOZjRwORVOovxasbh4iQ6OLA",
    authDomain: "boma-listing.firebaseapp.com",
    projectId: "boma-listing",
    storageBucket: "boma-listing.firebasestorage.app",
    messagingSenderId: "1517797817",
    appId: "1:1517797817:web:08cbcc381000eed3207668"
};

// Initialize Firebase
const currentApps = getApps()

let auth:Auth;
let storage:FirebaseStorage

//checks if an app has  been initialized and if not initialize the app
if(!currentApps.length){
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
}else{
    const app = currentApps[0];
    auth = getAuth(app);
    storage = getStorage(app);
}

export {auth , storage}