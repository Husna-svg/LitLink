document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let name = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let location = document.getElementById("location").value.trim();
    let errorMessage = document.getElementById("errorMessage");
    let successMessage = document.getElementById("successMessage");

    errorMessage.textContent = ""; // Clear previous error
    successMessage.textContent = ""; // Clear previous success message

    // 🔹 Validation Checks
    if (!name || !email || !password || !confirmPassword || !location) {
        errorMessage.textContent = "All fields are required.";
        return;
    }
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }
    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    try {
        // 🔹 Send data to backend
        const response = await fetch("http://localhost:5001/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, location })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Signup failed. Please try again.");
        }

        // 🔹 Display success message
        successMessage.textContent = "Signup successful! Redirecting to login...";
        setTimeout(() => {
            window.location.href = "login.html"; // Redirect after signup
        }, 2000);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

