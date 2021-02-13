import firebase from "./firebaseConfig.js";
const firestore = firebase.firestore();
export const signInUser = async ({ first, name, email, password, phone }) => {
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((Credential) => {
        firebase.auth().currentUser.updateProfile({
          displayName: first + name,
        });
        firestore.collection("Users").doc(Credential.user.uid).set({
          FirstName: first,
          LastName: name,
          Email: email,
          Phone: phone,
        });
      });
    return {};
  } catch (error) {
    console.log("error");
    switch (error.code) {
      case "auth/email-already-in-use":
        return {
          error: "E-mail already in use.",
        };
      case "auth/invalid-email":
        return {
          error: "Invalid e-mail address format.",
        };
      case "auth/weak-password":
        return {
          error: "Password is too weak.",
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute.",
        };
      default:
        return {
          error: "Check your internet connection.",
        };
    }
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return {};
  } catch (error) {
    console.log("error");
    switch (error.code) {
      case "auth/invalid-email":
        return {
          error: "Invalid email address format.",
        };
      case "auth/user-not-found":
        return {
          error: "Invalid email address ",
        };
      case "auth/wrong-password":
        return {
          error: "Invalid password.",
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute.",
        };
      default:
        return {
          error: "Check your internet connection.",
        };
    }
  }
};

export const sendEmailWithPassword = async ({ email }) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    return {};
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-email":
        return {
          error: "Invalid email address format.",
        };
      case "auth/user-not-found":
        return {
          error: "User with this email does not exist.",
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute.",
        };
      default:
        return {
          error: "Check your internet connection.",
        };
    }
  }
};

export const change = async ({ password }) => {
  try {
    await firebase.auth().currentUser.updatePassword(password);
    return {};
  } catch (error) {
    switch (error.code) {
      case "auth/weak-password":
        return {
          error: "Password is too weak.",
        };
      case "auth/too-many-requests":
        return {
          error: "Too many request. Try again in a minute.",
        };
      default:
        return {
          error: "Check your internet connection.",
        };
    }
  }
};
