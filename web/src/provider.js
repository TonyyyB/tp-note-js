import CONFIG from "./config.js";
import Champion from "./model/Champion.js";
import ChampionDetail from "./model/ChampionDetail.js";
import Item from "./model/Item.js";

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

    static async fetchItems() {
        try {
            const links = await Provider.fetchLinks();
            const response = await fetch(links.items);
            const items = await response.json();
            var res = {};
            Object.entries(items.data).forEach((data) => {
                res[data[0]] = new Item(data[0], data[1])
            });
            return res;
        } catch (error) {
            console.error("fetchItems:", error);
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

    static async getPassiveImageBase(name) {
        try {
            const links = await Provider.fetchLinks();
            return links.passiveImageBase + name;
        } catch (error) {
            console.error("getPassiveImageBase:", error);
            return [];
        }
    }

    static async addToFavorites(champion) {
        let favorites = await Provider.getFavorites();
        console.log(favorites);
        if (!favorites.find(fav => fav.id === champion.id)) {
            favorites.push({
                id: champion.id,
                name: champion.name,
                title: champion.title
            });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${champion.id} ajouté aux favoris !`);
        } else {
            alert(`${champion.id} est déjà dans vos favoris.`);
        }
    }

    static async getFavorites() {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }

    static async removeFavori(championIdentifiant) {
        let favorites = await Provider.getFavorites();
        favorites.forEach((item, index, object) => {
            if (item.id === championIdentifiant) {
                object.splice(index, 1);
                return;
            }
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}