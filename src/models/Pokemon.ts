import { Attaque } from './Attaque';

export class Pokemon {
    private nom: string;
    private lifePoint: number;
    private maxLifePoint: number;
    private attaques: Attaque[];

    constructor(nom: string, lifePoint: number) {
        this.nom = nom;
        this.lifePoint = lifePoint;
        this.maxLifePoint = lifePoint;
        this.attaques = [];
    }

    getNom(): string {
        return this.nom;
    }

    getLifePoint(): number {
        return this.lifePoint;
    }

    getMaxLifePoint(): number {
        return this.maxLifePoint;
    }

    getAttaques(): Attaque[] {
        return this.attaques;
    }

    apprendreAttaque(attaque: Attaque): boolean {
        if (this.attaques.length >= 4) {
            return false;
        }

        const attaqueExiste = this.attaques.some(a => a.getNom() === attaque.getNom());
        if (attaqueExiste) {
            return false;
        }

        this.attaques.push(attaque);
        return true;
    }

    seSoigner(): void {
        this.lifePoint = this.maxLifePoint;
        this.attaques.forEach(attaque => attaque.resetUsage());
    }

    recevoirDegats(degats: number): void {
        this.lifePoint -= degats;
        if (this.lifePoint < 0) {
            this.lifePoint = 0;
        }
    }

    estKO(): boolean {
        return this.lifePoint <= 0;
    }

    attaquer(cible: Pokemon): string {
        const attaquesDisponibles = this.attaques.filter(a => a.peutUtiliser());
        
        if (attaquesDisponibles.length === 0) {
            return `${this.nom} n'a plus d'attaques disponibles!`;
        }

        const attaqueChoisie = attaquesDisponibles[Math.floor(Math.random() * attaquesDisponibles.length)];
        attaqueChoisie.utiliser();
        cible.recevoirDegats(attaqueChoisie.getDamage());

        return `${this.nom} utilise ${attaqueChoisie.getNom()} et inflige ${attaqueChoisie.getDamage()} dégâts à ${cible.getNom()}!`;
    }
}
