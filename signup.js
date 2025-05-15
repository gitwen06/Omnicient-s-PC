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

// Function to show success message
function showSuccessMessage(message) {
    // Create the success message element
    const successMessage = document.createElement("div");
    successMessage.classList.add("success-message");
    successMessage.textContent = message;

    // Append the message to the body
    document.body.appendChild(successMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Function to set error message
function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(inputId + '-error');
    input.classList.add('error');
    if (errorDiv) errorDiv.textContent = message;

    // Remove error after 3 seconds
    if (errorDiv) {
        setTimeout(() => {
            clearError(inputId);
        }, 3000);
    }

    // Remove error on focus
    input.addEventListener('focus', function onFocus() {
        clearError(inputId);
        input.removeEventListener('focus', onFocus);
    });
}

// Function to clear error message
function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(inputId + '-error');
    input.classList.remove('error');
    if (errorDiv) errorDiv.textContent = '';
}

// Select the button
const signupbtn = document.getElementById('signupbtn');

signupbtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents form submission

    // Clear all previous errors
    ['username', 'email', 'password', 'repeatpass'].forEach(clearError);

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const repeatpass = document.getElementById('repeatpass').value;

    let hasError = false;

    if (!username) {
        setError('username', 'Username is required.');
        hasError = true;
    }
    if (!email) {
        setError('email', 'Email is required.');
        hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('email', 'Enter a valid email address.');
        hasError = true;
    }
    if (!password) {
        setError('password', 'Password is required.');
        hasError = true;
    } else if (password.length < 6) {
        setError('password', 'Password must be at least 6 characters.');
        hasError = true;
    }
    if (!repeatpass) {
        setError('repeatpass', 'Please confirm your password.');
        hasError = true;
    } else if (password !== repeatpass) {
        setError('repeatpass', 'Passwords do not match.');
        hasError = true;
    }

    if (hasError) return;

    // Set the button to loading state
    signupbtn.disabled = true;
    signupbtn.textContent = "Processing...";
    signupbtn.classList.add("loading");

    // Use Firebase v9+ method
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Store username in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email
            });

            showSuccessMessage("Account created successfully!");

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = "Login.html";
            }, 3000);
        })
        .catch((error) => {
            showSuccessMessage("Error: " + error.message);
        })
        .finally(() => {
            // Reset the button state
            signupbtn.disabled = false;
            signupbtn.textContent = "Sign Up";
            signupbtn.classList.remove("loading");
        });
});

document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('i');
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = "password";
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});
