import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // Sort
  readonly sortDropdown = '[data-test="product-sort-container"]';

  // Product containers
  readonly productList = '.inventory_list';
  readonly productItem = '.inventory_item';
  readonly productName = '.inventory_item_name';
  readonly productPrice = '.inventory_item_price';

  // Add to cart buttons (individual selectors per item)
  readonly addBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
  readonly addBikeLight = '[data-test="add-to-cart-sauce-labs-bike-light"]';
  readonly addBoltTShirt = '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]';
  readonly addFleeceJacket = '[data-test="add-to-cart-sauce-labs-fleece-jacket"]';
  readonly addOnesie = '[data-test="add-to-cart-sauce-labs-onesie"]';
  readonly addRedTShirt = '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]';

  // Remove buttons
  readonly removeBackpack = '[data-test="remove-sauce-labs-backpack"]';
  readonly removeBikeLight = '[data-test="remove-sauce-labs-bike-light"]';
  readonly removeBoltTShirt = '[data-test="remove-sauce-labs-bolt-t-shirt"]';
  readonly removeFleeceJacket = '[data-test="remove-sauce-labs-fleece-jacket"]';
  readonly removeOnesie = '[data-test="remove-sauce-labs-onesie"]';
  readonly removeRedTShirt = '[data-test="remove-test.allthethings()-t-shirt-(red)"]';

  // Cart
  readonly cartBadge = '.shopping_cart_badge';
  readonly cartLink = '.shopping_cart_link';

  // Burger menu
  readonly burgerMenu = '#react-burger-menu-btn';

  constructor(page: Page) {
    super(page);
  }

  /** Add an item to cart. Use the short key: 'backpack' | 'bike light' | 'bolt t-shirt' |
   *  'fleece jacket' | 'onesie' | 'red t-shirt' */
  async addItemToCart(itemName: string): Promise<void> {
    const selectorMap: Record<string, string> = {
      backpack: this.addBackpack,
      'bike light': this.addBikeLight,
      'bolt t-shirt': this.addBoltTShirt,
      'fleece jacket': this.addFleeceJacket,
      onesie: this.addOnesie,
      'red t-shirt': this.addRedTShirt,
    };
    const selector = selectorMap[itemName.toLowerCase()];
    if (!selector) throw new Error(`Unknown item for addItemToCart: "${itemName}"`);
    await this.click(selector);
  }

  /** Remove an item from cart while on inventory page. Same keys as addItemToCart. */
  async removeItemFromCart(itemName: string): Promise<void> {
    const selectorMap: Record<string, string> = {
      backpack: this.removeBackpack,
      'bike light': this.removeBikeLight,
      'bolt t-shirt': this.removeBoltTShirt,
      'fleece jacket': this.removeFleeceJacket,
      onesie: this.removeOnesie,
      'red t-shirt': this.removeRedTShirt,
    };
    const selector = selectorMap[itemName.toLowerCase()];
    if (!selector) throw new Error(`Unknown item for removeItemFromCart: "${itemName}"`);
    await this.click(selector);
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    if (!(await badge.isVisible())) return 0;
    return parseInt(await badge.innerText(), 10);
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.page.locator(this.sortDropdown).selectOption(sortOption);
  }

  async getProductCount(): Promise<number> {
    return await this.page.locator(this.productItem).count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator(this.productName).allInnerTexts();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.page.locator(this.productPrice).allInnerTexts();
  }

  async navigateToCart(): Promise<void> {
    await this.click(this.cartLink);
    await this.page.waitForURL('**/cart.html');
  }

  async openMenu(): Promise<void> {
    await this.click(this.burgerMenu);
    await this.page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
  }
}
