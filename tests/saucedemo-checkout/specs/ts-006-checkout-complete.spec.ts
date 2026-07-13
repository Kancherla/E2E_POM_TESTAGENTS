import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../../src/pages/CheckoutCompletePage';
import { checkoutInfo } from '../../../src/fixtures/testData';

test.describe('TS-006: Checkout Complete', () => {
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

    // Drive the full checkout flow so every test starts at checkout-complete
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
    await checkoutStep2.finishOrder();
    await page.waitForURL('**/checkout-complete.html');
  });

  // TC-030: Confirmation heading is visible
  test('TC-030: "Thank you for your order!" heading is shown', async () => {
    expect(await checkoutComplete.isOrderComplete()).toBe(true);
    expect(await checkoutComplete.getConfirmationHeading()).toBe('Thank you for your order!');
  });

  // TC-031: Cart badge disappears after successful order
  test('TC-031: Cart badge is absent after order completion', async () => {
    expect(await checkoutComplete.isCartBadgeVisible()).toBe(false);
  });

  // TC-032: Back Home returns to inventory
  test('TC-032: Back Home button returns to inventory page', async ({ page }) => {
    await checkoutComplete.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
