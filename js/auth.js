/* ==========================================================================
   TravelBharat — AUTHENTICATION LOGIC (auth.js)
   Handles registration, login, validation, redirection and password
   visibility toggles. Relies on storage.js for all Local Storage access
   (getUsers, saveUsers, saveLoggedInUser, getLoggedInUser, logoutUser).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Redirect If Already Logged In ---------- */
    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        window.location.replace('../index.html');
        return;
    }


    /* ---------- Element References ---------- */
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    /* ---------- Wire Up Register Form ---------- */
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    /* ---------- Wire Up Login Form ---------- */
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    /* ---------- Wire Up Password Toggle Buttons ---------- */
    const toggleButtons = document.querySelectorAll('.auth-form__toggle-password');
    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => togglePasswordVisibility(button));
    });

});

/* ==========================================================================
   REGISTER HANDLER
   ========================================================================== */
function handleRegister(event) {
    event.preventDefault();
    const registerForm = event.target;
    /* ---------- Read Field Values ---------- */
    const nameInput = document.getElementById('register-fullname');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    /* ---------- Required Field Validation ---------- */
    if (!name || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        return;
    }

    /* ---------- Email Format Validation ---------- */
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    /* ---------- Password Length Validation ---------- */
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    /* ---------- Password Match Validation ---------- */
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    /* ---------- Duplicate Email Validation ---------- */
    const existingUsers = getUsers();
    const emailExists = existingUsers.some((user) => user.email.trim().toLowerCase() === email.trim().toLowerCase());

    if (emailExists) {
        alert('An account with this email already exists.');
        return;
    }

    /* ---------- Create And Store New User ---------- */
    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    existingUsers.push(newUser);
    saveUsers(existingUsers);

    /* ---------- Success Feedback And Redirect ---------- */
    alert('Account created successfully!');
    registerForm.reset();
    window.location.replace("login.html");
}

/* ==========================================================================
   LOGIN HANDLER
   ========================================================================== */
function handleLogin(event) {
    event.preventDefault();
      const loginForm = event.target;
    /* ---------- Read Field Values ---------- */
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    /* ---------- Required Field Validation ---------- */
    if (!email || !password) {
        alert('Email and password are required.');
        return;
    }

    /* ---------- Match Against Stored Users ---------- */
    const users = getUsers();
    const matchedUser = users.find(
        (user) => user.email.trim().toLowerCase() === email.trim().toLowerCase() && user.password === password
    );

    /* ---------- Success Or Failure Feedback ---------- */
    if (matchedUser) {
        saveLoggedInUser(matchedUser);
        alert('Login Successful!');
        loginForm.reset();
           window.location.replace('../index.html');
    } else {
        alert('Invalid email or password.');
    }
}

/* ==========================================================================
   PASSWORD VISIBILITY TOGGLE
   ========================================================================== */
function togglePasswordVisibility(button) {
    const wrapper = button.closest('.auth-form__password-wrapper');
    if (!wrapper) {
        return;
    }

    const passwordInput = wrapper.querySelector('.auth-form__input--password');
    if (!passwordInput) {
        return;
    }

    const isPasswordHidden = passwordInput.type === 'password';
    passwordInput.type = isPasswordHidden ? 'text' : 'password';
    button.setAttribute('aria-label', isPasswordHidden ? 'Hide password' : 'Show password');
}

/* ==========================================================================
   EMAIL FORMAT VALIDATION HELPER
   ========================================================================== */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}