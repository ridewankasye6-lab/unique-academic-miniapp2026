import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


const firebaseConfig = {

    apiKey: "AIzaSyBP9_sR3Ss1Wu7dfz-2bKpiKAI7iQJv-Ik",

    authDomain:
        "unique-academic.firebaseapp.com",

    projectId:
        "unique-academic",

    storageBucket:
        "unique-academic.firebasestorage.app",

    messagingSenderId:
        "465349049783",

    appId:
        "1:465349049783:web:d3da34f32c64068c767c32",

    measurementId:
        "G-LBN5VRB80W"

};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


const auth =
    getAuth(app);


const storage =
    getStorage(app);


export {
    app,
    db,
    auth,
    storage
};
