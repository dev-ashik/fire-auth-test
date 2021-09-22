import "./App.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
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
  const [newUser, setNewuser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    isSuccess: false,
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
        // console.log(result.user);
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
          name: "",
          email: "",
          photo: "",
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
        console.log(error.message);
      });
  };

  const handleBlur = (e) => {
    // console.log(e.terget.name, e.terget.value);
    let isFildValid = true;
    if (e.target.name === "email") {
      isFildValid = /\S+@\S+\.\S+/.test(e.target.value);
      // console.log(e.target.value);
      // console.log(isFildValid);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFildValid = isPasswordValid && passwordHasNumber;
    }
    if (isFildValid) {
      // [...cart, newItem]
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      // const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in
          // const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.isSuccess = true;
          console.log(user);
          updateUserName(user.name);
          setUser(newUserInfo);
          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.isSuccess = false;
          setUser(newUserInfo);
          // console.log(error.message)
          // ..
        });
    }
    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.isSuccess = true;
          setUser(newUserInfo);
          // console.log(userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.isSuccess = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };

  const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      console.log("user name updated successfully");
    }).catch((error) => {
      console.log(error);
    });
  }

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
      <div>
        <h1>Fire auth test</h1>
        <input
          type="checkbox"
          onChange={() => setNewuser(!newUser)}
          name="newUser"
          id=""
        />
        <label htmlFor="newUser">New User sign up</label>
        {/* <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Password: {user.password}</p> */}

        <form action="">
          {newUser && (
            <input
              type="text"
              onBlur={handleBlur}
              name="name"
              id=""
              placeholder="Your name"
              required
            />
          )}
          <br />
          <input
            type="text"
            onBlur={handleBlur}
            name="email"
            id=""
            placeholder="Your Email address"
            required
          />
          <br />
          <input
            type="password"
            onBlur={handleBlur}
            name="password"
            id=""
            placeholder="Your Password"
            required
          />
          <br />
          <input type="submit" value={newUser ? 'sign up' : 'sign In'} onClick={handleSubmit} />
        </form>

        <h3 style={{ color: "red" }}>{user.error}</h3>
        {user.isSuccess && <h3 style={{ color: "green" }}>{newUser ? "signUp" : "signIn"}  successful</h3>}
      </div>
    </div>
  );
}

export default App;
 