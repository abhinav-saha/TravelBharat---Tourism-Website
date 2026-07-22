/* ==========================================================================
   TravelBharat — DASHBOARD LOGIC (dashboard.js)
   Guards pages/dashboard.html behind login, displays the logged-in
   user's name and wishlist count, and handles logout. Relies on
   storage.js for all Local Storage access (getLoggedInUser, logoutUser,
   getWishlist).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

/* ==========================================================================
   INITIALIZE DASHBOARD
   ========================================================================== */
function initializeDashboard() {
    const loggedInUser = getLoggedInUser();

    /* ---------- Redirect Immediately If No User Is Logged In ---------- */
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    displayUsername(loggedInUser);
    displayWishlistCount();
    setupLogout();
}

/* ==========================================================================
   DISPLAY LOGGED-IN USERNAME
   ========================================================================== */
function displayUsername(user) {
    try {
        const usernameElement = document.getElementById('dashboard-username');

        if (usernameElement) {
            usernameElement.textContent = user.name || '';
        }
    } catch (error) {
        return;
    }
}

/* ==========================================================================
   DISPLAY WISHLIST COUNT
   ========================================================================== */
function displayWishlistCount() {
    try {
        const wishlistCountElement = document.getElementById('wishlist-count');

        if (!wishlistCountElement) {
            return;
        }

        const wishlist = getWishlist();
        wishlistCountElement.textContent = wishlist.length;
    } catch (error) {
        return;
    }
}

/* ==========================================================================
   SETUP LOGOUT BUTTON
   ========================================================================== */
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener('click', handleLogout);
}

/* ==========================================================================
   HANDLE LOGOUT BUTTON CLICK
   ========================================================================== */
function handleLogout() {
    logoutUser();
    window.location.href = '../index.html';
}