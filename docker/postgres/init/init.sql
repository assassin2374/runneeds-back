SET client_encoding = 'UTF8';

CREATE TABLE users (
  id SERIAL NOT NULL,
  user_name varchar(20) NOT NULL,
  email varchar(64) NOT NULL,
  pass varchar(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id)
);

INSERT INTO users (user_name, email, pass) VALUES
('sam', 'sample01@example.com', 'sample01'),
('tom', 'sample02@example.com', 'sample02'),
('jerry', 'sample03@example.com', 'sample03')
;