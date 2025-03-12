import Provider from "../provider.js";
class Skin {
    constructor(id, num, name, chromas) {
        this.id = id;
        this.num = num;
        this.name = name;
        this.chromas = chromas;
    }
}

class Info {
    constructor(attack, defense, magic, difficulty) {
        this.attack = attack;
        this.defense = defense;
        this.magic = magic;
        this.difficulty = difficulty;
    }
}

class Stats {
    constructor(hp, hpperlevel, mp, mpperlevel, movespeed, armor, armorperlevel, spellblock, spellblockperlevel, attackrange, hpregen, hpregenperlevel, mpregen, mpregenperlevel, crit, critperlevel, attackdamage, attackdamageperlevel, attackspeedperlevel, attackspeed) {
        this.hp = hp;
        this.hpperlevel = hpperlevel;
        this.mp = mp;
        this.mpperlevel = mpperlevel;
        this.movespeed = movespeed;
        this.armor = armor;
        this.armorperlevel = armorperlevel;
        this.spellblock = spellblock;
        this.spellblockperlevel = spellblockperlevel;
        this.attackrange = attackrange;
        this.hpregen = hpregen;
        this.hpregenperlevel = hpregenperlevel;
        this.mpregen = mpregen;
        this.mpregenperlevel = mpregenperlevel;
        this.crit = crit;
        this.critperlevel = critperlevel;
        this.attackdamage = attackdamage;
        this.attackdamageperlevel = attackdamageperlevel;
        this.attackspeedperlevel = attackspeedperlevel;
        this.attackspeed = attackspeed;
    }
}

class Spell {
    constructor(id, name, description, tooltip, maxrank, cooldown, cooldownBurn, cost, costBurn, costType, range, rangeBurn, resource, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tooltip = tooltip;
        this.maxrank = maxrank;
        this.cooldown = cooldown;
        this.cooldownBurn = cooldownBurn;
        this.cost = cost;
        this.costBurn = costBurn;
        this.costType = costType;
        this.range = range;
        this.rangeBurn = rangeBurn;
        this.resource = resource;
        this.image = image.full;
    }
}

class Passive {
    constructor(name, description, image) {
        this.name = name;
        this.description = description;
        this.image = image.full;
    }
}

