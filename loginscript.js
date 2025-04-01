document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMessage = document.getElementById("errorMessage");

    // Clear previous errors
    errorMessage.textContent = "";

    // Basic validation
    if (!email || !password) {
        errorMessage.textContent = "Both fields are required.";
        return;
    }

    try {
        // Send login request to backend
        let response = await fetch("http://localhost:5001/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        let data = await response.json();

        if (response.ok && data.accessToken) {
            // Store token in localStorage
            localStorage.setItem("token", data.accessToken);
            console.log(data.accessToken); // Debug log
            alert("Login successful!");
            window.location.href = "welcome.html"; // Redirect after login
        } else {
            errorMessage.textContent = data.error || "Invalid email or password.";
        }
    } catch (error) {
        errorMessage.textContent = "Error connecting to server. Try again later.";
        console.error("Login error:", error);
    }
});
