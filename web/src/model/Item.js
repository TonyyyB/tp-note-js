import Tag from './Tag.js';
import Provider from '../provider.js';
export default class Item {
    constructor(json) {
        this.name = json.name;
        this.description = json.description;
        this.colloq = json.colloq;
        this.into = [];
        this.plaintext = json.plaintext;
        this.image = json.image.full;
        this.gold = json.gold;
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

    async renderCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style = "cursor: pointer;";
        card.onclick = () => {
            window.location.hash = `detail/${this.id}`;
        };

        const img = document.createElement('img');
        img.src = await Provider.getChampionSquareImageBase(this.image);
        img.alt = this.name;
        card.appendChild(img);

        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.style = 'margin: 0px; text-align: center;';
        card.appendChild(h2);
        return card;
    }
}