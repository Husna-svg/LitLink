document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("errorMessage");

    if (username === "admin" && password === "password123") {
        alert("Login successful!");
        // window.location.href = "dashboard.html"; Redirect to a dashboard (optional)
    } else {
        errorMessage.textContent = "Invalid username or password.";
    }
});
