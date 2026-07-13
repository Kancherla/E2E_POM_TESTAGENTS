import { Page } from '@playwright/test';

export class NavigationMenu {
  private page: Page;

  readonly burgerMenuBtn = '#react-burger-menu-btn';
  readonly logoutLink = '#logout_sidebar_link';
  readonly resetLink = '#reset_sidebar_link';

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.locator(this.burgerMenuBtn).click();
    await this.page.locator(this.logoutLink).waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.open();
    await this.page.locator(this.logoutLink).click();
    await this.page.waitForURL('https://www.saucedemo.com/');
  }

  async resetAppState(): Promise<void> {
    await this.open();
    await this.page.locator(this.resetLink).click();
  }
}
