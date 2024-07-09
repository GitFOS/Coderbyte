import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('http://leyaonline.com/');
});

//Searching for a book and checking the description
test('scenario 01', async ({page}) => {
  await page.locator('#searchbar-large').fill('George');

  const booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await expect(booksList.getByText('O Triunfo dos Porcos')).toHaveText('O Triunfo dos Porcos');

  await booksList.locator('.single-search-book-item', {hasText: 'O Triunfo dos Porcos'}).locator('img').click();
  await expect(page.locator('section.sinopse')).toContainText('Quinta Manor');
});

//Searching for a book 1984 and checking the author and details
test('scenario 02', async ({page}) => {
  await page.locator('#searchbar-large').fill('1984');

  const booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: '1984'}).first().locator('img').click();

  await expect(page.locator('section.banner .banner-large').locator('.nome_autor')).toHaveText('GEORGE ORWELL');

  const bookDetails = page.locator('._sinpose-address').getByRole('list');
  await expect(bookDetails.locator('li', {hasText: 'ISBN:'})).toContainText('9789722071550');
  await expect(bookDetails.locator('li', {hasText: 'Páginas:'})).toContainText('344');
  await expect(bookDetails.locator('li', {hasText: 'Dimensões:'})).toContainText('235 x 157 x 23 mm');
});

//Searching for a book and comparing the same author
test('scenario 03', async ({page}) => {
  await page.locator('#searchbar-large').fill('1984');

  let booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: '1984'}).first().locator('img').click();

  const bookAuthor = await page.locator('section.banner .banner-large').locator('.nome_autor').textContent();
  expect(bookAuthor).toEqual('GEORGE ORWELL');

  await page.locator('#searchbar-large').clear();
  await page.locator('#searchbar-large').fill('A Quinta dos Animais');

  booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: 'A Quinta dos Animais'}).first().locator('img').click();

  await expect(page.locator('.nome_autor').first()).toHaveText(bookAuthor as string);
});

//Adding a book to the cart and checking the expected quantity
test('scenario 04', async ({page}) => {
  await page.locator('#searchbar-large').fill('1984');

  const booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: '1984'}).first().locator('img').click();

  await page.locator('.choose-options').locator('div.book').getByRole('link').click();

  await page.locator('.add-to-cart').click();
  await expect(page.locator('.atc-count .b-count')).toHaveText('1');
});

//Changing the theme to dark mode and checking the background color
test('scenario 05', async ({page}) => {
  await page.locator('#darkmode').click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(30, 31, 30)');
});

//Adding a book to the cart and removing it
test('scenario 06', async ({page}) => {
  await page.locator('#searchbar-large').fill('1984');

  const booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: '1984'}).first().locator('img').click();

  await page.locator('.choose-options').locator('div.book').getByRole('link').click();

  await page.locator('.add-to-cart').click();
  await page.locator('.icon-garbage').first().click();

  await expect(page.getByText('Carrinho Vazio')).toBeInViewport();
});

//Adding a book to the cart and checking out
test('scenario 07', async ({page}) => {
  await page.locator('#searchbar-large').fill('1984');

  const booksList = page.locator('.search-books-details');
  await booksList.waitFor({state: 'attached'});
  await booksList.locator('.single-search-book-item', {hasText: '1984'}).first().locator('img').click();

  await page.locator('.choose-options').locator('div.book').getByRole('link').click();

  await page.locator('.add-to-cart').click();
  await page.getByText('checkout').click();

  expect(page.url()).toBe('https://leyaonline.com/pt/loja/carrinho.php');
});
