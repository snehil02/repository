import firebase from "firebase";
import "firebase/database";

let config = {
    apiKey: "AIzaSyDsIxUBQX-dTXCfRNp77n9txabThPqndrk",
    authDomain: "my-project-1578554185077.firebaseapp.com",
    projectId: "my-project-1578554185077",
    storageBucket: "my-project-1578554185077.appspot.com",
    messagingSenderId: "524055853235",
    appId: "1:524055853235:web:c1cafb555659a13fda98c6"
};

firebase.initializeApp(config);

export default firebase.database();