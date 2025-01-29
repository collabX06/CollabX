// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw16tJ6zu5rudBeqj0ua9aF9FJzRw4SM4",
  authDomain: "collabx-a88ad.firebaseapp.com",
  projectId: "collabx-a88ad",
  storageBucket: "collabx-a88ad.appspot.com",
  messagingSenderId: "602018126504",
  appId: "1:602018126504:web:80e447b72405c207f8409d",
  measurementId: "G-LVEN5PSR5S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🟢 Signup Function with Debug Logs
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;
  const university = document.getElementById("signup-university").value;

  // Debug log before saving user details
  console.log("Saving user data:", { name, email, role, university });

  try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Save additional details in Firestore
      await db.collection("users").doc(user.uid).set({
          name,
          email,
          role,
          university,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          console.log("User data saved successfully in Firestore.");
      });

      alert("Signup successful! Please log in.");
      document.getElementById("signup-form").reset();
  } catch (error) {
      alert(error.message);
      console.error("Signup error:", error);
  }
});

// 🔵 Login Function
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      fetchUserData(userCredential.user.uid);
  } catch (error) {
      alert(error.message);
      console.error("Login error:", error);
  }
});

// 🔵 Fetch User Data from Firestore
async function fetchUserData(uid) {
  try {
      const docSnap = await db.collection("users").doc(uid).get();
      if (docSnap.exists) {
          const userData = docSnap.data();
          console.log("Fetched user data:", userData);

          document.getElementById("user-name").innerText = userData.name || "N/A";
          document.getElementById("user-email").innerText = userData.email || "N/A";
          document.getElementById("user-role").innerText = userData.role || "N/A";
          document.getElementById("user-university").innerText = userData.university || "N/A";

          document.getElementById("dashboard").style.display = "block";
          document.getElementById("login-container").style.display = "none";
          document.getElementById("signup-container").style.display = "none";
      } else {
          console.warn("No user data found!");
      }
  } catch (error) {
      console.error("Error fetching user data:", error);
  }
}

// 🔴 Google Sign-In with Debug Logs
document.getElementById("google-login").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
      const result = await auth.signInWithPopup(provider);

      // Debug Log
      console.log("Google Sign-in successful:", result.user);

      // Save user to Firestore if not already present
      const userRef = db.collection("users").doc(result.user.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
          await userRef.set({
              name: result.user.displayName,
              email: result.user.email,
              role: "student", // Default role, update as needed
              university: "Not provided",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
              console.log("Google user data saved to Firestore.");
          });
      }

      fetchUserData(result.user.uid);
  } catch (error) {
      alert(`Google Sign-in failed: ${error.message}`);
      console.error("Google Sign-in error:", error);
  }
});

// 🟣 Logout Function
document.getElementById("logout").addEventListener("click", async () => {
  try {
      await auth.signOut();
      console.log("User logged out successfully.");

      document.getElementById("dashboard").style.display = "none";
      document.getElementById("login-container").style.display = "block";
      document.getElementById("signup-container").style.display = "block";
  } catch (error) {
      console.error("Logout error:", error);
  }
});
