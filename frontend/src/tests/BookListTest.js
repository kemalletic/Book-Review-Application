const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Book List Page Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('should display book list and navigate to book details', async () => {
        // Navigate to the book list page
        await driver.get('http://localhost:3000/books');

        // Wait for the book list to load
        await driver.wait(until.elementLocated(By.className('book-list')), 5000);

        // Verify that books are displayed
        const bookElements = await driver.findElements(By.className('book-card'));
        expect(bookElements.length).toBeGreaterThan(0);

        // Click on the first book
        await bookElements[0].click();

        // Wait for the book details page to load
        await driver.wait(until.elementLocated(By.className('book-details')), 5000);

        // Verify that we're on the book details page
        const bookTitle = await driver.findElement(By.className('book-title'));
        expect(await bookTitle.isDisplayed()).toBe(true);
    }, 10000);

    test('should filter books by search term', async () => {
        // Navigate to the book list page
        await driver.get('http://localhost:3000/books');

        // Wait for the search input to be available
        const searchInput = await driver.wait(
            until.elementLocated(By.className('search-input')),
            5000
        );

        // Enter a search term
        await searchInput.sendKeys('Test Book');

        // Wait for the filtered results
        await driver.wait(until.elementLocated(By.className('book-list')), 5000);

        // Verify that the filtered results are displayed
        const bookElements = await driver.findElements(By.className('book-card'));
        expect(bookElements.length).toBeGreaterThan(0);
    }, 10000);
}); 