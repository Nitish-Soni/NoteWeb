import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";

const FirebaseConfig = {
  apiKey: "AIzaSyABv12r_kILa_L5lu_ZQh_sa_GIvOML8bM",
  authDomain: "nitish-noteweb.firebaseapp.com",
  projectId: "nitish-noteweb",
  databaseURL:
    "https://nitish-noteweb-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "nitish-noteweb.firebasestorage.app",
  messagingSenderId: "938735945485",
  appId: "1:938735945485:web:a62a4c02d86cbdaac4d244",
  measurementId: "G-CCNQL0V2C4",
};

const FirebaseApp = initializeApp(FirebaseConfig);
const AppDatabase = getDatabase(FirebaseApp);

export { AppDatabase, ref, set, get, child, remove };
