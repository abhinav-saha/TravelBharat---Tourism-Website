/* ==========================================================================
   TravelBharat — LOCAL STORAGE HELPERS (storage.js)
   Centralized Local Storage logic. auth.js, app.js and admin.js should
   use these functions instead of touching localStorage directly.
   ========================================================================== */

/* ---------- Storage Keys ---------- */
const USERS_KEY = 'travelbharat_users';
const LOGGED_IN_USER_KEY = 'travelbharat_logged_in_user';
const WISHLIST_KEY = 'travelbharat_wishlist';

/* ---------- Save the array of registered users ---------- */
function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        return;
    }
}

/* ---------- Get the array of registered users ---------- */
function getUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        return [];
    }
}

/* ---------- Save the currently logged in user ---------- */
function saveLoggedInUser(user) {
    try {
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    } catch (error) {
        return;
    }
}

/* ---------- Get the currently logged in user ---------- */
function getLoggedInUser() {
    try {
        const user = localStorage.getItem(LOGGED_IN_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
}

/* ---------- Remove the currently logged in user ---------- */
function logoutUser() {
    try {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
    } catch (error) {
        return;
    }
}

/* ---------- Save the wishlist array ---------- */
function saveWishlist(wishlist) {
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
        return;
    }
}

/* ---------- Get the wishlist array ---------- */
function getWishlist() {
    try {
        const wishlist = localStorage.getItem(WISHLIST_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        return [];
    }
}