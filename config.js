import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyAZvYuW2w-fE4BfPK3mHCmlRwZCXMAEUKY",
  authDomain: "willy-9f30d.firebaseapp.com",
  databaseURL: "https://willy-9f30d-default-rtdb.firebaseio.com",
  projectId: "willy-9f30d",
  storageBucket: "willy-9f30d.appspot.com",
  messagingSenderId: "743889576792",
  appId: "1:743889576792:web:54de94d797574239b77b2d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
