-- Update book covers with real book cover URLs
-- Using publicly available book cover images

-- The Great Gatsby - Classic cover
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg' WHERE title = 'The Great Gatsby';

-- To Kill a Mockingbird - Classic cover  
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg' WHERE title = 'To Kill a Mockingbird';

-- 1984 - Classic dystopian cover
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' WHERE title = '1984';

-- Pride and Prejudice - Classic romance cover
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg' WHERE title = 'Pride and Prejudice';

-- The Hobbit - Fantasy adventure cover
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg' WHERE title = 'The Hobbit';

-- The Catcher in the Rye - Coming of age cover
UPDATE books SET cover = 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg' WHERE title = 'The Catcher in the Rye';
