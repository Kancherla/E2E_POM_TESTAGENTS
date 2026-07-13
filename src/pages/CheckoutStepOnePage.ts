import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput = '[data-test="firstName"]';
  readonly lastNameInput = '[data-test="lastName"]';
  readonly postalCodeInput = '[data-test="postalCode"]';
  readonly continueButton = '[data-test="continue"]';
  readonly cancelButton = '[data-test="cancel"]';
  readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async fillCustomerInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async cancel(): Promise<void> {
    await this.click(this.cancelButton);
    await this.page.waitForURL('**/cart.html');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
