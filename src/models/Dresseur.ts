import { Pokemon } from './Pokemon';

export class Dresseur {
    private nom: string;
    private level: number;
    private experience: number;
    private pokemons: Pokemon[];

    constructor(nom: string) {
        this.nom = nom;
        this.level = 1;
        this.experience = 0;
        this.pokemons = [];
    }

    getNom(): string {
        return this.nom;
    }

    getLevel(): number {
        return this.level;
    }

    getExperience(): number {
        return this.experience;
    }

    getPokemons(): Pokemon[] {
        return this.pokemons;
    }

    ajouterPokemon(pokemon: Pokemon): void {
        this.pokemons.push(pokemon);
    }

    soignerTousLesPokemons(): void {
        this.pokemons.forEach(pokemon => pokemon.seSoigner());
    }

    gagnerExperience(xp: number): void {
        this.experience += xp;
        while (this.experience >= 10) {
            this.experience -= 10;
            this.level++;
        }
    }

    getPokemonAleatoire(): Pokemon | null {
        const pokemonsDisponibles = this.pokemons.filter(p => !p.estKO());
        if (pokemonsDisponibles.length === 0) {
            return null;
        }
        return pokemonsDisponibles[Math.floor(Math.random() * pokemonsDisponibles.length)];
    }

    getPokemonPlusDeVie(): Pokemon | null {
        const pokemonsDisponibles = this.pokemons.filter(p => !p.estKO());
        if (pokemonsDisponibles.length === 0) {
            return null;
        }
        
        let meilleur = pokemonsDisponibles[0];
        for (let i = 1; i < pokemonsDisponibles.length; i++) {
            if (pokemonsDisponibles[i].getLifePoint() > meilleur.getLifePoint()) {
                meilleur = pokemonsDisponibles[i];
            }
        }
        return meilleur;
    }

    tousLesPokemons(): boolean {
        return this.pokemons.every(p => p.estKO());
    }

    defiAleatoire(adversaire: Dresseur): string {
        this.soignerTousLesPokemons();
        adversaire.soignerTousLesPokemons();

        const pokemon1 = this.getPokemonAleatoire();
        const pokemon2 = adversaire.getPokemonAleatoire();

        if (!pokemon1 || !pokemon2) {
            return "Un des dresseurs n'a pas de Pokémon disponible!";
        }

        let log = `Combat entre ${pokemon1.getNom()} de ${this.nom} et ${pokemon2.getNom()} de ${adversaire.nom}\n`;

        while (!pokemon1.estKO() && !pokemon2.estKO()) {
            log += pokemon1.attaquer(pokemon2) + '\n';
            if (!pokemon2.estKO()) {
                log += pokemon2.attaquer(pokemon1) + '\n';
            }
        }

        if (pokemon1.estKO()) {
            adversaire.gagnerExperience(1);
            log += `${adversaire.nom} remporte le combat!`;
        } else {
            this.gagnerExperience(1);
            log += `${this.nom} remporte le combat!`;
        }

        return log;
    }

    arene1(adversaire: Dresseur): string {
        let victoires1 = 0;
        let victoires2 = 0;

        for (let i = 0; i < 100; i++) {
            this.soignerTousLesPokemons();
            adversaire.soignerTousLesPokemons();

            const pokemon1 = this.getPokemonAleatoire();
            const pokemon2 = adversaire.getPokemonAleatoire();

            if (!pokemon1 || !pokemon2) continue;

            while (!pokemon1.estKO() && !pokemon2.estKO()) {
                pokemon1.attaquer(pokemon2);
                if (!pokemon2.estKO()) {
                    pokemon2.attaquer(pokemon1);
                }
            }

            if (pokemon2.estKO()) {
                victoires1++;
            } else {
                victoires2++;
            }
        }

        let gagnant: Dresseur;
        if (this.level > adversaire.level) {
            gagnant = this;
        } else if (adversaire.level > this.level) {
            gagnant = adversaire;
        } else {
            gagnant = this.experience >= adversaire.experience ? this : adversaire;
        }

        return `Arène 1 terminée!\n${this.nom}: ${victoires1} victoires\n${adversaire.nom}: ${victoires2} victoires\nGagnant: ${gagnant.nom} (Niveau ${gagnant.level}, XP: ${gagnant.experience})`;
    }

    defiDeterministe(adversaire: Dresseur): string {
        const pokemon1 = this.getPokemonPlusDeVie();
        const pokemon2 = adversaire.getPokemonPlusDeVie();

        if (!pokemon1 || !pokemon2) {
            return "Un des dresseurs n'a pas de Pokémon disponible!";
        }

        let log = `Combat déterministe entre ${pokemon1.getNom()} de ${this.nom} et ${pokemon2.getNom()} de ${adversaire.nom}\n`;

        while (!pokemon1.estKO() && !pokemon2.estKO()) {
            log += pokemon1.attaquer(pokemon2) + '\n';
            if (!pokemon2.estKO()) {
                log += pokemon2.attaquer(pokemon1) + '\n';
            }
        }

        if (pokemon1.estKO()) {
            adversaire.gagnerExperience(1);
            log += `${adversaire.nom} remporte le combat!`;
        } else {
            this.gagnerExperience(1);
            log += `${this.nom} remporte le combat!`;
        }

        return log;
    }

    arene2(adversaire: Dresseur): string {
        let log = "Arène 2 - 100 combats déterministes\n\n";
        let combatsEffectues = 0;

        for (let i = 0; i < 100; i++) {
            const pokemon1 = this.getPokemonPlusDeVie();
            const pokemon2 = adversaire.getPokemonPlusDeVie();

            if (!pokemon1 || !pokemon2) {
                log += `\nArrêt après ${combatsEffectues} combats - Un dresseur n'a plus de Pokémon!\n`;
                break;
            }

            while (!pokemon1.estKO() && !pokemon2.estKO()) {
                pokemon1.attaquer(pokemon2);
                if (!pokemon2.estKO()) {
                    pokemon2.attaquer(pokemon1);
                }
            }

            combatsEffectues++;

            if (this.tousLesPokemons() || adversaire.tousLesPokemons()) {
                log += `\nArrêt après ${combatsEffectues} combats!\n`;
                break;
            }
        }

        const gagnant = this.tousLesPokemons() ? adversaire : this;
        log += `Gagnant: ${gagnant.nom}`;

        return log;
    }
}
