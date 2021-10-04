SET client_encoding = 'UTF8';

CREATE TABLE users (
  id SERIAL NOT NULL,
  name varchar(20) NOT NULL,
  email varchar(64) NOT NULL,
  pass varchar(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO users (name, email, pass) VALUES
('sam', 'sample01@example.com', 'sample01'),
('tom', 'sample02@example.com', 'sample02'),
('jerry', 'sample03@example.com', 'sample03')
;

CREATE TABLE rundatas (
  id SERIAL NOT NULL,
  time datetime NOT NULL,
  distance varchar(200) NOT NULL,
  user_id SERIAL NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id),
);

INSERT INTO rundatas (time, distance, user_id) VALUES
('2021-06-06 01:00:00', '10000', 1),
('2021-09-09 02:43:00', '25400', 1),
('2021-10-01 02:00:00', '18800', 1)
;