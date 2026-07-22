/* ==========================================================================
   TravelBharat — EXPLORE STATES LOGIC (app.js)
   Loads data/states.json, renders state cards dynamically, filters them
   via the search input, and navigates to place.html on Explore clicks.
   ========================================================================== */

/* ---------- Module-Level State ---------- */
let allStates = [];

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Update Login/Dashboard Button ---------- */
    updateLoginButton();

    /* ---------- Element References ---------- */
    const statesContainer = document.getElementById('states-container');
    const searchInput = document.getElementById('states-search-input');
    /* ---------- Hero Search Form ---------- */
const heroSearchForm = document.getElementById('hero-search-form');

if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', handleHeroSearch);
}

    /* ---------- Only Run State Logic On Explore Page ---------- */
    if (!statesContainer) {
        return;
    }

    /* ---------- Initial Load ---------- */
    loadStates(statesContainer);

    /* ---------- Wire Up Search Input ---------- */
    if (searchInput) {
        searchInput.addEventListener('input', () =>
            handleSearch(searchInput, statesContainer)
        );
    }

    /* ---------- Explore Button Clicks ---------- */
    statesContainer.addEventListener('click', handleExploreClick);

});

/* ==========================================================================
   LOAD STATES FROM JSON
   ========================================================================== */
async function loadStates(container) {

    const loadingMessage = document.getElementById('states-loading-message');
    const errorMessage = document.getElementById('states-error-message');

    if (loadingMessage) {
        loadingMessage.hidden = false;
    }

    if (errorMessage) {
        errorMessage.hidden = true;
    }

    try {

        const response = await fetch('../data/states.json');

        if (!response.ok) {
            throw new Error('Failed to fetch states.json');
        }

        const states = await response.json();

        allStates = Array.isArray(states) ? states : [];

        renderStates(allStates, container);

    } catch (error) {

        if (errorMessage) {
            errorMessage.hidden = false;
        }

    } finally {

        if (loadingMessage) {
            loadingMessage.hidden = true;
        }

    }
}

/* ==========================================================================
   RENDER STATE CARDS
   ========================================================================== */
function renderStates(states, container) {

    const emptyMessage = document.getElementById('states-empty-message');

    container.innerHTML = '';

    if (!states.length) {

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;
    }

    if (emptyMessage) {
        emptyMessage.hidden = true;
    }

    const cardsMarkup = states
        .map(createStateCardMarkup)
        .join('');

    container.innerHTML = cardsMarkup;
}

/* ==========================================================================
   BUILD A SINGLE STATE CARD
   ========================================================================== */
function createStateCardMarkup(state) {

    return `
        <article class="state-card" data-state-id="${state.id}">
            <div class="state-card__image-wrapper">
                <img
                    src="${state.image}"
                    alt="${state.name}"
                    class="state-card__image"
                    loading="lazy"
                >
            </div>

            <h3 class="state-card__name">${state.name}</h3>

            <p class="state-card__description">
                ${state.description}
            </p>

            <button
                type="button"
                class="btn btn--explore"
                data-explore-id="${state.id}">
                Explore
            </button>
        </article>
    `;
}

/* ==========================================================================
   HANDLE SEARCH
   ========================================================================== */
function handleSearch(searchInput, container) {

    const query = searchInput.value.trim().toLowerCase();

    const filteredStates = allStates.filter((state) =>
        state.name.toLowerCase().includes(query)
    );

    renderStates(filteredStates, container);
}

/* ==========================================================================
   HANDLE EXPLORE BUTTON CLICK
   ========================================================================== */
function handleExploreClick(event) {

    const exploreButton = event.target.closest('[data-explore-id]');

    if (!exploreButton) {
        return;
    }

    const stateId = exploreButton.dataset.exploreId;

    window.location.href = `place.html?id=${stateId}`;
}

/* ==========================================================================
   UPDATE LOGIN BUTTON
   ========================================================================== */
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
    loginButton.href = getDashboardPath();
    loginButton.title = 'Go to Dashboard';
}

/* ==========================================================================
   RESOLVE DASHBOARD PATH
   ========================================================================== */
function getDashboardPath() {

    const isInsidePagesFolder = window.location.pathname.includes('/pages/');

    return isInsidePagesFolder
        ? 'dashboard.html'
        : 'pages/dashboard.html';
}

async function handleHeroSearch(event) { 
    event.preventDefault(); 
    const searchInput = document.getElementById('search-input'); 
    if (!searchInput) {
         return; 
        } 
        const query = searchInput.value.trim().toLowerCase();
         if (!query) {
             return; 
            }
            
            const states = await ensureStatesLoaded();
             const matchedState = states.find((state) => 
                state.name.toLowerCase().includes(query)); 
             
             if (matchedState) 
                {
                     window.location.href = `pages/place.html?id=${matchedState.id}`;
                     } else
                         { alert('State not found. Please enter a valid Indian state.'); } }



                         async function ensureStatesLoaded() { if (allStates.length) { return allStates; } try { 
                            const response = await fetch('data/states.json'); 
                            if (!response.ok) { throw new Error('Failed to fetch states.json'); } const states = await response.json(); allStates = Array.isArray(states) ? states : []; } catch (error) { allStates = []; } return allStates; }