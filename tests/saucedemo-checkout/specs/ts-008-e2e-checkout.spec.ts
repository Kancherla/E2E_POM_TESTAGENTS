import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { products, checkoutInfo } from '../fixtures/testData';
import { parsePrice } from '../utils/helpers';

test.describe('TS-008: End-to-End Checkout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStep1: CheckoutStepOnePage;
  let checkoutStep2: CheckoutStepTwoPage;
  let checkoutComplete: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStep1 = new CheckoutStepOnePage(page);
    checkoutStep2 = new CheckoutStepTwoPage(page);
    checkoutComplete = new CheckoutCompletePage(page);
  });

  // TC-E2E-001: Full happy path — login → add 2 items → cart → checkout → complete
  test('TC-E2E-001: Full happy path — login, add 2 items, cart, checkout, complete', async ({
    page,
  }) => {
    // Step 1: Login
    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
    await expect(page).toHaveURL(/inventory\.html/);

    // Step 2: Add two items and verify badge
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.addItemToCart('bike light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Step 3: Navigate to cart and verify both items are present
    await inventoryPage.navigateToCart();
    const cartNames = await cartPage.getItemNames();
    expect(cartNames).toContain(products.backpack.name);
    expect(cartNames).toContain(products.bikeLight.name);
    expect(await cartPage.getCartItemCount()).toBe(2);

    // Step 4: Proceed through checkout step 1
    await cartPage.proceedToCheckout();
    await checkoutStep1.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode,
    );
    await checkoutStep1.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 5: Verify order overview totals and payment/shipping info
    const itemTotalText  = await checkoutStep2.getItemTotal();
    const orderTotalText = await checkoutStep2.getOrderTotal();
    const itemTotal      = parsePrice(itemTotalText.replace('Item total: $', ''));
    const orderTotal     = parsePrice(orderTotalText.replace('Total: $', ''));
    const expectedItemTotal =
      parsePrice(products.backpack.price) + parsePrice(products.bikeLight.price);

    expect(itemTotal).toBeCloseTo(expectedItemTotal, 2);
    expect(orderTotal).toBeGreaterThan(itemTotal); // order total includes tax

    expect(await checkoutStep2.getPaymentInfo()).toBe('SauceCard #31337');
    expect(await checkoutStep2.getShippingInfo()).toBe('Free Pony Express Delivery!');

    // Step 6: Finish the order
    await checkoutStep2.finishOrder();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Step 7: Verify completion state
    expect(await checkoutComplete.isOrderComplete()).toBe(true);
    expect(await checkoutComplete.getConfirmationHeading()).toBe('Thank you for your order!');
    expect(await checkoutComplete.isCartBadgeVisible()).toBe(false);
  });

  // TC-E2E-002: Cancel at Step 1 — return to cart, items still present
  test('TC-E2E-002: Cancel at Checkout Step 1 returns to cart with items intact', async ({
    page,
  }) => {
    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.navigateToCart();

    // Confirm item is in cart before entering checkout
    expect(await cartPage.getCartItemCount()).toBe(1);

    // Enter checkout and immediately cancel
    await cartPage.proceedToCheckout();
    await checkoutStep1.cancel();

    // Verify back on cart with item still present
    await expect(page).toHaveURL(/cart\.html/);
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.getItemNames()).toContain(products.backpack.name);
  });

  // TC-E2E-003: Cancel at Step 2 — returns to inventory (known UX quirk)
  test('TC-E2E-003: Cancel at Checkout Step 2 returns to inventory page', async ({ page }) => {
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
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Cancel on Step 2 — UX quirk: goes to /inventory.html, NOT /cart.html
    await checkoutStep2.cancelOrder();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
