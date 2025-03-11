import CONFIG from "./config.js";
import Champion from "./model/Champion.js";
import ChampionDetail from "./model/ChampionDetail.js";

export default class Provider {
    static async fetchLinks() {
        try {
            const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.links);
            const links = await response.json();
            return links;
        } catch (error) {
            console.error("fetchLinks:", error);
            return [];
        }
    }

    static async fetchChampions() {
        try {
            const links = await Provider.fetchLinks();
            const response = await fetch(links.champions);
            const champions = await response.json();
            return Object.values(champions.data).map(champion => new Champion(champion));
        } catch (error) {
            console.error("fetchChampions:", error);
            return [];
        }
    }

    static async fetchChampion(id) {
        try {
            const links = await Provider.fetchLinks();
            const response = await fetch(links.champion + id + ".json");
            const champion = await response.json();
            return ChampionDetail.fromJSON(champion.data[id]);
        } catch (error) {
            console.error("fetchChampion:", error);
            return [];
        }
    }

    static async getChampionSquareImageBase(name) {
        try {
            const links = await Provider.fetchLinks();
            return links.championSquareImageBase + name;
        } catch (error) {
            console.error("getChampionSquareImageBase:", error);
            return [];
        }
    }

    static async getChampionLoadingImageBase(name, skin = 0) {
        try {
            const links = await Provider.fetchLinks();
            return links.championLoadingImageBase + name + "_" + skin + ".jpg";
        } catch (error) {
            console.error("getChampionLoadingImageBase:", error);
            return [];
        }
    }

    static async getItemImageBase(name) {
        try {
            const links = await Provider.fetchLinks();
            return links.itemImageBase + name;
        } catch (error) {
            console.error("getItemImageBase:", error);
            return [];
        }
    }

    static async getSpellImageBase(name) {
        try {
            const links = await Provider.fetchLinks();
            return links.spellImageBase + name;
        } catch (error) {
            console.error("getSpellImageBase:", error);
            return [];
        }
    }
}