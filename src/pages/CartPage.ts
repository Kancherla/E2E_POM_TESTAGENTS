import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartList = '.cart_list';
  readonly cartItem = '.cart_item';
  readonly cartQuantity = '.cart_quantity';
  readonly itemNameSelector = '.inventory_item_name';
  readonly itemPriceSelector = '.inventory_item_price';
  readonly continueShoppingBtn = '[data-test="continue-shopping"]';
  readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.cartItem).count();
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator(this.itemNameSelector).allInnerTexts();
  }

  async getItemPrice(itemName: string): Promise<string> {
    const item = this.page.locator(this.cartItem).filter({ hasText: itemName });
    return await item.locator(this.itemPriceSelector).innerText();
  }

  /** Remove an item from the cart page by its full display name. */
  async removeItem(itemName: string): Promise<void> {
    const nameToDataTest: Record<string, string> = {
      'Sauce Labs Backpack': 'sauce-labs-backpack',
      'Sauce Labs Bike Light': 'sauce-labs-bike-light',
      'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
      'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
      'Sauce Labs Onesie': 'sauce-labs-onesie',
      'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)',
    };
    const dataTest = nameToDataTest[itemName];
    if (!dataTest) throw new Error(`Unknown product name for removeItem: "${itemName}"`);
    await this.click(`[data-test="remove-${dataTest}"]`);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingBtn);
    await this.page.waitForURL('**/inventory.html');
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
    await this.page.waitForURL('**/checkout-step-one.html');
  }
}
