import { Page } from '@playwright/test';
import * as path from 'path';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).innerText();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * No-op placeholder. page.goto() waits for the load event by default.
   * For post-action synchronisation use page.waitForURL() directly.
   */
  async waitForPageLoad(): Promise<void> {
    // page.goto() already awaits the load event.
    // Override in subclasses or call page.waitForURL() at the call-site as needed.
  }

  async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = path.join(
      'tests',
      'saucedemo-checkout',
      'screenshots',
      `${name}-${Date.now()}.png`,
    );
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
