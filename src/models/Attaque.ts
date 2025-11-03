export class Attaque {
    private nom: string;
    private damage: number;
    private usageLimit: number;
    private usageCount: number;

    constructor(nom: string, damage: number, usageLimit: number) {
        this.nom = nom;
        this.damage = damage;
        this.usageLimit = usageLimit;
        this.usageCount = 0;
    }

    getNom(): string {
        return this.nom;
    }

    getDamage(): number {
        return this.damage;
    }

    getUsageLimit(): number {
        return this.usageLimit;
    }

    getUsageCount(): number {
        return this.usageCount;
    }

    peutUtiliser(): boolean {
        return this.usageCount < this.usageLimit;
    }

    utiliser(): void {
        if (this.peutUtiliser()) {
            this.usageCount++;
        }
    }

    resetUsage(): void {
        this.usageCount = 0;
    }

    afficherInfos(): string {
        return `${this.nom} - Dégâts: ${this.damage}, Utilisations: ${this.usageCount}/${this.usageLimit}`;
    }
}
