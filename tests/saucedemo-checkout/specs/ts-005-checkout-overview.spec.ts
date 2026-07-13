import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../../src/pages/CheckoutStepTwoPage';
import { checkoutInfo, products } from '../../../src/fixtures/testData';
import { parsePrice } from '../../../src/utils/helpers';

test.describe('TS-005: Checkout Step 2 - Order Overview', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStep1: CheckoutStepOnePage;
  let checkoutStep2: CheckoutStepTwoPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStep1 = new CheckoutStepOnePage(page);
    checkoutStep2 = new CheckoutStepTwoPage(page);

    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutStep1.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode,
    );
    await checkoutStep1.continue();
    await page.waitForURL('**/checkout-step-two.html');
  });

  // TC-025: Subtotal, tax, and total are mathematically consistent
  test('TC-025: Overview shows correct subtotal, tax, and total', async () => {
    const itemTotalText = await checkoutStep2.getItemTotal();   // "Item total: $29.99"
    const taxText       = await checkoutStep2.getTax();         // "Tax: $2.40"
    const orderTotalText = await checkoutStep2.getOrderTotal(); // "Total: $32.39"

    const itemTotal  = parsePrice(itemTotalText.replace('Item total: $', ''));
    const tax        = parsePrice(taxText.replace('Tax: $', ''));
    const orderTotal = parsePrice(orderTotalText.replace('Total: $', ''));

    // Order total must equal item total + tax
    expect(orderTotal).toBeCloseTo(itemTotal + tax, 2);
    // Backpack should be the only item
    expect(itemTotal).toBeCloseTo(parsePrice(products.backpack.price), 2);
  });

  // TC-026: Payment info is SauceCard #31337
  test('TC-026: Payment info shows "SauceCard #31337"', async () => {
    expect(await checkoutStep2.getPaymentInfo()).toBe('SauceCard #31337');
  });

  // TC-027: Shipping info is Free Pony Express
  test('TC-027: Shipping info shows "Free Pony Express Delivery!"', async () => {
    expect(await checkoutStep2.getShippingInfo()).toBe('Free Pony Express Delivery!');
  });

  // TC-028: Finish navigates to checkout-complete
  test('TC-028: Finish button navigates to checkout complete page', async ({ page }) => {
    await checkoutStep2.finishOrder();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  // TC-029: Cancel returns to inventory — NOT the cart (known UX quirk)
  test('TC-029: Cancel returns to inventory page (UX quirk — not cart)', async ({ page }) => {
    await checkoutStep2.cancelOrder();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
