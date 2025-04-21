// js/script.js

// Initialize Firebase (replace with your actual Firebase configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDN1JJgie7zha14P-6L04M6a_XOFO5tkC0",
  authDomain: "sait-connect-84b33.firebaseapp.com",
  databaseURL: "https://sait-connect-84b33-default-rtdb.firebaseio.com",
  projectId: "sait-connect-84b33",
  storageBucket: "sait-connect-84b33.firebasestorage.app",
  messagingSenderId: "56723543915",
  appId: "1:56723543915:web:b12fec609c9adee0021e2e",
};

let database; // Declare database outside the try block

try {
  const app = firebase.initializeApp(firebaseConfig);
  database = firebase.database(app); // Initialize database with the app
  console.log("Firebase initialized successfully!");
} catch (error) {
  console.error("Firebase initialization error:", error);
  alert("Error initializing Firebase. Please check the console for details.");
  // Optionally, you could disable the login button or prevent further Firebase attempts
  // loginButton.disabled = true;
}

document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("loading-video");
  var authContainer = document.getElementById("auth-container");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var loginButton = document.getElementById("login-button");

  // Ensure login/signup window is completely hidden on page load
  authContainer.style.display = "none";
  authContainer.style.opacity = "0";
  authContainer.style.visibility = "hidden";

  // Listen for when the video ends
  video.addEventListener("ended", function () {
    authContainer.style.display = "flex"; // Make visible (you might need to adjust to "block" depending on your CSS)
    authContainer.style.visibility = "visible";
    authContainer.classList.add("fade-in"); // Apply animation (make sure this class exists in your CSS)
  });

  // Add event listener for the Login button
  loginButton.addEventListener('click', function() {
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log("Login button clicked!");
    console.log("Entered email:", email);
    console.log("Entered password:", password);

    if (database) { // Only proceed if database is successfully initialized
      database.ref('users').orderByChild('email').equalTo(email).once('value')
        .then(snapshot => {
          console.log("Snapshot exists:", snapshot.exists());
          console.log("Snapshot value:", snapshot.val());

          if (snapshot.exists()) {
            const users = snapshot.val();
            let userFound = false;
            let loggedInUserId = null; // Store the logged-in user's ID
            for (const userId in users) {
              if (users.hasOwnProperty(userId)) {
                const storedPassword = users[userId].password;
                console.log("Stored password for user", userId, ":", storedPassword);
                console.log("Passwords match:", storedPassword === password);
                if (storedPassword === password) {
                  userFound = true;
                  loggedInUserId = userId; // Capture the userId
                  console.log("Passwords match! Redirecting to connect.html");
                  sessionStorage.setItem('loggedInUserId', loggedInUserId); // Store userId in session storage
                  window.location.href = "connect.html";
                  break; // Exit the loop once a match is found
                }
              }
            }
            if (!userFound) {
              console.log("Incorrect email or password.");
              alert("Incorrect email or password.");
            }
          } else {
            console.log("User with this email not found.");
            alert("User with this email not found.");
          }
        })
        .catch(error => {
          console.error("Error querying database:", error);
          alert("An error occurred during login.");
        });
    } else {
      alert("Firebase database not initialized. Check the console for errors.");
    }
  });
});

// Redirect to signup.html when the Sign Up button is clicked (no changes needed here)
function redirectToSignup() {
  window.location.href = "signup.html";
}