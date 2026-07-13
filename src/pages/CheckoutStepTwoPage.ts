import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly itemTotalLabel = '.summary_subtotal_label';
  readonly taxLabel = '.summary_tax_label';
  readonly orderTotalLabel = '.summary_total_label';
  readonly valueLabels = '.summary_value_label';
  readonly finishButton = '[data-test="finish"]';
  readonly cancelButton = '[data-test="cancel"]';
  readonly cartItem = '.cart_item';
  readonly itemNameSelector = '.inventory_item_name';
  readonly itemPriceSelector = '.inventory_item_price';

  constructor(page: Page) {
    super(page);
  }

  async getItemTotal(): Promise<string> {
    return await this.getText(this.itemTotalLabel);
  }

  async getTax(): Promise<string> {
    return await this.getText(this.taxLabel);
  }

  async getOrderTotal(): Promise<string> {
    return await this.getText(this.orderTotalLabel);
  }

  /** Returns the first .summary_value_label — "SauceCard #31337". */
  async getPaymentInfo(): Promise<string> {
    return await this.page.locator(this.valueLabels).nth(0).innerText();
  }

  /** Returns the second .summary_value_label — "Free Pony Express Delivery!". */
  async getShippingInfo(): Promise<string> {
    return await this.page.locator(this.valueLabels).nth(1).innerText();
  }

  async finishOrder(): Promise<void> {
    await this.click(this.finishButton);
    await this.page.waitForURL('**/checkout-complete.html');
  }

  /** Cancel on Step 2 navigates to /inventory.html (known UX quirk — NOT the cart). */
  async cancelOrder(): Promise<void> {
    await this.click(this.cancelButton);
    await this.page.waitForURL('**/inventory.html');
  }

  async getOrderedItemNames(): Promise<string[]> {
    return await this.page.locator(this.itemNameSelector).allInnerTexts();
  }
}
