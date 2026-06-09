
CREATE TABLE IF NOT EXISTS productos (
    id      SERIAL PRIMARY KEY,
    nombre  VARCHAR(100)   NOT NULL,
    precio  NUMERIC(10, 2) NOT NULL,
    tipo    VARCHAR(50),
    imagen  VARCHAR(255)
);


INSERT INTO productos (nombre, precio, tipo, imagen) VALUES
    ('Pikachu',    8750.00,  'electric', 'pikachu.png'),
    ('Bulbasaur',  7500.00,  'grass',    'bulbasaur.png'),
    ('Charmander', 8000.00,  'fire',     'charmander.png'),
    ('Squirtle',   7800.00,  'water',    'squirtle.png'),
    ('Clefairy',   6500.00,  'fairy',    'clefairy.png'),
    ('Jigglypuff', 6000.00,  'fairy',    'jigglypuff.png'),
    ('Eevee',      9500.00,  'normal',   'eevee.png'),
    ('Espeon',    11250.00,  'psychic',  'espeon.png');
