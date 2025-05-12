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

// Function to show success or error message
function showMessage(message, isSuccess = true) {
    // Create the message element
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.textContent = message;

    // Apply success or error styles
    if (isSuccess) {
        messageBox.classList.add("success-message");
    } else {
        messageBox.classList.add("error-message");
    }

    // Append the message to the body
    document.body.appendChild(messageBox);

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

// Handle login event
document.getElementById('loginbtn').addEventListener("click", async function (event) {
    event.preventDefault();

    const loginButton = document.getElementById('loginbtn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage("Please fill in both email and password fields.", false);
        return;
    }

    // Set the button to loading state
    loginButton.disabled = true;
    loginButton.textContent = "Processing...";
    loginButton.classList.add("loading");

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

            showMessage(`Welcome, ${username}!`);

            // Redirect to the homepage after 3 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        } else {
            showMessage("User data not found.", false);
        }
    } catch (error) {
        console.error("Login Error:", error.code, error.message);
        showMessage(`Login failed: ${error.message}`, false);
    } finally {
        // Reset the button state
        loginButton.disabled = false;
        loginButton.textContent = "Login";
        loginButton.classList.remove("loading");
    }
});

// Logout functionality
document.addEventListener("DOMContentLoaded", function () {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const logoutNav = document.getElementById("logoutNav");

    // Check if the user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
        loginNav.style.display = "none"; // Hide "Log In"
        userNav.style.display = "inline"; // Show username
        logoutNav.style.display = "inline"; // Show "Log Out"
    } else {
        loginNav.style.display = "inline"; // Ensure "Log In" is visible
        userNav.style.display = "none"; // Hide username
        logoutNav.style.display = "none"; // Hide "Log Out"
    }

    // Ensure Home and Shop buttons are always visible
    const homeNav = document.querySelector(".homepage");
    const shopNav = document.querySelector(".shop");

    if (homeNav) homeNav.style.display = "inline";
    if (shopNav) shopNav.style.display = "inline";

    // Logout functionality
    logoutNav.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            await signOut(auth);
            localStorage.removeItem("loggedInUser"); // Clear stored username
            showMessage("You have been logged out.");
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect to home page
            }, 3000);
        } catch (error) {
            console.error("Logout Error:", error.message);
            showMessage(`Logout failed: ${error.message}`, false);
        }
    });
});