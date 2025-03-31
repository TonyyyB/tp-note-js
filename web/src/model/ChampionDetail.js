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

    clone() {
        return new Stats(
            this.hp, this.hpperlevel, this.mp, this.mpperlevel, this.movespeed,
            this.armor, this.armorperlevel, this.spellblock, this.spellblockperlevel,
            this.attackrange, this.hpregen, this.hpregenperlevel, this.mpregen, this.mpregenperlevel,
            this.crit, this.critperlevel, this.attackdamage, this.attackdamageperlevel,
            this.attackspeedperlevel, this.attackspeed
        );
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
        this.passive = new Passive(passive.name, passive.description, passive.image);
        this.currentSkin = 0;


        this.equippedItems = [null, null, null, null, null];
        this.baseStats = this.stats.clone();
        this.modifiedStats = this.stats.clone();

        this.loadSkinsImages();
    }

    async loadSkinsImages() {
        return this.skins.map(async skin => {
            const link = await Provider.getChampionLoadingImageBase(this.id, skin.num);
            fetch(link);
        });
    }

    static fromJSON(jsonData) {
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


    equipItem(item, slot) {
        if (slot < 0 || slot >= 5) {
            console.error("Emplacement d'objet invalide");
            return false;
        }

        if (this.equippedItems[slot]) {
            this.unequipItem(slot);
        }

        this.equippedItems[slot] = item;

        this.updateStats();

        return true;
    }


    unequipItem(slot) {
        if (slot < 0 || slot >= 5 || !this.equippedItems[slot]) {
            return false;
        }

        this.equippedItems[slot] = null;

        this.updateStats();

        return true;
    }

    updateStats() {
        this.modifiedStats = this.baseStats.clone();
        for (const item of this.equippedItems) {
            if (item) {
                this.applyItemStats(item);
            }
        }
    }

    applyItemStats(item) {

        if (!item.stats) return;

        for (const [statKey, statValue] of Object.entries(item.stats)) {

            if (statValue === null || statValue === undefined) continue;

            const championStatKey = this.mapItemStatToChampionStat(statKey);

            if (championStatKey && this.modifiedStats[championStatKey] !== undefined) {
                this.modifiedStats[championStatKey] += parseFloat(statValue);
            }
        }
    }


    mapItemStatToChampionStat(itemStatKey) {
        const statMap = {
            'FlatHPPoolMod': 'hp',
            'rFlatHPModPerLevel': 'hpperlevel',
            'FlatMPPoolMod': 'mp',
            'rFlatMPModPerLevel': 'mpperlevel',
            'PercentMovementSpeedMod': 'movespeed',
            'FlatMovementSpeedMod': 'movespeed',
            'FlatArmorMod': 'armor',
            'rFlatArmorModPerLevel': 'armorperlevel',
            'FlatSpellBlockMod': 'spellblock',
            'rFlatSpellBlockModPerLevel': 'spellblockperlevel',
            'FlatPhysicalDamageMod': 'attackdamage',
            'rFlatPhysicalDamageModPerLevel': 'attackdamageperlevel',
            'PercentAttackSpeedMod': 'attackspeed',
            'FlatCritChanceMod': 'crit',
            'FlatHPRegenMod': 'hpregen',
            'rFlatHPRegenModPerLevel': 'hpregenperlevel',
            'FlatMPRegenMod': 'mpregen',
            'rFlatMPRegenModPerLevel': 'mpregenperlevel'
        };

        return statMap[itemStatKey] || null;
    }

    async renderDetail() {
        const detail = document.createElement('div');
        detail.classList.add('detail');

        const divImage = document.createElement('div');
        divImage.classList.add("image");
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

        this.skinSelect = document.createElement('select');
        this.skinSelect.onchange = async () => {
            this.currentSkin = this.skinSelect.selectedIndex;
            img.src = await Provider.getChampionLoadingImageBase(this.id, this.skins[this.currentSkin].num);
        };
        this.skins.forEach(skin => {
            const option = document.createElement('option');
            option.textContent = skin.name == "default" ? this.name : skin.name;
            this.skinSelect.appendChild(option);
        });
        imgCarousel.appendChild(this.skinSelect);

        const next = document.createElement('button');
        next.innerHTML = ">";
        imgCarousel.appendChild(next);

        prev.onclick = () => this.prevSkin();
        next.onclick = () => this.nextSkin();

        const divInfoBase = document.createElement('div');
        divInfoBase.classList.add("info-base");
        detail.appendChild(divInfoBase);

        const divSpell = document.createElement('div');
        divSpell.classList.add("spell");
        detail.appendChild(divSpell);

        const imagePassive = document.createElement('img');
        imagePassive.src = await Provider.getPassiveImageBase(this.passive.image);

        const ulPassive = document.createElement('ul');
        ulPassive.innerHTML = `
            <li>${this.passive.name}</li>
            <li>Description: ${this.passive.description}</li>
        `;

        divSpell.appendChild(imagePassive);
        divSpell.appendChild(ulPassive);

        for (const spell of this.spells) {
            const spellDiv = document.createElement('div');
            const imageSpell = document.createElement('img');
            imageSpell.src = await Provider.getSpellImageBase(spell.image);
            spellDiv.appendChild(imageSpell);
            const ulSpell = document.createElement('ul');
            ulSpell.innerHTML = `
                <li>${spell.name}</li>
                <li>Description: ${spell.description}</li>
                <li>Cooldown: ${spell.cooldown}</li>
            `;

            spellDiv.appendChild(ulSpell);
            divSpell.appendChild(spellDiv);
        }

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
        divStat.classList.add("stats");
        detail.appendChild(divStat);

        const h6 = document.createElement('h6');
        h6.textContent = 'Stats de base:';
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
            <li>MP regen per level: ${this.stats.mpregenperlevel}</li>
            <li>Crit: ${this.stats.crit}</li>
            <li>Crit per level: ${this.stats.critperlevel}</li>
            <li>Attack damage: ${this.stats.attackdamage}</li>
            <li>Attack damage per level: ${this.stats.attackdamageperlevel}</li>
            <li>Attack speed per level: ${this.stats.attackspeedperlevel}</li>
            <li>Attack speed: ${this.stats.attackspeed}</li>
        `;
        divStat.appendChild(ul);

        const divItems = document.createElement('div');
        divItems.classList.add('items-equipment');
        divItems.innerHTML = '<h6>Équipement:</h6>';
        detail.appendChild(divItems);

        const itemSlots = document.createElement('div');
        itemSlots.classList.add('item-slots');
        divItems.appendChild(itemSlots);

        for (let i = 0; i < 5; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('item-slot');
            slotDiv.setAttribute('data-slot', i);

            if (this.equippedItems[i]) {
                const img = document.createElement('img');
                img.src = await Provider.getItemImageBase(this.equippedItems[i].image);
                img.alt = this.equippedItems[i].name;
                slotDiv.appendChild(img);

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'X';
                removeBtn.classList.add('remove-item');
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.unequipItem(i);
                    this.renderItemSlots(itemSlots);
                    this.renderModifiedStats(modifiedStatsDiv);
                };
                slotDiv.appendChild(removeBtn);
            } else {
                slotDiv.textContent = '+';
                slotDiv.classList.add('empty-slot');
            }


            slotDiv.onclick = async () => {

                const items = await Provider.fetchItems();
                this.showItemSelectionModal(items, i, itemSlots, modifiedStatsDiv);
            };

            itemSlots.appendChild(slotDiv);
        }


        const modifiedStatsDiv = document.createElement('div');
        modifiedStatsDiv.classList.add('modified-stats');
        modifiedStatsDiv.id = 'modified-stats';
        divItems.appendChild(modifiedStatsDiv);

        this.renderModifiedStats(modifiedStatsDiv);


        const addFavoriteButton = document.createElement('button');
        addFavoriteButton.textContent = 'Ajouter aux favoris';
        addFavoriteButton.id = 'add-favorite';
        addFavoriteButton.onclick = () => {
            Provider.addToFavorites(this);
        };
        detail.appendChild(addFavoriteButton);

        return detail;
    }


    showItemSelectionModal(items, slotIndex, itemSlotsElement, statsElement) {
        const existingModal = document.querySelector('.items-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }


        const modal = document.createElement('div');
        modal.classList.add('items-modal');


        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Sélectionner un objet';
        modal.appendChild(modalTitle);


        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fermer';
        closeBtn.classList.add('modal-close-btn');
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };
        modal.appendChild(closeBtn);


        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher un objet...';
        searchInput.classList.add('item-search');
        modal.appendChild(searchInput);


        const itemsList = document.createElement('div');
        itemsList.classList.add('items-list');
        modal.appendChild(itemsList);


        const filterItems = () => {
            const searchText = searchInput.value.toLowerCase();
            Array.from(itemsList.children).forEach(itemDiv => {
                const itemName = itemDiv.querySelector('span').textContent.toLowerCase();
                itemDiv.style.display = itemName.includes(searchText) ? 'flex' : 'none';
            });
        };

        searchInput.addEventListener('input', filterItems);


        Object.values(items).forEach(async (item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-option');

            const img = document.createElement('img');
            img.src = await Provider.getItemImageBase(item.image);
            img.alt = item.name;
            img.height = 40;
            img.width = 40;
            itemDiv.appendChild(img);

            const itemName = document.createElement('span');
            itemName.textContent = item.name;
            itemDiv.appendChild(itemName);


            itemDiv.onclick = () => {
                this.equipItem(item, slotIndex);
                this.renderItemSlots(itemSlotsElement);
                this.renderModifiedStats(statsElement);
                document.body.removeChild(modal);
            };

            itemsList.appendChild(itemDiv);
        });


        document.body.appendChild(modal);
    }


    async renderItemSlots(itemSlotsElement) {

        itemSlotsElement.innerHTML = '';


        for (let i = 0; i < 5; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('item-slot');
            slotDiv.setAttribute('data-slot', i);

            if (this.equippedItems[i]) {

                const img = document.createElement('img');
                img.src = await Provider.getItemImageBase(this.equippedItems[i].image);
                img.alt = this.equippedItems[i].name;
                slotDiv.appendChild(img);


                const tooltip = document.createElement('div');
                tooltip.classList.add('item-tooltip');
                tooltip.innerHTML = `
                    <strong>${this.equippedItems[i].name}</strong>
                    <p>${this.equippedItems[i].plaintext || ''}</p>
                `;
                slotDiv.appendChild(tooltip);


                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'X';
                removeBtn.classList.add('remove-item');
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.unequipItem(i);
                    this.renderItemSlots(itemSlotsElement);
                    this.renderModifiedStats(document.getElementById('modified-stats'));
                };
                slotDiv.appendChild(removeBtn);
            } else {

                slotDiv.textContent = '+';
                slotDiv.classList.add('empty-slot');
            }


            slotDiv.onclick = async () => {

                const items = await Provider.fetchItems();
                this.showItemSelectionModal(
                    items,
                    i,
                    itemSlotsElement,
                    document.getElementById('modified-stats')
                );
            };

            itemSlotsElement.appendChild(slotDiv);
        }
    }


    renderModifiedStats(statsElement) {
        if (!statsElement) return;


        statsElement.innerHTML = '';


        const statsTitle = document.createElement('h6');
        statsTitle.textContent = 'Statistiques modifiées:';
        statsElement.appendChild(statsTitle);


        const statsList = document.createElement('ul');


        for (const key of Object.keys(this.baseStats)) {

            if (key.includes('perlevel') || key === 'attackrange') continue;

            const baseValue = this.baseStats[key];
            const currentValue = this.modifiedStats[key];


            if (Math.abs(currentValue - baseValue) > 0.01) {
                const diff = currentValue - baseValue;
                const sign = diff > 0 ? '+' : '';

                const statItem = document.createElement('li');
                statItem.textContent = `${this.getStatDisplayName(key)}: ${currentValue.toFixed(1)} (${sign}${diff.toFixed(1)})`;


                if (diff > 0) {
                    statItem.classList.add('stat-increased');
                } else if (diff < 0) {
                    statItem.classList.add('stat-decreased');
                }

                statsList.appendChild(statItem);
            }
        }


        if (statsList.children.length === 0) {
            const noChanges = document.createElement('p');
            noChanges.textContent = 'Aucun changement de statistiques';
            statsElement.appendChild(noChanges);
        } else {
            statsElement.appendChild(statsList);
        }
    }


    getStatDisplayName(statKey) {
        const displayNames = {
            'hp': 'Points de vie',
            'mp': 'Points de mana',
            'armor': 'Armure',
            'spellblock': 'Résistance magique',
            'movespeed': 'Vitesse de déplacement',
            'attackdamage': 'Dégâts d\'attaque',
            'attackspeed': 'Vitesse d\'attaque',
            'crit': 'Chance de critique',
            'hpregen': 'Régénération de vie',
            'mpregen': 'Régénération de mana'
        };

        return displayNames[statKey] || statKey;
    }

    nextSkin() {
        this.currentSkin = (this.currentSkin + 1) % this.skins.length;
        this.skinSelect.selectedIndex = this.currentSkin;
        this.skinSelect.onchange();
    }

    prevSkin() {
        this.currentSkin = (this.currentSkin + this.skins.length - 1) % this.skins.length;
        this.skinSelect.selectedIndex = this.currentSkin;
        this.skinSelect.onchange();
    }

    async renderCardFav() {
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