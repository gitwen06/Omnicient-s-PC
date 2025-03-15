import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoKOHczsYxRkn3NWzOl9rV5fb2Lqmtqrg",
    authDomain: "omnicient-s-pc.firebaseapp.com",
    projectId: "omnicient-s-pc",
    storageBucket: "omnicient-s-pc.firebasestorage.app",
    messagingSenderId: "563738483508",
    appId: "1:563738483508:web:45402c24f4b0a3d43ca361",
    measurementId: "G-NJ2PGRMC1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle login event
document.getElementById('loginbtn').addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch the username from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const username = userDoc.data().username;

            // Store username in localStorage for later use
            localStorage.setItem("loggedInUser", username);

            alert(`Welcome, ${username}!`);
            window.location.href = "index.html"; // Redirect to main page
        } else {
            alert("User data not found.");
        }
    } catch (error) {
        console.error("Login Error:", error.code, error.message);
        alert(`Login failed: ${error.message}`);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const logoutNav = document.getElementById("logoutNav");

    // Check if user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
        loginNav.style.display = "none";  // Hide "Log In"
        userNav.style.display = "inline"; // Show username
        logoutNav.style.display = "inline"; // Show "Log Out"
    } else {
        logoutNav.style.display = "none"; // Hide logout button if no user
    }

    // Logout functionality
    logoutNav.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            await signOut(auth);
            localStorage.removeItem("loggedInUser"); // Clear stored username
            alert("You have been logged out.");
            window.location.href = "index.html"; // Redirect to home page
        } catch (error) {
            console.error("Logout Error:", error.message);
            alert(`Logout failed: ${error.message}`);
        }
    });
});