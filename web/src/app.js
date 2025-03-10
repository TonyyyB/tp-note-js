import { fetchChampions } from "./provider.js";
document.addEventListener("DOMContentLoaded", () => {
    function handleNavigation() {
        const hash = window.location.hash.substring(1) || "listing";
        loadView(hash);
    }

    function handleViewLogic(view) {
        if (view === "listing") {
            displayChampions();
        } else if (view === "detail") {
            loadCharacterDetails();
        } else if (view === "favorites") {
            displayFavorites();
        }
    }

    async function displayChampions() {
        const champions = await fetchChampions();
        const listContainer = document.getElementById("character-list");
        console.log(champions);
        listContainer.innerHTML = "salut";
    }

    async function loadView(view) {
        try {
            const response = await fetch(`views/${view}.html`);
            const html = await response.text();
            document.getElementById("app").innerHTML = html;
            handleViewLogic(view);
        } catch (error) {
            document.getElementById("app").innerHTML = "<p>Erreur de chargement.</p>";
        }
    }

    window.addEventListener("hashchange", handleNavigation);
    handleNavigation();
});