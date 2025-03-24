document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorMessage = document.getElementById("errorMessage");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    alert("Signup successful!");
    window.location.href = "welcome.html"; // Redirect to a welcome page (optional)
});
