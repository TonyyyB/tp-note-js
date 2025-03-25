import Provider from "./provider.js";
document.addEventListener("DOMContentLoaded", () => {
    let caroussel;
    function handleNavigation() {
        const hash = window.location.hash.substring(1).split("/")[0] || "listing";
        const arg = window.location.hash.substring(1).split("/")[1];
        loadView(hash, arg);
    }

    function handleViewLogic(view, arg) {
        if (caroussel) {
            clearInterval(caroussel);
            caroussel = undefined;
        }
        if (view === "listing") {
            displayChampions();
        } else if (view === "detail") {
            loadCharacterDetails(arg);
        } else if (view === "favori") {
            displayFavorites();
        }
        else if (view === "items") {
            displayItems();
        }
    }

    async function loadCharacterDetails(arg) {
        const champion = await Provider.fetchChampion(arg);
        const container = document.getElementById("character-details");
        container.innerHTML = "";
        container.appendChild(await champion.renderDetail());
        caroussel = setInterval(() => {
            champion.nextSkin();
        }, 5000);
    }

    async function displayFavorites() {
        const championsId = await Provider.getFavorites();
        const containerFav = document.getElementById("favorites-container");
        containerFav.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));';
        containerFav.innerHTML = "";
        championsId.forEach(async championId => {
            let champion = await Provider.fetchChampion(championId.id);
            let buttonRemove = document.createElement("button");
            buttonRemove.textContent = "Supprimer";
            buttonRemove.onclick = () => {
                Provider.removeFavori(championId.id);
                handleNavigation();
            }
            containerFav.appendChild(await champion.renderCardFav());
            containerFav.appendChild(buttonRemove);
        })
    }


    async function displayChampions() {
        const champions = await Provider.fetchChampions();
        const listContainer = document.getElementById("character-list");
        listContainer.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));';
    
        
        async function renderList(filteredChampions) {
            listContainer.innerHTML = "";
            for (const champion of filteredChampions) {
                listContainer.appendChild(await champion.renderCard());
            }
        }
    
        
        await renderList(champions);
    
        
        const searchInput = document.getElementById("search");
        searchInput.addEventListener("input", async (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = champions.filter(champ => champ.name.toLowerCase().includes(searchTerm));
            await renderList(filtered);
        });
    
        
        const boutton = document.getElementById("favoris");
        boutton.onclick = () => {
            window.location.hash = `favori/`;
        }
    }
    

    async function displayItems() {
        const items = await Provider.fetchItems();
        const listContainerItem = document.getElementById("item-list");
        listContainerItem.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));';
        items.forEach(async item => {
            listContainerItem.appendChild(await item.renderCard());
        });
    }

    async function loadView(view, arg) {
        try {
            const response = await fetch(`views/${view}.html`);
            const html = await response.text();
            document.getElementById("app").innerHTML = html;
            handleViewLogic(view, arg);
        } catch (error) {
            document.getElementById("app").innerHTML = "<p>Erreur de chargement.</p>";
        }
    }

    window.addEventListener("hashchange", handleNavigation);
    handleNavigation();
});