import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwb29S1PlGmoBb3sbLh07vTM2hLpwXi6s",
  authDomain: "test-4a236.firebaseapp.com",
  databaseURL: "https://test-4a236.firebaseio.com",
  projectId: "test-4a236",
  storageBucket: "test-4a236.appspot.com",
  messagingSenderId: "48936436349",
  appId: "1:48936436349:web:1e09055ad6f8629b956714",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
