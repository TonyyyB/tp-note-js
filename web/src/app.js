import Provider from "./provider.js";
document.addEventListener("DOMContentLoaded", () => {
    let caroussel;
    let items;
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
        } else if (view === "item") {
            displayItemDetail(arg);
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

        let currentPage = 1;
        let itemsPerPage = 25;
        let filteredChampions = [...champions];

        async function renderList(championsToRender, page = 1, itemsPerPage = 25) {
            listContainer.innerHTML = "";

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, championsToRender.length);

            const championsToShow = itemsPerPage === 0
                ? championsToRender
                : championsToRender.slice(startIndex, endIndex);

            for (const champion of championsToShow) {
                const championLi = document.createElement('li');
                championLi.classList.add('card-container');
                championLi.appendChild(await champion.renderCard());
                listContainer.appendChild(championLi);
            }

            updatePaginationControls(championsToRender.length);
        }

        function updatePaginationControls(totalItems) {
            const prevButton = document.getElementById("prev-page");
            const nextButton = document.getElementById("next-page");
            const pageInfo = document.getElementById("page-info");

            if (pageInfo) {
                if (itemsPerPage > 0) {
                    const totalPages = Math.ceil(totalItems / itemsPerPage);
                    pageInfo.textContent = `Page ${currentPage}/${totalPages} (${totalItems} champions)`;

                    if (prevButton) prevButton.disabled = currentPage === 1;
                    if (nextButton) nextButton.disabled = currentPage >= totalPages || totalItems === 0;
                } else {
                    pageInfo.textContent = `Affichage de tous les champions (${totalItems})`;
                    if (prevButton) prevButton.disabled = true;
                    if (nextButton) nextButton.disabled = true;
                }
            }
        }

        function createPaginationControls() {
            let paginationContainer = document.getElementById("pagination-container");
            if (!paginationContainer) {
                paginationContainer = document.createElement("div");
                paginationContainer.id = "pagination-container";
                paginationContainer.style = "margin-top: 20px; display: flex; justify-content: center; gap: 10px; align-items: center;";
                listContainer.parentNode.insertBefore(paginationContainer, listContainer.nextSibling);
            }

            paginationContainer.innerHTML = "";

            const itemsSelector = document.createElement("select");
            itemsSelector.id = "items-per-page";

            const options = [
                { value: 25, text: "25 champions" },
                { value: 50, text: "50 champions" },
                { value: 100, text: "100 champions" },
                { value: 0, text: "Tous les champions" }
            ];

            options.forEach(option => {
                const optElement = document.createElement("option");
                optElement.value = option.value;
                optElement.textContent = option.text;
                if (option.value === itemsPerPage) {
                    optElement.selected = true;
                }
                itemsSelector.appendChild(optElement);
            });

            itemsSelector.addEventListener("change", async (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                await renderList(filteredChampions, currentPage, itemsPerPage);
            });

            paginationContainer.appendChild(itemsSelector);

            const prevButton = document.createElement("button");
            prevButton.id = "prev-page";
            prevButton.textContent = "Précédent";
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", async () => {
                if (currentPage > 1) {
                    currentPage--;
                    await renderList(filteredChampions, currentPage, itemsPerPage);
                }
            });
            paginationContainer.appendChild(prevButton);

            const pageInfo = document.createElement("span");
            pageInfo.id = "page-info";
            pageInfo.textContent = `Page ${currentPage}/${Math.ceil(filteredChampions.length / itemsPerPage)} (${filteredChampions.length} champions)`;
            paginationContainer.appendChild(pageInfo);

            const nextButton = document.createElement("button");
            nextButton.id = "next-page";
            nextButton.textContent = "Suivant";
            nextButton.disabled = itemsPerPage === 0 || currentPage >= Math.ceil(filteredChampions.length / itemsPerPage);
            nextButton.addEventListener("click", async () => {
                if (currentPage < Math.ceil(filteredChampions.length / itemsPerPage)) {
                    currentPage++;
                    await renderList(filteredChampions, currentPage, itemsPerPage);
                }
            });
            paginationContainer.appendChild(nextButton);
        }

        createPaginationControls();

        await renderList(champions, currentPage, itemsPerPage);

        const searchInput = document.getElementById("search");
        searchInput.addEventListener("input", async (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredChampions = champions.filter(champ => champ.name.toLowerCase().includes(searchTerm));
            currentPage = 1;
            await renderList(filteredChampions, currentPage, itemsPerPage);
        });

        const boutton = document.getElementById("favoris");
        boutton.onclick = () => {
            window.location.hash = `favori/`;
        }
    }



    async function displayItems() {
        if (!items) items = await Provider.fetchItems();
        const listContainerItem = document.getElementById("item-list");
        listContainerItem.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));';
        const sorted = Object.values(items).sort((a, b) => a.name.localeCompare(b.name));
        for (const item of sorted) {
            listContainerItem.appendChild(await item.renderCard());
        }
    }

    async function displayItemDetail(arg) {
        if (!items) items = await Provider.fetchItems();
        const item = items[arg];
        const container = document.getElementById("item-details");
        container.innerHTML = "";
        container.appendChild(await item.renderDetail());
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