import { Page } from '@playwright/test';

export class Header {
  private page: Page;

  readonly cartBadge = '.shopping_cart_badge';
  readonly cartLink = '.shopping_cart_link';
  readonly pageTitle = '.title';

  constructor(page: Page) {
    this.page = page;
  }

  /** Returns cart badge count, or 0 when the badge is not visible. */
  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    if (!(await badge.isVisible())) return 0;
    return parseInt(await badge.innerText(), 10);
  }

  async clickCartIcon(): Promise<void> {
    await this.page.locator(this.cartLink).click();
    await this.page.waitForURL('**/cart.html');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.locator(this.pageTitle).innerText();
  }
}
