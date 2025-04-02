# tp-note-js

## Membres du groupe

Beaujouan Tony

Lobjois Mathéo

## Comment lancer l'application

Dans un premier terminal à la racine du projet taper la commande:
```bash
sh run_api.sh
```

Dans un deuxième terminal à la racine du projet taper la commande:
```bash
sh run_web.sh
```

## Arborescence

Voici l'arborescence de notre projet:
```bash
├── assets
├── data
│   └── db.json
├── index.html
├── src
│   ├── app.js
│   ├── config.js
│   ├── model
│   │   ├── ChampionDetail.js
│   │   ├── Champion.js
│   │   ├── Item.js
│   │   └── Tag.js
│   └── provider.js
├── styles.css
└── views
    ├── detail.html
    ├── favori.html
    ├── item.html
    ├── items.html
    └── listing.html
```

Pour rappel, les fichiers `.html` dans `views` ne sont que des templates, le contenu des fichier est directement chargé par js et affiché dans le `index.html` afin de respecter le principe de Single Page Application

## Fonctionnalités

Liste des fonctionnalités implémentées:

- **Vue de listing** : Affichage paginé de tous les personnages disponibles

- **Vue détaillée** : Affichage des informations complètes d'un personnage sélectionné

- **Système de notation** : Possibilité d'attribuer une note (de 1 à 5) à chaque personnage

- **Gestion des favoris** : Ajout/suppression de personnages aux favoris (stockage local)

- **Vue des favoris** : Consultation des personnages marqués comme favoris

- **Recherche** : Recherche par nom, type ou caractéristiques de personnage

- **Pagination** : Navigation entre les différentes pages de résultats

- **Lazy loading** : Chargement optimisé des images pour améliorer les performances

- **Relations entre entités** : Gestion des équipements et compétences liés aux personnages


