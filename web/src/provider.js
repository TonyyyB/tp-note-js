import CONFIG from "./config.js";
import Champion from "./model/Champion.js";

async function fetchLinks() {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.links);
        const links = await response.json();
        return links;
    } catch (error) {
        console.error("fetchLinks:", error);
        return [];
    }
}

async function fetchChampions() {
    try {
        const links = await fetchLinks();
        const response = await fetch(links.champions);
        const champions = await response.json();
        return Object.values(champions.data).map(champion => new Champion(champion));
    } catch (error) {
        console.error("fetchChampions:", error);
        return [];
    }
}

export { fetchChampions };