export default class Tag {
    static tags = new Map();

    constructor(name) {
        this.name = name;
        this.champions = new Set();
    }

    addChampion(champion) {
        this.champions.add(champion);
    }

    getChampions() {
        return Array.from(this.champions);
    }

    static getTag(name) {
        if (!this.tags.has(name)) {
            this.tags.set(name, new Tag(name));
        }
        return this.tags.get(name);
    }
}