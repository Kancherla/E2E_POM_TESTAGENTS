import { Page } from '@playwright/test';

/**
 * Maps a full product display name to its data-test attribute fragment.
 * Used to dynamically build selectors like [data-test="add-to-cart-{fragment}"].
 */
export function productNameToDataTest(name: string): string {
  const nameMap: Record<string, string> = {
    'Sauce Labs Backpack': 'sauce-labs-backpack',
    'Sauce Labs Bike Light': 'sauce-labs-bike-light',
    'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
    'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
    'Sauce Labs Onesie': 'sauce-labs-onesie',
    'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)',
  };
  const dataTest = nameMap[name];
  if (!dataTest) throw new Error(`Unknown product name: "${name}"`);
  return dataTest;
}

/**
 * Parses a price string such as "$29.99" or "29.99" to a float.
 */
export function parsePrice(priceText: string): number {
  return parseFloat(priceText.replace('$', '').trim());
}

/**
 * Waits for the page URL to match a specific path pattern.
 */
export async function waitForNavigation(page: Page, urlPattern: string): Promise<void> {
  await page.waitForURL(`**${urlPattern}`);
}
