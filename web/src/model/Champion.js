import Tag from './Tag.js';
export default class Champion {
    constructor(json) {
        this.version = json.version;
        this.id = json.id;
        this.key = json.key;
        this.name = json.name;
        this.title = json.title;
        this.blurb = json.blurb;
        this.info = json.info;
        this.image = json.image.full;
        this.partype = json.partype;
        this.stats = json.stats;
        this.tags = [];

        json.tags.forEach(tagName => {
            const tag = Tag.getTag(tagName);
            tag.addChampion(this);
            this.tags.push(tag);
        });
    }

    displayInfo() {
        console.log(`${this.name}, ${this.title}`);
        console.log(`Tags: ${this.tags.map(tag => tag.name).join(', ')}`);
        console.log(`HP: ${this.stats.hp}, Attack Damage: ${this.stats.attackdamage}`);
        console.log(`Resource: ${this.partype}`);
        console.log(`Description: ${this.blurb}`);
    }
}