-- Drop existing tables if they exist
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS review_images CASCADE;
DROP TABLE IF EXISTS review_videos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    bio VARCHAR(500),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Create books table
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover VARCHAR(255),
    rating DOUBLE PRECISION,
    genre VARCHAR(100),
    description VARCHAR(2000),
    published_year INTEGER,
    page_count INTEGER
);

-- Create reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id),
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    user_avatar VARCHAR(255),
    rating INTEGER NOT NULL,
    content VARCHAR(2000) NOT NULL,
    date TIMESTAMP NOT NULL,
    likes INTEGER DEFAULT 0
);

-- Create review_images table
CREATE TABLE review_images (
    review_id BIGINT NOT NULL REFERENCES reviews(id),
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (review_id, image_url)
);

-- Create review_videos table
CREATE TABLE review_videos (
    review_id BIGINT NOT NULL REFERENCES reviews(id),
    video_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (review_id, video_url)
);

-- Create bookmarks table
CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    book_id BIGINT NOT NULL REFERENCES books(id),
    date_added TIMESTAMP NOT NULL,
    UNIQUE(user_id, book_id)
); 