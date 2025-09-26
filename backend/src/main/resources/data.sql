-- Insert test user for login testing
INSERT INTO users (name, email, password, role, created_at, updated_at)
SELECT 'Test User', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com');

-- Insert admin user if not exists  
INSERT INTO users (name, email, password, role, created_at, updated_at)
SELECT 'Admin', 'admin@bookreview.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@bookreview.com');

-- Insert sample books if not exists
INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT 'The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', 'Fiction', 1925, 180, 4.5, '/uploads/covers/04475726-7445-43c7-b9d0-992185df441d.JPG'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Great Gatsby');

INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT 'To Kill a Mockingbird', 'Harper Lee', 'The story of racial injustice and the loss of innocence in the American South.', 'Fiction', 1960, 281, 4.8, '/uploads/covers/045f866a-1f0e-4775-a7a3-64d4193e92c0.webp'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'To Kill a Mockingbird');

INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT '1984', 'George Orwell', 'A dystopian social science fiction novel and cautionary tale.', 'Science Fiction', 1949, 328, 4.7, '/uploads/covers/11775a73-172b-4e2e-abb5-e7391eaa3989.JPG'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = '1984');

INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT 'Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners that follows the character development of Elizabeth Bennet.', 'Romance', 1813, 432, 4.6, '/uploads/covers/559472e3-d4b9-4f8d-baec-dcf1df91742a.JPG'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Pride and Prejudice');

INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT 'The Hobbit', 'J.R.R. Tolkien', 'A fantasy novel about the adventures of Bilbo Baggins.', 'Fantasy', 1937, 310, 4.7, '/uploads/covers/6562372d-d4dd-4ee7-9a2e-a58ee594eea4.JPG'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Hobbit');

INSERT INTO books (title, author, description, genre, published_year, page_count, rating, cover)
SELECT 'The Catcher in the Rye', 'J.D. Salinger', 'A classic coming-of-age story about teenage alienation and loss of innocence.', 'Fiction', 1951, 277, 4.3, '/uploads/covers/77964352-eef9-4a2c-ba81-60b928187201.JPG'
WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'The Catcher in the Rye');

-- Insert sample reviews
INSERT INTO reviews (book_id, user_id, user_name, rating, content, date)
SELECT 
    (SELECT id FROM books WHERE title = 'The Great Gatsby' LIMIT 1),
    1,
    'Admin User',
    5,
    'A masterpiece of American literature. The prose is beautiful and the story is timeless.',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE book_id = (SELECT id FROM books WHERE title = 'The Great Gatsby' LIMIT 1)
    AND user_id = 1
);

INSERT INTO reviews (book_id, user_id, user_name, rating, content, date)
SELECT 
    (SELECT id FROM books WHERE title = 'To Kill a Mockingbird' LIMIT 1),
    1,
    'Admin User',
    5,
    'A powerful story about justice and racial inequality. A must-read for everyone.',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE book_id = (SELECT id FROM books WHERE title = 'To Kill a Mockingbird' LIMIT 1)
    AND user_id = 1
);

INSERT INTO reviews (book_id, user_id, user_name, rating, content, date)
SELECT 
    (SELECT id FROM books WHERE title = '1984' LIMIT 1),
    1,
    'Admin User',
    4,
    'A chilling dystopian novel that remains relevant today. Orwell''s vision of totalitarianism is haunting.',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE book_id = (SELECT id FROM books WHERE title = '1984' LIMIT 1)
    AND user_id = 1
); 