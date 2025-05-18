// Function to validate email format
function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function to validate password format
function validatePassword(password) {
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // At least 8 characters, one uppercase, one lowercase, and one number
    return re.test(String(password));
}

// Login check function
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("psw").value; // Assuming "psw" is the ID of the password input field
    const emailError = document.getElementById('emailError'); // Assuming you have an error element for email
    const passwordError = document.getElementById('passwordError'); // Assuming you have an error element for password
    let valid = true;

    // Validate email
    if (!validateEmail(email)) {
        emailError.textContent = "Invalid email address.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    // Validate password
    if (!validatePassword(password)) {
        passwordError.textContent = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.";
        valid = false;
    } else {
        passwordError.textContent = "";
    }

    // Proceed if all validations are successful
    if (valid) {
        let data = {
            email: email,
            password: password
        };

        // Convert data to JSON format
        data = JSON.stringify(data);
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                const res = JSON.parse(this.responseText);
                if (res.status === 200) {
                    localStorage.user = JSON.stringify(res.user);
                    window.location = "index.html"; // Redirect on successful login
                } else {
                    alert("Invalid credentials, please try again.");
                }
            }
        });

        // Send the login request
        xhr.open("POST", "http://localhost:4000/login");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    }
});
