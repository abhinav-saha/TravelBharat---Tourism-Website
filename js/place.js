/* ==========================================================================
   TravelBharat — STATE DETAILS LOGIC (place.js)
   Reads the state id from the URL, loads that state's details from
   states.json, then loads its tourist places from places.json and
   renders them on pages/place.html.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    function updateLoginButton() {
    const loginButton = document.getElementById('login-btn');

    if (!loginButton) {
        return;
    }

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        return;
    }

    const username = loggedInUser.name || 'Traveler';

    loginButton.textContent = `👋 Hey, ${username}`;
    loginButton.href = 'dashboard.html';
    loginButton.title = 'Go to Dashboard';
}

function getDashboardPath() {
    return 'dashboard.html';
}
 updateLoginButton();

    const loadingMessage = document.getElementById('loading-message');

    /* ---------- Only Run On Pages With The Required Elements ---------- */
    if (!loadingMessage) {
        return;
    }

    initPlacePage();
});

/* ==========================================================================
   INITIALIZE PAGE
   ========================================================================== */
async function initPlacePage() {
    const stateId = getStateIdFromUrl();

    if (stateId === null) {
        showError('Invalid or missing state ID.');
        return;
    }

    const state = await fetchStateById(stateId);

    if (!state) {
        showError('State not found.');
        return;
    }

    renderStateDetails(state);
    hideLoading();

    const places = await fetchPlacesByStateId(state.id);
    renderPlaces(places);
}

/* ==========================================================================
   READ AND VALIDATE THE "id" URL PARAMETER
   ========================================================================== */
function getStateIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        return null;
    }

    const stateId = Number(idParam);

    if (Number.isNaN(stateId) || stateId <= 0) {
        return null;
    }

    return stateId;
}

/* ==========================================================================
   FETCH AND FIND THE SELECTED STATE
   ========================================================================== */
async function fetchStateById(stateId) {
    try {
        const response = await fetch('../data/states.json');

        if (!response.ok) {
            throw new Error('Failed to fetch states.json');
        }

        const states = await response.json();
        return states.find((state) => state.id === stateId) || null;
    } catch (error) {
        showError('Unable to load state details. Please try again later.');
        return null;
    }
}

/* ==========================================================================
   FETCH AND FILTER TOURIST PLACES FOR THE SELECTED STATE
   ========================================================================== */
async function fetchPlacesByStateId(stateId) {
    try {
        const response = await fetch('../data/places.json');

        if (!response.ok) {
            throw new Error('Failed to fetch places.json');
        }

        const places = await response.json();
        return places.filter((place) => place.stateId === stateId);
    } catch (error) {
        showError('Unable to load tourist places. Please try again later.');
        return [];
    }
}

/* ==========================================================================
   WISHLIST FUNCTIONALITY (uses getWishlist() / saveWishlist() from storage.js)
   ========================================================================== */

/* ---------- Check If A Place Is Already Wishlisted ---------- */
function isWishlisted(placeId) {
    const wishlist = getWishlist();
    return wishlist.some((id) => id === placeId);
}

/* ---------- Add Or Remove A Place From The Wishlist ---------- */
function toggleWishlist(placeId) {
    const wishlist = getWishlist();
    const existingIndex = wishlist.findIndex((id) => id === placeId);

    if (existingIndex === -1) {
        wishlist.push(placeId);
    } else {
        wishlist.splice(existingIndex, 1);
    }

    saveWishlist(wishlist);
    return isWishlisted(placeId);
}

/* ---------- Build The Wishlist Heart Button Markup ---------- */
function createWishlistButton(placeId) {
    const wishlisted = isWishlisted(placeId);
    const icon = wishlisted ? '❤️' : '🤍';

    return `
        <button
            type="button"
            class="place-card__wishlist-btn"
            data-wishlist-id="${placeId}"
            aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
        >${icon}</button>
    `;
}

/* ---------- Handle Wishlist Button Clicks (event delegation) ---------- */
function handleWishlistClick(event) {
    const wishlistButton = event.target.closest('[data-wishlist-id]');

    if (!wishlistButton) {
        return;
    }

    const placeId = Number(wishlistButton.getAttribute('data-wishlist-id'));
    const wishlisted = toggleWishlist(placeId);

    wishlistButton.textContent = wishlisted ? '❤️' : '🤍';
    wishlistButton.setAttribute('aria-label', wishlisted ? 'Remove from wishlist' : 'Add to wishlist');
}
/* ==========================================================================
   RENDER STATE HERO DETAILS
   ========================================================================== */
function renderStateDetails(state) {
    const bannerImage = document.getElementById('state-banner');
    const nameHeading = document.getElementById('state-name');
    const capitalText = document.getElementById('state-capital');
    const descriptionText = document.getElementById('state-description');

    if (bannerImage) {
        bannerImage.src = state.bannerImage || state.image || '';
        bannerImage.alt = state.name || '';
    }

    if (nameHeading) {
        nameHeading.textContent = state.name || '';
    }

    if (capitalText) {
        capitalText.textContent = state.capital ? `Capital: ${state.capital}` : '';
    }

    if (descriptionText) {
        descriptionText.textContent = state.description || '';
    }
}

/* ==========================================================================
   RENDER TOURIST PLACE CARDS — UPDATED (wires up wishlist click delegation)
   ========================================================================== */
function renderPlaces(places) {
    const placesContainer = document.getElementById('places-container');

    if (!placesContainer) {
        return;
    }

    if (!places.length) {
        placesContainer.innerHTML = '<p class="tourist-places__empty-message" id="places-empty-message">No tourist places available.</p>';
        return;
    }

    const cardsMarkup = places.map(createPlaceCardMarkup).join('');
    placesContainer.innerHTML = cardsMarkup;

    placesContainer.addEventListener('click', handleWishlistClick);
}
/* ==========================================================================
   BUILD A SINGLE PLACE CARD (returns HTML string)
   ========================================================================== */
/* ==========================================================================
   BUILD A SINGLE PLACE CARD (returns HTML string) — UPDATED
   ========================================================================== */
function createPlaceCardMarkup(place) {
    return `
        <article class="place-card" data-place-id="${place.id}">
            <div class="place-card__image-wrapper">
                <img src="${place.image}" alt="${place.name}" class="place-card__image">
                ${createWishlistButton(place.id)}
            </div>
            <h3 class="place-card__name">${place.name}</h3>
            <p class="place-card__description">${place.shortDescription}</p>
            <p class="place-card__location">${place.location}</p>
            <p class="place-card__rating">Rating: ${place.rating}</p>
        </article>
    `;
}
/* ==========================================================================
   HIDE THE LOADING MESSAGE
   ========================================================================== */
function hideLoading() {
    const loadingMessage = document.getElementById('loading-message');

    if (loadingMessage) {
        loadingMessage.hidden = true;
    }
}

/* ==========================================================================
   SHOW A USER-FRIENDLY ERROR MESSAGE
   ========================================================================== */
function showError(message) {
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    if (loadingMessage) {
        loadingMessage.hidden = true;
    }

    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }
}