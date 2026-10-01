DROP TABLE IF EXISTS markets;

CREATE TABLE markets (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  specialty TEXT NOT NULL,
  hours TEXT NOT NULL,
  price_range TEXT NOT NULL,
  best_for TEXT NOT NULL,
  vibe TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  photo_credit TEXT NOT NULL
);