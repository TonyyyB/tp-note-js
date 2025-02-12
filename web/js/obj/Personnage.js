class Personnage {
    constructor(id, nom, race, classe, niveau, pointsDeVie, equipements, favoris, note, image) {
        this.id = id;
        this.nom = nom;
        this.race = race;
        this.classe = classe;
        this.niveau = niveau;
        this.pointsDeVie = pointsDeVie;
        this.equipements = equipements; // { nom: "", type: "" }
        this.favoris = favoris || false;
        this.note = note || 0;
        this.image = image || "default.jpg";
    }
}