export default class ChampionDetail {
    constructor(id, key, name, title, image, skins, lore, blurb, allytips, enemytips, tags, partype, info, stats, spells, passive) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.title = title;
        this.image = image.full;
        this.skins = skins.map(skin => new Skin(skin.id, skin.num, skin.name, skin.chromas));
        this.lore = lore;
        this.blurb = blurb;
        this.allytips = allytips;
        this.enemytips = enemytips;
        this.tags = tags;
        this.partype = partype;
        this.info = new Info(info.attack, info.defense, info.magic, info.difficulty);
        this.stats = new Stats(
            stats.hp, stats.hpperlevel, stats.mp, stats.mpperlevel, stats.movespeed,
            stats.armor, stats.armorperlevel, stats.spellblock, stats.spellblockperlevel,
            stats.attackrange, stats.hpregen, stats.hpregenperlevel, stats.mpregen, stats.mpregenperlevel,
            stats.crit, stats.critperlevel, stats.attackdamage, stats.attackdamageperlevel,
            stats.attackspeedperlevel, stats.attackspeed
        );
        this.spells = spells.map(spell => new Spell(
            spell.id, spell.name, spell.description, spell.tooltip, spell.maxrank, spell.cooldown,
            spell.cooldownBurn, spell.cost, spell.costBurn, spell.costType, spell.range, spell.rangeBurn,
            spell.resource, spell.image
        ));
        console.log(passive);
        this.passive = new Passive(passive.name, passive.description, passive.image);
        this.currentSkin = 0;
        this.loadSkinsImages();
    }

    async loadSkinsImages() {
        return this.skins.map(async skin => {
            const link = await Provider.getChampionLoadingImageBase(this.id, skin.num);
            fetch(link);
        });
    }

    static fromJSON(jsonData) {
        console.log(jsonData);
        return new ChampionDetail(
            jsonData.id,
            jsonData.key,
            jsonData.name,
            jsonData.title,
            jsonData.image,
            jsonData.skins,
            jsonData.lore,
            jsonData.blurb,
            jsonData.allytips,
            jsonData.enemytips,
            jsonData.tags,
            jsonData.partype,
            jsonData.info,
            jsonData.stats,
            jsonData.spells,
            jsonData.passive
        );
    }

    displayInfo() {
        console.log(`${this.name}, ${this.title}`);
        console.log(`Tags: ${this.tags.join(', ')}`);
        console.log(`HP: ${this.stats.hp}, Attack Damage: ${this.stats.attackdamage}`);
        console.log(`Resource: ${this.partype}`);
        console.log(`Description: ${this.blurb}`);
    }

    async renderDetail() {
        const detail = document.createElement('div');
        detail.classList.add('detail');

        const divImage = document.createElement('div');
        divImage.classList.add("image")
        detail.appendChild(divImage);

        const imgCarousel = document.createElement('div');
        imgCarousel.classList.add('img-carousel');
        divImage.appendChild(imgCarousel);

        const img = document.createElement('img');
        img.classList.add('detail-image');
        img.src = await Provider.getChampionLoadingImageBase(this.id, this.currentSkin);
        img.alt = this.name;
        imgCarousel.appendChild(img);

        const prev = document.createElement('button');
        prev.innerHTML = "<";
        imgCarousel.appendChild(prev);

        const skinSelect = document.createElement('select');
        skinSelect.onchange = async () => {
            this.currentSkin = skinSelect.selectedIndex;
            img.src = await Provider.getChampionLoadingImageBase(this.id, this.skins[this.currentSkin].num);
        }
        this.skins.forEach(skin => {
            const option = document.createElement('option');
            option.textContent = skin.name == "default" ? this.name : skin.name;
            skinSelect.appendChild(option);
        });
        imgCarousel.appendChild(skinSelect);

        const next = document.createElement('button');
        next.innerHTML = ">";
        imgCarousel.appendChild(next);

        prev.onclick = async () => {
            this.currentSkin = (this.currentSkin + this.skins.length - 1) % this.skins.length;
            img.src = await Provider.getChampionLoadingImageBase(this.id, this.skins[this.currentSkin].num);
            skinSelect.selectedIndex = this.currentSkin;
        };

        next.onclick = async () => {
            this.currentSkin = (this.currentSkin + 1) % this.skins.length;
            img.src = await Provider.getChampionLoadingImageBase(this.id, this.skins[this.currentSkin].num);
            skinSelect.selectedIndex = this.currentSkin;
        };

        const divSpell = document.createElement('div');
        divSpell.classList.add("spell")
        detail.appendChild(divSpell);

        const imagePassive = document.createElement('img');
        imagePassive.src = await Provider.getPassiveImageBase(this.passive.image);

        const ulPassive = document.createElement('ul');
        ulPassive.innerHTML = `
            <li> ${this.passive.name}}</li>
            <li> Description: ${this.passive.description}</li>
        `;

        divSpell.appendChild(imagePassive);
        divSpell.appendChild(ulPassive);

        this.spells.forEach(async spell => {
            const spellDiv = document.createElement('div');
            const imageSpell = document.createElement('img');
            imageSpell.src = await Provider.getSpellImageBase(spell.image);
            spellDiv.appendChild(imageSpell);
            const ulSpell = document.createElement('ul');
            ulSpell.innerHTML = `
            <li> ${spell.name}}</li>
            <li> Description: ${spell.description}</li>
            <li> Cooldown: ${spell.cooldown}</li>
        `;

        spellDiv.appendChild(ulSpell);
        divSpell.appendChild(spellDiv);
        });


        
        this.skins.forEach(skin => {
            const option = document.createElement('option');
            option.textContent = skin.name == "default" ? this.name : skin.name;
            skinSelect.appendChild(option);
        });

        const divInfoBase = document.createElement('div');
        divInfoBase.classList.add("info-base")
        detail.appendChild(divInfoBase);

        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.style = 'margin: 0px; text-align: center;';
        divInfoBase.appendChild(h2);

        const h3 = document.createElement('h3');
        h3.textContent = this.title;
        h3.style = 'margin: 0px; text-align: center;';
        divInfoBase.appendChild(h3);

        const p = document.createElement('p');
        p.textContent = this.blurb;
        divInfoBase.appendChild(p);

        const h4 = document.createElement('h4');
        h4.textContent = 'Tags: ' + this.tags.join(', ');
        divInfoBase.appendChild(h4);

        const h5 = document.createElement('h5');
        h5.textContent = 'Resource: ' + this.partype;
        divInfoBase.appendChild(h5);

        const divStat = document.createElement('div');
        divStat.classList.add("stats")
        detail.appendChild(divStat);
        
        const h6 = document.createElement('h6');
        h6.textContent = 'Stats:';
        divStat.appendChild(h6);

        const ul = document.createElement('ul');
        ul.innerHTML = `
            <li>HP: ${this.stats.hp}</li>
            <li>HP per level: ${this.stats.hpperlevel}</li>
            <li>MP: ${this.stats.mp}</li>
            <li>MP per level: ${this.stats.mpperlevel}</li>
            <li>Move speed: ${this.stats.movespeed}</li>
            <li>Armor: ${this.stats.armor}</li>
            <li>Armor per level: ${this.stats.armorperlevel}</li>
            <li>Spell block: ${this.stats.spellblock}</li>
            <li>Spell block per level: ${this.stats.spellblockperlevel}</li>
            <li>Attack range: ${this.stats.attackrange}</li>
            <li>HP regen: ${this.stats.hpregen}</li>
            <li>HP regen per level: ${this.stats.hpregenperlevel}</li>
            <li>MP regen: ${this.stats.mpregen}</li>
            <li>MP regen per level:
            ${this.stats.mpregenperlevel}</li>
            <li>Crit: ${this.stats.crit}</li>
            <li>Crit per level: ${this.stats.critperlevel}</li>
            <li>Attack damage: ${this.stats.attackdamage}</li>
            <li>Attack damage per level: ${this.stats.attackdamageperlevel}</li>
            <li>Attack speed per level: ${this.stats.attackspeedperlevel}</li>
            <li>Attack speed: ${this.stats.attackspeed}</li>
        `;
        divStat.appendChild(ul);
        return detail;
    }
}
