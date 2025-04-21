// js/profile.js

// Footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').innerText = currentYear;
});

// Navbar (No significant changes needed for fetching data)
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('menu-open');
        });
    }

    // No changes to the dropdown logic as you are not using Firebase Auth for login state here.
});

// Firebase Initialization (Ensure it's the same as in script.js)
const firebaseConfig = {
    apiKey: "AIzaSyDN1JJgie7zha14P-6L04M6a_XOFO5tkC0",
    authDomain: "sait-connect-84b33.firebaseapp.com",
    databaseURL: "https://sait-connect-84b33-default-rtdb.firebaseio.com",
    projectId: "sait-connect-84b33",
    storageBucket: "sait-connect-84b33.firebasestorage.app",
    messagingSenderId: "56723543915",
    appId: "1:56723543915:web:b12fec609c9adee0021e2e",
    measurementId: "G-6PQEQ4SXQP"
  };

let database;

try {
    const app = firebase.initializeApp(firebaseConfig);
    database = firebase.database(app);
    console.log("Firebase initialized successfully on profile.js!");
} catch (error) {
    console.error("Firebase initialization error on profile.js:", error);
    alert("Error initializing Firebase on profile page. Check the console.");
}

// Function to get the user ID from session storage
function getLoggedInUserId() {
    return sessionStorage.getItem('loggedInUserId');
}

// Function to fetch and display user profile data
function fetchUserProfile(userId) {
    if (database && userId) {
        database.ref(`users/${userId}`).once('value')
            .then(snapshot => {
                const userData = snapshot.val();
                if (userData) {
                    console.log("User data fetched for profile:", userData);
                    document.getElementById('name').innerText = `${userData.firstName} ${userData.lastName}`;
                    document.getElementById('pronoun').innerText = userData.pronoun || 'Not specified';
                    document.getElementById('courseName').innerText = userData.course || 'Not specified';
                    document.getElementById('currentYear').innerText = userData.year || 'Not specified';
                    document.getElementById('currentSemester').innerText = userData.semester || 'Not specified';
                    // You can add more fields here to display other user data
                } else {
                    console.log("User data not found for ID:", userId);
                    // Optionally display a message to the user
                }
            })
            .catch(error => {
                console.error("Error fetching user data for profile:", error);
                // Optionally display an error message to the user
            });
    } else {
        console.log("Database not initialized or userId not found in session storage.");
        // Optionally display an error message
    }
}

// Ensure DOM is fully loaded before fetching data
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserId = getLoggedInUserId();
    fetchUserProfile(loggedInUserId);

    // The rest of your profile.js code (image upload, local storage) remains largely the same
    // but it's important to consider if you want to persist this data across different logins.
    // Currently, it uses local storage which is browser-specific and not tied to a specific user in the database.

    // Helper function to handle image upload
    function handleImageUpload(inputElement, imgElementId, storageKey) {
        if (!inputElement || !imgElementId) return;

        inputElement.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgElement = document.getElementById(imgElementId);
                    if (imgElement) {
                        imgElement.src = e.target.result;
                        localStorage.setItem(storageKey, e.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Load image from localStorage if available
        const storedImage = localStorage.getItem(storageKey);
        if (storedImage) {
            const imgElement = document.getElementById(imgElementId);
            if (imgElement) imgElement.src = storedImage;
        }
    }

    // Banner Upload
    const bannerEditBtn = document.getElementById("bannerEditBtn");
    const bannerUpload = document.getElementById("bannerUpload");

    if (bannerEditBtn && bannerUpload) {
        bannerEditBtn.addEventListener("click", () => bannerUpload.click());
        handleImageUpload(bannerUpload, "bannerImage", "bannerImage");
    }

    // Profile Image Upload
    const profileEditBtn = document.getElementById("profileEditBtn");
    const profileUpload = document.getElementById("profileUpload");

    if (profileEditBtn && profileUpload) {
        profileEditBtn.addEventListener("click", () => profileUpload.click());
        handleImageUpload(profileUpload, "profileImage", "profileImage");
    }

    // Real-time editing and saving to local storage
    const editableFields = document.querySelectorAll("[contenteditable='true']");
    editableFields.forEach(field => {
        field.addEventListener("blur", saveProfileData);
    });

    // Load saved data from local storage
    loadProfileData();

    // Ensure default name is displayed
    if (!localStorage.getItem("name")) {
        document.getElementById('name').textContent = "Navraj Ghimire";
    }

    // Keep banner edit button visible on hover
    const bannerContainer = document.querySelector(".banner-container");
    if (bannerContainer && bannerEditBtn) {
        bannerContainer.addEventListener("mouseenter", () => {
            bannerEditBtn.style.opacity = 1;
        });
        bannerContainer.addEventListener("mouseleave", () => {
            bannerEditBtn.style.opacity = 0;
        });

        bannerEditBtn.addEventListener("mouseenter", () => {
            bannerEditBtn.style.opacity = 1;
        });
        bannerEditBtn.addEventListener("mouseleave", () => {
            bannerEditBtn.style.opacity = 0;
        });
    }
});

// Save profile data to local storage
function saveProfileData() {
    const fields = ["name", "pronoun", "courseName", "currentYear", "currentSemester"];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            localStorage.setItem(field, element.innerText);
        }
    });
}

// Load profile data from local storage
function loadProfileData() {
    const fields = ["bannerImage", "profileImage", "name", "pronoun", "courseName", "currentYear", "currentSemester"];
    fields.forEach(field => {
        const storedValue = localStorage.getItem(field);
        if (storedValue) {
            const element = document.getElementById(field);
            if (element) {
                if (field.includes("Image")) {
                    element.src = storedValue;
                } else {
                    element.innerText = storedValue;
                }
            }
        }
    });
}