import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBPqWOhynsYYL9OAMcGoJDtMgCxsmbBY_s",
    authDomain: "instagram-clone-f8d7b.firebaseapp.com",
    databaseURL: "https://instagram-clone-f8d7b.firebaseio.com",
    projectId: "instagram-clone-f8d7b",
    storageBucket: "instagram-clone-f8d7b.appspot.com",
    messagingSenderId: "766040161463",
    appId: "1:766040161463:web:0441bf50b122f4a4682132",
    measurementId: "G-K0HTX99CKC"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage()

export { db, auth, storage}