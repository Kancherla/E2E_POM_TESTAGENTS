import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, products } from '../fixtures/testData';
import { parsePrice } from '../utils/helpers';

test.describe('TS-002: Inventory', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
  });

  // TC-008: All 6 products present with correct names and prices
  test('TC-008: 6 products shown with correct names and prices', async () => {
    expect(await inventoryPage.getProductCount()).toBe(6);

    const names = await inventoryPage.getProductNames();
    expect(names).toContain(products.backpack.name);
    expect(names).toContain(products.bikeLight.name);
    expect(names).toContain(products.boltTShirt.name);
    expect(names).toContain(products.fleeceJacket.name);
    expect(names).toContain(products.onesie.name);
    expect(names).toContain(products.redTShirt.name);

    const prices = await inventoryPage.getProductPrices();
    expect(prices).toContain(products.backpack.price);
    expect(prices).toContain(products.bikeLight.price);
    expect(prices).toContain(products.onesie.price);
    expect(prices).toContain(products.fleeceJacket.price);
  });

  // TC-009: Sort by Name Z→A
  test('TC-009: Sort by Name Z to A', async () => {
    await inventoryPage.sortProducts('za');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  // TC-010: Sort by Price low→high
  test('TC-010: Sort by Price low to high', async () => {
    await inventoryPage.sortProducts('lohi');
    const priceTexts = await inventoryPage.getProductPrices();
    const prices = priceTexts.map(p => parsePrice(p));
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  // TC-011: Add single item shows badge count 1
  test('TC-011: Add single item — cart badge shows 1', async () => {
    await inventoryPage.addItemToCart('backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  // TC-012: Add multiple items shows correct count
  test('TC-012: Add multiple items — cart badge shows correct count', async () => {
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.addItemToCart('bike light');
    await inventoryPage.addItemToCart('onesie');
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  // TC-013: Remove item decrements badge
  test('TC-013: Remove item from inventory — badge decrements', async () => {
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.addItemToCart('bike light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.removeItemFromCart('backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  // TC-014: Cart icon navigates to cart
  test('TC-014: Cart icon navigates to cart page', async ({ page }) => {
    await inventoryPage.navigateToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
