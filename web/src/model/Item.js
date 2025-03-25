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
    async renderDetail() {
        const detail = document.createElement('div');
        detail.classList.add('detail');

        const divImage = document.createElement('div');
        divImage.classList.add('image');
        detail.appendChild(divImage);

        const img = document.createElement('img');
        img.classList.add('detail-image');
        img.src = await Provider.getItemImageBase(this.image);
        img.alt = this.name;
        divImage.appendChild(img);

        const divInfoBase = document.createElement('div');
        divInfoBase.classList.add('info-base');
        detail.appendChild(divInfoBase);

        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.style = 'margin: 0px; text-align: center;';
        divInfoBase.appendChild(h2);

        if (this.description) divInfoBase.appendChild(this.parseDescription());

        return detail;
    }

    replaceElementTag(oldElement, newTag) {
        let newElement = document.createElement(newTag);

        [...oldElement.attributes].forEach(attr => {
            newElement.setAttribute(attr.name, attr.value);
        });

        while (oldElement.firstChild) {
            newElement.appendChild(oldElement.firstChild);
        }

        oldElement.replaceWith(newElement);

        return newElement;
    }

    replaceAllTags(parsedDoc, tagMapping) {
        Object.entries(tagMapping).forEach(([oldTag, newTag]) => {
            parsedDoc.querySelectorAll(oldTag).forEach(el => {
                this.replaceElementTag(el, newTag);
            });
        });
    }

    parseDescription() {
        let parser = new DOMParser();
        let parsed = parser.parseFromString(this.description, "text/html");
        this.replaceAllTags(parsed.body, {
            "maintext": "div",
            "stats": "p",
            "attention": "b",
            "passive": "p",
            "active": "b",
            "healing": "b",
            "onhit": "i",
            "magicdamage": "b",
            "scalelevel": "i",
            "speed": "b",
            "scalemana": "b",
            "keyword": "b",
            "status": "b",
            "rules": "i",
            "scalehealth": "b",
            "physicaldamage": "b",
            "raritylegendary": "b",
            "keywordstealth": "b",
            "shield": "b",
            "buffedstat": "i"
        });
        console.log(parsed.body.firstChild);
        return parsed.body.firstChild;
    }

    toString() {
        return this.name;
    }
}