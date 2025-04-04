import Tag from './Tag.js';
import Provider from '../provider.js';
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
       
    }

    displayInfo() {
        console.log(`${this.name}, ${this.title}`);
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
        img.loading = 'lazy';
        card.appendChild(img);

        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.style = 'margin: 0px; text-align: center;';
        card.appendChild(h2);
        return card;
    }
}