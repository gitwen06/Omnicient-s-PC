document.addEventListener("DOMContentLoaded", function () {
    const usernameDisplay = document.getElementById("usernameDisplay");
    const loginNav = document.getElementById("loginNav");
    const userNav = document.getElementById("userNav");
    const logoutNav = document.getElementById("logoutNav")

    // Retrieve username from localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        loginNav.style.display ="inline";
        userNav.style.display ="none";
        logoutNav.style.display="none";
    }

    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
        loginNav.style.display = "none";  // Hide "Log In"
        userNav.style.display = "inline"; // Show username
        logoutNav.style.display = "inline";
    }

    // Logout functionality
    logoutNav.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser"); // Clear stored username
        window.location.href = "index.html"; // Reload page
    });
});
