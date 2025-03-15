import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app); // Correct way to get authentication
const db = getFirestore(app); 

// Select the button
const signupbtn = document.getElementById('signupbtn');

signupbtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const repeatpass = document.getElementById('repeatpass').value;

    if (password !== repeatpass) {
        alert("Passwords do not match!");
        return;
    }

    // Use Firebase v9+ method
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;

        // Store username in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email
        });

        alert("Account created successfully!");
        window.location.href = "Login.html"; // Redirect to login page
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
});
;
