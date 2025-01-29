// 🔥 Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🟢 Signup Function
document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save additional user details in Firestore
            return db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                role: "student" // Default role
            });
        })
        .then(() => {
            alert("Signup successful! Please log in.");
            document.getElementById("signup-form").reset();
        })
        .catch((error) => alert(error.message));
});

// 🔵 Login Function
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            fetchUserData(userCredential.user.uid);
        })
        .catch((error) => alert(error.message));
});

// 🔴 Google Sign-In
document.getElementById("google-login").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then((result) => {
            fetchUserData(result.user.uid);
        })
        .catch((error) => alert(error.message));
});

// 🟡 Fetch User Data from Firestore and Update UI
function fetchUserData(uid) {
    db.collection("users").doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                document.getElementById("user-name").innerText = doc.data().name;
                document.getElementById("user-email").innerText = doc.data().email;

                document.getElementById("dashboard").style.display = "block";
                document.getElementById("login-container").style.display = "none";
                document.getElementById("signup-container").style.display = "none";
            }
        })
        .catch((error) => console.error("Error fetching user data:", error));
}

// 🟣 Logout Function
document.getElementById("logout").addEventListener("click", () => {
    auth.signOut().then(() => {
        document.getElementById("dashboard").style.display = "none";
        document.getElementById("login-container").style.display = "block";
        document.getElementById("signup-container").style.display = "block";
    });
});
