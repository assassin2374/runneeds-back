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

CREATE TABLE activities (
  id SERIAL NOT NULL,
  start_time TIMESTAMP NOT NULL,
  goal_time TIMESTAMP NOT NULL,
  distance int NOT NULL,
  user_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO activities (start_time, goal_time, distance, user_id) VALUES
('2021-06-06 18:00:00', '2021-06-06 19:00:00', 10000, 1),
('2021-09-09 19:00:00', '2021-09-09 21:43:00', 25400, 1),
('2021-10-01 18:00:00', '2021-10-01 20:00:00', 18800, 1)
;