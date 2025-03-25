import Tag from './Tag.js';
import Provider from '../provider.js';
export default class Item {
    constructor(id, json) {
        this.id = id;
        this.name = json.name.startsWith("<rarityLegendary>") ? json.name.split("<br>")[0].replace("<rarityLegendary>", "").replace("<rarityLegendary/>", "") : json.name;
        this.description = json.description;
        this.plaintext = json.plaintext;
        this.image = json.image.full;
        this.gold = json.gold;
        this.stats = json.stats;
    }

    displayInfo() {
        console.log(`${this.name},`);
        console.log(`Description: ${this.plaintext}`);
        console.log(`Prix en Gold: ${this.gold}`);
        console.log(`Resource: ${this.partype}`);

    }

    async renderCard() {
        console.log(this.image);
        const card = document.createElement('div');
        card.classList.add('card');
        card.style = "cursor: pointer;";
        card.onclick = () => {
            window.location.hash = `item/${this.id}`;
        };

        const img = document.createElement('img');
        img.src = await Provider.getItemImageBase(this.image);
        img.alt = this.name;
        img.height = 64;
        img.width = 64;
        card.appendChild(img);

        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.style = 'margin: 0px; text-align: center;';
        card.appendChild(h2);
        return card;
    }
}