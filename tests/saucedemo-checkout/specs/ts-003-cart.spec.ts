import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users, products } from '../fixtures/testData';

test.describe('TS-003: Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
    // Add two items then navigate to cart for every test
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.addItemToCart('bike light');
    await inventoryPage.navigateToCart();
  });

  // TC-015: Cart shows all added items with correct name and price
  test('TC-015: Cart displays all added items with name and price', async () => {
    expect(await cartPage.getCartItemCount()).toBe(2);

    const names = await cartPage.getItemNames();
    expect(names).toContain(products.backpack.name);
    expect(names).toContain(products.bikeLight.name);

    expect(await cartPage.getItemPrice(products.backpack.name)).toBe(products.backpack.price);
    expect(await cartPage.getItemPrice(products.bikeLight.name)).toBe(products.bikeLight.price);
  });

  // TC-016: Remove item from cart
  test('TC-016: Remove item from cart', async () => {
    await cartPage.removeItem(products.backpack.name);
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.getItemNames()).not.toContain(products.backpack.name);
  });

  // TC-017: Continue Shopping returns to inventory
  test('TC-017: Continue Shopping returns to inventory', async ({ page }) => {
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // TC-018: Checkout button present and navigates to Step 1
  test('TC-018: Proceed to Checkout button is present and navigates to checkout', async ({
    page,
  }) => {
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
