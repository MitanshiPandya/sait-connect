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

let db;
let allUsersData = []; // Store all fetched users data with their keys

document.addEventListener('DOMContentLoaded', () => {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    console.log("Firebase initialized.");

    // Footer current year update
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').innerText = currentYear;

    // ========================== Realtime Data Fetching ==========================
    const usersRef = db.ref("users");
    console.log("Listening for user data changes...");

    usersRef.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log("Firebase data snapshot received:", data);
        if (data) {
            allUsersData = Object.entries(data).map(([key, value]) => ({ id: key, ...value })); // Store key with user data
            console.log("User data processed with keys:", allUsersData);
            displayAllUsers(allUsersData, "resultContainer");
        } else {
            console.log("No user data available in Firebase.");
            document.getElementById("resultContainer").innerHTML = "<p>No users data available.</p>";
            document.getElementById("resultContainerDropdown").innerHTML = "";
        }
    }, (error) => {
        console.error("Error fetching user data:", error);
        document.getElementById("resultContainer").innerHTML = "<p>Error loading user data.</p>";
        document.getElementById("resultContainerDropdown").innerHTML = "<p>Error loading user data.</p>";
    });

    // ========================== Search Function by First Name ==========================
    window.searchByName = function() {
        const name = document.getElementById('searchInput').value.toLowerCase();
        console.log("Search initiated for name:", name);
        const results = allUsersData.filter(user => {
            const match = user.firstName && user.firstName.toLowerCase().startsWith(name);
            console.log("Checking user:", user, " - Match:", match);
            return match;
        });
        console.log("Search results:", results);
        displayResultsByName(results, "resultContainer");
    };

    // ========================== Search Function by Year ==========================
    window.searchByYear = function() {
        const year = document.getElementById('studentDropdown').value;
        console.log("Search initiated for year:", year);
        const results = allUsersData.filter(user => user.year === year);
        console.log("Search results by year:", results);
        displayResultsByYear(results, "resultContainer");
    };

    // ========================== Function to Display All Users (Initially) ==========================
    function displayAllUsers(users, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        console.log("Displaying all users:", users, "in container:", containerId);
        if (users.length === 0) {
            container.innerHTML = "<p>No users available.</p>";
            return;
        }
        let resultHTML = "<ul>";
        users.forEach(user => {
            const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.lastName || 'Unknown';
            resultHTML += `
                <li>
                    <a href="student.html?id=${user.id}" style="color: blue; text-decoration: none;">
                        ${displayName}
                    </a>
                </li>`;
        });
        resultHTML += "</ul>";
        container.innerHTML = resultHTML;
    }

    // ========================== Function to Display Results by name (Unique Names & Hyperlinked) ========
    function displayResultsByName(results, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        console.log("Displaying search results by name:", results, "in container:", containerId);

        if (results.length === 0) {
            container.innerHTML = "<p>No results found</p>";
            return;
        }

        let seenNames = new Set();
        let uniqueResults = results.filter(user => {
            const searchableName = user.firstName || user.lastName;
            const isUnique = searchableName && !seenNames.has(searchableName);
            if (searchableName) seenNames.add(searchableName);
            return isUnique;
        });
        console.log("Unique search results by name:", uniqueResults);

        let resultHTML = "<ul>";
        uniqueResults.forEach(user => {
            const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.lastName || 'Unknown';
            resultHTML += `
                <li>
                    <a href="student.html?id=${user.id}" style="color: blue; text-decoration: none;">
                        ${displayName}
                    </a>
                </li>`;
        });
        resultHTML += "</ul>";
        container.innerHTML = resultHTML;
    }

    // ========================== Function to Display Year-Based Results ==========================
    function displayResultsByYear(results, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        console.log("Displaying search results by year:", results, "in container:", containerId);

        if (results.length === 0) {
            container.innerHTML = `<p>No users found for the selected year.</p>`;
            return;
        }

        let uniqueUsers = [];
        let seenNames = new Set();

        results.forEach(user => {
            const searchableName = user.firstName || user.lastName;
            if (searchableName && !seenNames.has(searchableName)) {
                seenNames.add(searchableName);
                uniqueUsers.push(user);
            }
        });
        console.log("Unique search results by year:", uniqueUsers);

        let resultHTML = `<ul>`;
        uniqueUsers.forEach(user => {
            const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.lastName || 'Unknown';
            resultHTML += `
                <li>
                    <a href="student.html?id=${user.id}" style="color: blue; text-decoration: none;">
                        ${displayName}
                    </a>
                </li>`;
        });
        resultHTML += "</ul>";
        container.innerHTML = resultHTML;
    }

    // Function to clear input fields and search results
    window.clearSearchResults = function(inputId, resultContainerId) {
        document.getElementById(inputId).value = "";
        document.getElementById(resultContainerId).innerHTML = "";
    };

    // ========================== Function to Display FILTER Based Results ==========================
    window.searchDropdown = function() {
        const course = document.getElementById("courseDropdown").value;
        const year = document.getElementById("yearDropdown").value;
        const semester = document.getElementById("semesterDropdown").value;
        const subject = document.getElementById("subjectDropdown").value;
        const container = document.getElementById("resultContainerDropdown");
        container.innerHTML = "";
        console.log("Initiating dropdown search - Course:", course, "Year:", year, "Semester:", semester, "Subject:", subject);

        let filteredResults = allUsersData;

        if (course) {
            filteredResults = filteredResults.filter(user => user.course === course);
        }
        if (year) {
            filteredResults = filteredResults.filter(user => user.year === year);
        }
        if (semester) {
            filteredResults = filteredResults.filter(user => user.semester === semester);
        }
        if (subject) {
            filteredResults = filteredResults.filter(user => user.subject === subject);
        }
        console.log("Dropdown search results:", filteredResults);
        displayDropdownResults(filteredResults, "resultContainerDropdown");
    };

    // ========================== Function to Display Dropdown Based Results ==========================
    function displayDropdownResults(results, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        console.log("Displaying dropdown search results:", results, "in container:", containerId);

        if (results.length === 0) {
            container.innerHTML = "<p>No users found for the selected criteria.</p>";
            return;
        }

        let uniqueUsers = [];
        let seenNames = new Set();

        results.forEach(user => {
            const searchableName = user.firstName || user.lastName;
            if (searchableName && !seenNames.has(searchableName)) {
                seenNames.add(searchableName);
                uniqueUsers.push(user);
            }
        });
        console.log("Unique dropdown search results:", uniqueUsers);

        let resultHTML = "<ul>";
        uniqueUsers.forEach(user => {
            const displayName = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.lastName || 'Unknown';
            resultHTML += `
                <li>
                    <a href="student.html?id=${user.id}" style="color: blue; text-decoration: none;">
                        ${displayName}
                    </a>
                </li>`;
        });
        resultHTML += "</ul>";
        container.innerHTML = resultHTML;
    }

    // Function to clear all dropdown filters and results
    window.clearSearchFilters = function() {
        document.getElementById("courseDropdown").value = "";
        document.getElementById("yearDropdown").value = "";
        document.getElementById("semesterDropdown").value = "";
        document.getElementById("subjectDropdown").value = "";
        document.getElementById("resultContainerDropdown").innerHTML = "";
    };
});