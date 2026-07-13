import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly confirmationHeading = 'h2.complete-header';
  readonly confirmationText = '.complete-text';
  readonly backHomeButton = '[data-test="back-to-products"]';
  readonly cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  async getConfirmationHeading(): Promise<string> {
    return await this.getText(this.confirmationHeading);
  }

  async getConfirmationText(): Promise<string> {
    return await this.getText(this.confirmationText);
  }

  async backToProducts(): Promise<void> {
    await this.click(this.backHomeButton);
    await this.page.waitForURL('**/inventory.html');
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.isVisible(this.confirmationHeading);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isVisible(this.cartBadge);
  }
}
