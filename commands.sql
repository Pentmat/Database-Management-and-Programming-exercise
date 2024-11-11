INSERT INTO Genre (genre_name) VALUES 
('drama'),
('comedy'),
('scifi'),
('fantasy'),
('action'),
('thriller');

INSERT INTO Movie (movie_name, year, genre_id) VALUES 
('Inception', 2010, 5),
('The Terminator', 1984, 5),
('Tropic Thunder', 2008, 2),
('Borat', 2006, 2),
('Interstellar', 2014, 1),
('Joker', 2019, 1);

INSERT INTO User_register (username, name, password, register_time) VALUES 
('reimarii', 'Reima Riihimäki', 'qwerty123', CURRENT_DATE),
('lizzy', 'Lisa Simpson', 'abcdef', CURRENT_DATE),
('boss', 'Ben Bossy', 'salasana', CURRENT_DATE);
