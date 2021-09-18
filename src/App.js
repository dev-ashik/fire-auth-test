import "./App.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
// onAuthStateChanged(auth, user => {
//   if(user !== null){
//     console.log("loged in!!");
//   }
//   else{
//     console.log("NO user");
//   }
// });

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
  });

  const provider = new GoogleAuthProvider();
  const handleSignIn = () => {
    // const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        // console.log(displayName, email,photoURL);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };
  const handleSignOut = () => {
    // const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
        console.log(error.message);
      });
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
      {user.isSignedIn && (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="user photo" height="300" width="300" />
        </div>
      )}
    </div>
  );
}

export default App;
