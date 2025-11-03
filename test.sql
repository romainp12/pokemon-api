-- Script pour tester l'API avec des données d'exemple

-- Créer des attaques
INSERT INTO attaques (nom, damage, usage_limit) VALUES 
    ('Flammèche', 40, 25),
    ('Tonnerre', 50, 15),
    ('Hydrocanon', 45, 20),
    ('Lance-Flammes', 55, 15),
    ('Fatal-Foudre', 60, 10),
    ('Surf', 50, 15);

-- Créer des Pokémon
INSERT INTO pokemons (nom, life_point, max_life_point) VALUES 
    ('Pikachu', 100, 100),
    ('Salamèche', 90, 90),
    ('Carapuce', 95, 95),
    ('Bulbizarre', 105, 105);

-- Associer des attaques aux Pokémon
-- Pikachu (id=1) apprend Tonnerre (id=2) et Fatal-Foudre (id=5)
INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES 
    (1, 2),
    (1, 5);

-- Salamèche (id=2) apprend Flammèche (id=1) et Lance-Flammes (id=4)
INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES 
    (2, 1),
    (2, 4);

-- Carapuce (id=3) apprend Hydrocanon (id=3) et Surf (id=6)
INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES 
    (3, 3),
    (3, 6);

-- Bulbizarre (id=4) apprend Hydrocanon (id=3)
INSERT INTO pokemon_attaques (pokemon_id, attaque_id) VALUES 
    (4, 3);

-- Créer des dresseurs
INSERT INTO dresseurs (nom, level, experience) VALUES 
    ('Sacha', 1, 0),
    ('Pierre', 1, 0);

-- Associer des Pokémon aux dresseurs
-- Sacha (id=1) a Pikachu (id=1) et Salamèche (id=2)
INSERT INTO dresseur_pokemons (dresseur_id, pokemon_id) VALUES 
    (1, 1),
    (1, 2);

-- Pierre (id=2) a Carapuce (id=3) et Bulbizarre (id=4)
INSERT INTO dresseur_pokemons (dresseur_id, pokemon_id) VALUES 
    (2, 3),
    (2, 4);
