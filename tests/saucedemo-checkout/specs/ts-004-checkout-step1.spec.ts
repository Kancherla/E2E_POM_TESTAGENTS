import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../../src/pages/CheckoutStepOnePage';
import { checkoutInfo, errorMessages } from '../../../src/fixtures/testData';

test.describe('TS-004: Checkout Step 1 - Customer Information', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStep1: CheckoutStepOnePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStep1 = new CheckoutStepOnePage(page);

    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.loginWithValidCredentials();
    await inventoryPage.addItemToCart('backpack');
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
  });

  // TC-019: All form fields and buttons are present
  test('TC-019: Checkout form fields are present', async ({ page }) => {
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
  });

  // TC-020: Empty form submit — sequential validation, First Name fires first
  test('TC-020: Empty form submit shows "First Name is required"', async () => {
    await checkoutStep1.continue();
    expect(await checkoutStep1.isErrorVisible()).toBe(true);
    expect(await checkoutStep1.getErrorMessage()).toBe(errorMessages.firstNameRequired);
  });

  // TC-021: First Name filled, Last Name missing
  test('TC-021: Missing Last Name shows "Last Name is required"', async () => {
    await checkoutStep1.fillCustomerInfo(
      checkoutInfo.missingLast.firstName,
      checkoutInfo.missingLast.lastName,
      checkoutInfo.missingLast.postalCode,
    );
    await checkoutStep1.continue();
    expect(await checkoutStep1.isErrorVisible()).toBe(true);
    expect(await checkoutStep1.getErrorMessage()).toBe(errorMessages.lastNameRequired);
  });

  // TC-022: First and Last Name filled, Postal Code missing
  test('TC-022: Missing Postal Code shows "Postal Code is required"', async () => {
    await checkoutStep1.fillCustomerInfo(
      checkoutInfo.missingZip.firstName,
      checkoutInfo.missingZip.lastName,
      checkoutInfo.missingZip.postalCode,
    );
    await checkoutStep1.continue();
    expect(await checkoutStep1.isErrorVisible()).toBe(true);
    expect(await checkoutStep1.getErrorMessage()).toBe(errorMessages.postalCodeRequired);
  });

  // TC-023: Valid form proceeds to Step 2
  test('TC-023: Valid form proceeds to Checkout Step 2', async ({ page }) => {
    await checkoutStep1.fillCustomerInfo(
      checkoutInfo.valid.firstName,
      checkoutInfo.valid.lastName,
      checkoutInfo.valid.postalCode,
    );
    await checkoutStep1.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  // TC-024: Cancel returns to cart
  test('TC-024: Cancel returns to cart page', async ({ page }) => {
    await checkoutStep1.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
