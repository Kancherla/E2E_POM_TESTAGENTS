import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationMenu } from '../components/NavigationMenu';
import { users, errorMessages } from '../fixtures/testData';

test.describe('TS-001: Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate('https://www.saucedemo.com');
  });

  // TC-001: Valid login redirects to /inventory.html
  test('TC-001: Valid login redirects to inventory page', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // TC-002: Invalid credentials show specific error
  test('TC-002: Invalid credentials show error message', async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toBe(errorMessages.invalidCredentials);
  });

  // TC-003: Empty username field
  test('TC-003: Empty username shows "Username is required"', async () => {
    await loginPage.login('', users.standard.password);
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toBe(errorMessages.usernameRequired);
  });

  // TC-004: Empty password field
  test('TC-004: Empty password shows "Password is required"', async () => {
    await loginPage.login(users.standard.username, '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toBe(errorMessages.passwordRequired);
  });

  // TC-005: Both fields empty — validation fires on username first
  test('TC-005: Both fields empty shows "Username is required"', async () => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toBe(errorMessages.usernameRequired);
  });

  // TC-006: Locked-out user
  test('TC-006: Locked out user shows locked out error', async () => {
    await loginPage.login(users.locked.username, users.locked.password);
    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toBe(errorMessages.lockedOut);
  });

  // TC-007: Logout clears session — subsequent visit to /inventory redirects to login
  test('TC-007: Logout via menu returns to login page and clears session', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await page.waitForURL('**/inventory.html');

    const navMenu = new NavigationMenu(page);
    await navMenu.logout();

    // Should be on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Navigating directly to inventory must redirect back to login (session cleared)
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
