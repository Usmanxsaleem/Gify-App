const API_KEY = "KDniZyn4wQ27v2gRtdkSUp0bj7b4Zn79";
const BASE_URL = "https://api.giphy.com/v1/gifs";
const results = document.getElementById("results");
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchArea = document.getElementById("searchArea");
const heroTitle = document.getElementById("heroTitle");
const heroSub = document.getElementById("heroSub");
const toastEl = document.getElementById("toast");
const navLinks = document.querySelectorAll(".nav-link");
let currentView = "search";
// ===== Toast =====
function showToast(message, duration = 3000) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), duration);
}
// ===== Skeleton Loading =====
function showSkeletons(count = 12) {
    results.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card";
        results.appendChild(skeleton);
    }
}
// ===== Render GIFs =====
function renderGifs(gifs) {
    results.innerHTML = "";
    if (gifs.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <p>No results found. Try a different keyword.</p>
            </div>
        `;
        return;
    }
    gifs.forEach(function (gif, index) {
        const card = document.createElement("div");
        card.className = "gif-card";
        card.style.animationDelay = index * 0.05 + "s";
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title || "GIF";
        img.loading = "lazy";
        const overlay = document.createElement("div");
        overlay.className = "copy-overlay";
        overlay.innerHTML = "<span>Click to copy URL</span>";
        card.appendChild(img);
        card.appendChild(overlay);
        card.addEventListener("click", function () {
            const url = gif.images.original.url;
            navigator.clipboard.writeText(url).then(function () {
                showToast("GIF URL copied to clipboard!");
            }).catch(function () {
                showToast("Failed to copy URL");
            });
        });
        results.appendChild(card);
    });
}
// ===== Search =====
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const keyword = input.value.trim();
    if (!keyword) {
        showToast("Please enter a search keyword");
        return;
    }
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    showSkeletons();
    fetch(BASE_URL + "/search?api_key=" + API_KEY + "&q=" + encodeURIComponent(keyword) + "&limit=16")
        .then(function (res) {
            if (!res.ok) throw new Error("API error");
            return res.json();
        })
        .then(function (data) {
            renderGifs(data.data);
            if (data.data.length === 0) {
                showToast("No GIFs found for \"" + keyword + "\"");
            }
        })
        .catch(function () {
            results.innerHTML = `
                <div class="empty-state">
                    <p>Something went wrong. Please try again.</p>
                </div>
            `;
            showToast("API error. Please try again later.");
        })
        .finally(function () {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        });
});
// ===== Trending =====
function loadTrending() {
    showSkeletons(16);
    fetch(BASE_URL + "/trending?api_key=" + API_KEY + "&limit=20")
        .then(function (res) {
            if (!res.ok) throw new Error("API error");
            return res.json();
        })
        .then(function (data) {
            renderGifs(data.data);
        })
        .catch(function () {
            results.innerHTML = `
                <div class="empty-state">
                    <p>Failed to load trending GIFs.</p>
                </div>
            `;
            showToast("Failed to load trending GIFs.");
        });
}
// ===== Navigation =====
navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const view = this.getAttribute("data-view");
        if (view === currentView) return;
        currentView = view;
        navLinks.forEach(function (l) { l.classList.remove("active"); });
        this.classList.add("active");
        if (view === "search") {
            heroTitle.textContent = "Find the perfect reaction.";
            heroSub.textContent = "High-quality GIFs sourced directly from Giphy.";
            searchArea.style.display = "block";
            results.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <p>Enter a keyword to start searching</p>
                </div>
            `;
        } else if (view === "trending") {
            heroTitle.textContent = "Trending right now.";
            heroSub.textContent = "The most popular GIFs on the internet today.";
            searchArea.style.display = "none";
            loadTrending();
        }
    });
});
