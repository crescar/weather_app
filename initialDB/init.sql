-- connect to the database

\connect weather_app;

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS weather_app;


-- Create user table if it doesn't exist
CREATE TABLE IF NOT EXISTS weather_app.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS weather_app.favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    city_id INT,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES weather_app.users(id) ON DELETE CASCADE
);




