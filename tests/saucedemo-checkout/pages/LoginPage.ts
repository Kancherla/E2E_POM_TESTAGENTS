import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { users } from '../fixtures/testData';

export class LoginPage extends BasePage {
  readonly usernameInput = '[data-test="username"]';
  readonly passwordInput = '[data-test="password"]';
  readonly loginButton = '[data-test="login-button"]';
  readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async loginWithValidCredentials(): Promise<void> {
    await this.login(users.standard.username, users.standard.password);
    await this.page.waitForURL('**/inventory.html');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async dismissError(): Promise<void> {
    // The × button lives inside the error container
    await this.page.locator(this.errorMessage).locator('button').click();
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
