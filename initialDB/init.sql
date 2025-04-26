-- connect to the database

\connect weather_app;

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS weather_app;


-- Create the segestions_city table if it doesn't exist
CREATE TABLE IF NOT EXISTS weather_app.suggestions_city (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add top 100 cities to the suggestions_city table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM weather_app.suggestions_city) THEN
        INSERT INTO weather_app.suggestions_city (city) VALUES
        ('Tokyo'),
        ('Delhi'),
        ('Shanghai'),
        ('São Paulo'),
        ('Mexico City'),
        ('Cairo'),
        ('Dhaka'),
        ('Mumbai'),
        ('Beijing'),
        ('Osaka'),
        ('New York City'),
        ('Karachi'),
        ('Chongqing'),
        ('Istanbul'),
        ('Buenos Aires'),
        ('Kolkata'),
        ('Kinshasa'),
        ('Manila'),
        ('Rio de Janeiro'),
        ('Tianjin'),
        ('Guangzhou'),
        ('Lagos'),
        ('Moscow'),
        ('Lima'),
        ('Bangkok'),
        ('Chennai'),
        ('Hyderabad'),
        ('London'),
        ('Paris'),
        ('Bogotá'),
        ('Chennai'),
        ('Chengdu'),
        ('Nanjing'),
        ('Wuhan'),
        ('Hangzhou'),
        ('Shenzhen'),
        ('Ahmedabad'),
        ('Kuala Lumpur'),
        ('Xi’an'),
        ('Hong Kong'),
        ('Dongguan'),
        ('Hanoi'),
        ('Bangalore'),
        ('Ho Chi Minh City'),
        ('Riyadh'),
        ('Santiago'),
        ('Alexandria'),
        ('Abidjan'),
        ('Ankara'),
        ('Addis Ababa'),
        ('Dar es Salaam'),
        ('Baghdad'),
        ('Kabul'),
        ('Casablanca'),
        ('Tashkent'),
        ('Kuwait City'),
        ('Accra'),
        ('Port-au-Prince'),
        ('Nairobi'),
        ('Algiers'),
        ('Lahore'),
        ('Dhaka'),
        ('Helsinki'),
        ('Vienna'),
        ('Budapest'),
        ('Athens'),
        ('Lisbon'),
        ('Copenhagen'),
        ('Oslo'),
        ('Stockholm'),
        ('Brussels'),
        ('Amsterdam'),
        ('Zurich'),
        ('Geneva'),
        ('Prague'),
        ('Warsaw'),
        ('Bucharest'),
        ('Sofia'),
        ('Sarajevo'),
        ('Zagreb'),
        ('Bratislava');
    END IF;
END $$;

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
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES weather_app.users(id) ON DELETE CASCADE
);




