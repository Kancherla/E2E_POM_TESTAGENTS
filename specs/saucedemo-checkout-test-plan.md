# SauceDemo E-Commerce Checkout Test Plan

## Application Overview

Comprehensive test plan for the Swag Labs e-commerce application at https://www.saucedemo.com. The application is a demo e-commerce site used for testing automation. It supports multiple user personas (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user) all sharing password 'secret_sauce'. The full workflow covers: Login → Inventory/Products → Cart → Checkout Step 1 (Customer Info) → Checkout Step 2 (Overview) → Checkout Complete. Key business rules: all checkout form fields are mandatory, users must be authenticated to access any page beyond login, cart must not be empty to proceed to checkout, order completion clears the cart. Explored UI data: 6 products available (Sauce Labs Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings() T-Shirt (Red) $15.99). Cart badge updates in real-time. Cart item quantity is fixed at 1 per product. Payment method is always 'SauceCard #31337'. Shipping is 'Free Pony Express Delivery!'. Tax rate applies to item total. After order completion a 'Generate PDF order' button is available. Notable finding: locked_out_user receives error 'Epic sadface: Sorry, this user has been locked out.' Invalid credentials produce 'Epic sadface: Username and password do not match any user in this service'. Empty username produces 'Epic sadface: Username is required'. Checkout form validation shows field-level error icons and a dismissible error banner (e.g. 'Error: First Name is required').

## Test Scenarios

### 1. TS-001: Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-001 [HIGH] Happy Path Login with valid standard_user credentials

**File:** `tests/ts-001-authentication/TC-001-happy-path-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed with Username field, Password field, and Login button
    - expect: Page title is 'Swag Labs'
    - expect: Accepted usernames panel is visible on the right side
  2. Enter 'standard_user' in the Username field ([data-test='username'])
    - expect: Username field displays 'standard_user'
  3. Enter 'secret_sauce' in the Password field ([data-test='password'])
    - expect: Password field displays masked characters
  4. Click the Login button ([data-test='login-button'])
    - expect: User is redirected to /inventory.html
    - expect: Page title is 'Swag Labs'
    - expect: Products page header shows 'Products'
    - expect: Burger menu icon is visible in the header
    - expect: Cart icon is visible with no badge (empty cart)

#### 1.2. TC-002 [HIGH] Login fails with invalid username and password

**File:** `tests/ts-001-authentication/TC-002-invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed
  2. Enter 'invalid_user' in the Username field
    - expect: Username field shows 'invalid_user'
  3. Enter 'wrong_pass' in the Password field
    - expect: Password field shows masked characters
  4. Click the Login button
    - expect: User remains on the login page (URL does not change)
    - expect: Error banner appears: 'Epic sadface: Username and password do not match any user in this service'
    - expect: Error icon (X image) appears next to Username and Password fields
    - expect: A dismiss button (X) is shown on the error banner

#### 1.3. TC-003 [HIGH] Login fails when Username is empty

**File:** `tests/ts-001-authentication/TC-003-empty-username.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed
  2. Leave the Username field empty
    - expect: Username field is empty
  3. Enter 'secret_sauce' in the Password field
    - expect: Password field shows masked characters
  4. Click the Login button
    - expect: User remains on the login page
    - expect: Error banner appears: 'Epic sadface: Username is required'
    - expect: Error icons appear next to form fields

#### 1.4. TC-004 [HIGH] Login fails when Password is empty

**File:** `tests/ts-001-authentication/TC-004-empty-password.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed
  2. Enter 'standard_user' in the Username field
    - expect: Username field shows 'standard_user'
  3. Leave the Password field empty
    - expect: Password field is empty
  4. Click the Login button
    - expect: User remains on the login page
    - expect: Error banner appears: 'Epic sadface: Password is required'
    - expect: Error icons appear next to form fields

#### 1.5. TC-005 [MEDIUM] Login fails when both Username and Password are empty

**File:** `tests/ts-001-authentication/TC-005-empty-all-fields.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed with empty Username and Password fields
  2. Click the Login button without entering any credentials
    - expect: User remains on the login page
    - expect: Error banner appears: 'Epic sadface: Username is required'
    - expect: Error icons are shown next to the form fields

#### 1.6. TC-006 [HIGH] Login fails with locked_out_user account

**File:** `tests/ts-001-authentication/TC-006-locked-out-user.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed
  2. Enter 'locked_out_user' in the Username field
    - expect: Username field shows 'locked_out_user'
  3. Enter 'secret_sauce' in the Password field
    - expect: Password field shows masked characters
  4. Click the Login button
    - expect: User remains on the login page (URL stays at /)
    - expect: Error banner appears: 'Epic sadface: Sorry, this user has been locked out.'
    - expect: User is NOT redirected to inventory page

#### 1.7. TC-007 [HIGH] Successful logout from the application

**File:** `tests/ts-001-authentication/TC-007-logout.spec.ts`

**Steps:**
  1. Log in as standard_user / secret_sauce and navigate to /inventory.html
    - expect: Inventory page is displayed
  2. Click the 'Open Menu' (hamburger) button in the top-left header
    - expect: Side navigation menu slides open
    - expect: Menu contains: All Items, About, Logout, Reset App State links
  3. Click the 'Logout' link in the side menu
    - expect: User is redirected back to the login page (https://www.saucedemo.com/)
    - expect: Session is cleared — navigating to /inventory.html redirects back to login

### 2. TS-002: Inventory / Products

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-008 [HIGH] Inventory page displays all 6 products with correct details

**File:** `tests/ts-002-inventory/TC-008-product-listing.spec.ts`

**Steps:**
  1. Log in as standard_user / secret_sauce
    - expect: Redirected to /inventory.html
  2. Inspect the product grid
    - expect: Exactly 6 products are displayed: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), Sauce Labs Fleece Jacket ($49.99), Sauce Labs Onesie ($7.99), Test.allTheThings() T-Shirt (Red) ($15.99)
    - expect: Each product card shows: product image, product name link, description text, price, and an 'Add to cart' button
    - expect: Page header shows 'Products' title and a sort dropdown defaulting to 'Name (A to Z)'

#### 2.2. TC-009 [MEDIUM] Sort products by Name (Z to A)

**File:** `tests/ts-002-inventory/TC-009-sort-name-z-to-a.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Products are listed alphabetically A to Z by default
  2. Select 'Name (Z to A)' from the sort dropdown ([data-test='product-sort-container'])
    - expect: Products are re-ordered in reverse alphabetical order
    - expect: First product shown is 'Test.allTheThings() T-Shirt (Red)'
    - expect: Last product shown is 'Sauce Labs Backpack'

#### 2.3. TC-010 [MEDIUM] Sort products by Price (low to high)

**File:** `tests/ts-002-inventory/TC-010-sort-price-low-high.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Products listed in default order
  2. Select 'Price (low to high)' from the sort dropdown
    - expect: Products are ordered by ascending price
    - expect: First product is Sauce Labs Onesie ($7.99)
    - expect: Last product is Sauce Labs Fleece Jacket ($49.99)

#### 2.4. TC-011 [MEDIUM] Sort products by Price (high to low)

**File:** `tests/ts-002-inventory/TC-011-sort-price-high-low.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Products listed in default order
  2. Select 'Price (high to low)' from the sort dropdown
    - expect: Products are ordered by descending price
    - expect: First product is Sauce Labs Fleece Jacket ($49.99)
    - expect: Last product is Sauce Labs Onesie ($7.99)

#### 2.5. TC-012 [HIGH] Add a single product to cart from inventory page

**File:** `tests/ts-002-inventory/TC-012-add-single-item.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Cart badge is not visible (cart empty)
  2. Click the 'Add to cart' button for 'Sauce Labs Backpack' ([data-test='add-to-cart-sauce-labs-backpack'])
    - expect: The button label changes from 'Add to cart' to 'Remove'
    - expect: Cart badge in the header shows '1'

#### 2.6. TC-013 [HIGH] Remove a product from cart via inventory page

**File:** `tests/ts-002-inventory/TC-013-remove-item-from-inventory.spec.ts`

**Steps:**
  1. Log in, navigate to /inventory.html, and add 'Sauce Labs Backpack' to cart
    - expect: Cart badge shows '1', product button shows 'Remove'
  2. Click the 'Remove' button on the same product card
    - expect: Button label reverts to 'Add to cart'
    - expect: Cart badge disappears (cart is empty again)

#### 2.7. TC-014 [HIGH] Add multiple products and verify cart badge count increments

**File:** `tests/ts-002-inventory/TC-014-multiple-items-badge.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Cart badge not visible
  2. Click 'Add to cart' on Sauce Labs Backpack
    - expect: Cart badge shows '1'
  3. Click 'Add to cart' on Sauce Labs Bike Light
    - expect: Cart badge shows '2'
  4. Click 'Add to cart' on Sauce Labs Bolt T-Shirt
    - expect: Cart badge shows '3'

#### 2.8. TC-015 [MEDIUM] View individual product detail page by clicking product name

**File:** `tests/ts-002-inventory/TC-015-product-detail-page.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Inventory page displayed
  2. Click on the product name link 'Sauce Labs Backpack'
    - expect: Product detail page loads
    - expect: Product name, description, price ($29.99), product image, and 'Add to cart' button are displayed
    - expect: A 'Back to products' navigation link is visible
  3. Click 'Add to cart' on the product detail page
    - expect: Button changes to 'Remove'
    - expect: Cart badge shows '1'

### 3. TS-003: Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-016 [HIGH] View cart with added items showing correct product details

**File:** `tests/ts-003-cart/TC-016-view-cart-with-items.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart
    - expect: Cart badge shows '2'
  2. Click the cart icon in the header to navigate to /cart.html
    - expect: Cart page loads with title 'Your Cart'
    - expect: Two items are listed: Sauce Labs Backpack (QTY: 1, $29.99) and Sauce Labs Bike Light (QTY: 1, $9.99)
    - expect: Each item has a 'Remove' button
    - expect: A 'Continue Shopping' button and a 'Checkout' button are visible at the bottom

#### 3.2. TC-017 [HIGH] Remove an item from the cart page

**File:** `tests/ts-003-cart/TC-017-remove-item-from-cart.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack and Sauce Labs Bike Light to cart, then navigate to /cart.html
    - expect: Cart shows 2 items, cart badge shows '2'
  2. Click the 'Remove' button next to 'Sauce Labs Backpack'
    - expect: Sauce Labs Backpack is removed from the cart
    - expect: Only Sauce Labs Bike Light remains in the cart
    - expect: Cart badge updates to '1'

#### 3.3. TC-018 [MEDIUM] Continue Shopping from cart returns to inventory page

**File:** `tests/ts-003-cart/TC-018-continue-shopping.spec.ts`

**Steps:**
  1. Log in, add any item to cart, navigate to /cart.html
    - expect: Cart page is displayed
  2. Click the 'Continue Shopping' button ([data-test='continue-shopping'])
    - expect: User is redirected to /inventory.html
    - expect: Cart badge still shows the number of items added previously
    - expect: Previously added item shows 'Remove' button on inventory page

#### 3.4. TC-019 [HIGH] Proceed to checkout from cart navigates to checkout step 1

**File:** `tests/ts-003-cart/TC-019-proceed-to-checkout.spec.ts`

**Steps:**
  1. Log in, add at least one item to cart, navigate to /cart.html
    - expect: Cart page shows items
  2. Click the 'Checkout' button ([data-test='checkout'])
    - expect: User is redirected to /checkout-step-one.html
    - expect: Page title shows 'Checkout: Your Information'
    - expect: Form fields: First Name, Last Name, Zip/Postal Code are visible and empty
    - expect: Cancel and Continue buttons are visible

#### 3.5. TC-020 [MEDIUM] Empty cart page shows no items and still has checkout button

**File:** `tests/ts-003-cart/TC-020-empty-cart.spec.ts`

**Steps:**
  1. Log in without adding any items and navigate directly to /cart.html
    - expect: Cart page loads with title 'Your Cart'
    - expect: No items are listed in the cart
    - expect: Cart badge is absent from the header
    - expect: 'Continue Shopping' and 'Checkout' buttons are still present

#### 3.6. TC-021 [MEDIUM] Cart persists items after navigating away and returning

**File:** `tests/ts-003-cart/TC-021-cart-persistence.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Fleece Jacket to cart on inventory page
    - expect: Cart badge shows '1'
  2. Navigate to the product detail page, then back to inventory, then to cart
    - expect: Cart still contains Sauce Labs Fleece Jacket
    - expect: Cart badge still shows '1'

### 4. TS-004: Checkout - Customer Info (Step 1)

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-022 [HIGH] Valid form submission with all required fields proceeds to overview

**File:** `tests/ts-004-checkout-info/TC-022-valid-form-submission.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack to cart, navigate to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout step 1 form is displayed with empty First Name, Last Name, Zip/Postal Code fields
  2. Enter 'John' in the First Name field ([data-test='firstName'])
    - expect: First Name field shows 'John'
  3. Enter 'Doe' in the Last Name field ([data-test='lastName'])
    - expect: Last Name field shows 'Doe'
  4. Enter '12345' in the Zip/Postal Code field ([data-test='postalCode'])
    - expect: Zip/Postal Code field shows '12345'
  5. Click the 'Continue' button ([data-test='continue'])
    - expect: User is redirected to /checkout-step-two.html
    - expect: Page title shows 'Checkout: Overview'
    - expect: No validation errors are shown

#### 4.2. TC-023 [HIGH] Empty form submission shows First Name required error

**File:** `tests/ts-004-checkout-info/TC-023-empty-form-validation.spec.ts`

**Steps:**
  1. Log in, add an item to cart, proceed to /checkout-step-one.html
    - expect: Checkout form is displayed with all fields empty
  2. Click the 'Continue' button without filling any fields
    - expect: User remains on /checkout-step-one.html
    - expect: Error banner appears: 'Error: First Name is required'
    - expect: Error icon images appear next to all form fields
    - expect: The Continue button is still visible and active

#### 4.3. TC-024 [HIGH] Missing Last Name shows Last Name required error

**File:** `tests/ts-004-checkout-info/TC-024-missing-last-name.spec.ts`

**Steps:**
  1. Log in, add an item to cart, proceed to /checkout-step-one.html
    - expect: Checkout form is displayed
  2. Enter 'John' in First Name, leave Last Name empty, enter '12345' in Zip/Postal Code
    - expect: First Name shows 'John', Last Name is empty, Zip shows '12345'
  3. Click the 'Continue' button
    - expect: User remains on /checkout-step-one.html
    - expect: Error banner appears: 'Error: Last Name is required'

#### 4.4. TC-025 [HIGH] Missing Zip/Postal Code shows postal code required error

**File:** `tests/ts-004-checkout-info/TC-025-missing-postal-code.spec.ts`

**Steps:**
  1. Log in, add an item to cart, proceed to /checkout-step-one.html
    - expect: Checkout form is displayed
  2. Enter 'John' in First Name, enter 'Doe' in Last Name, leave Zip/Postal Code empty
    - expect: First Name shows 'John', Last Name shows 'Doe', Zip is empty
  3. Click the 'Continue' button
    - expect: User remains on /checkout-step-one.html
    - expect: Error banner appears: 'Error: Postal Code is required'

#### 4.5. TC-026 [HIGH] Dismissing validation error removes the error banner

**File:** `tests/ts-004-checkout-info/TC-026-dismiss-error-banner.spec.ts`

**Steps:**
  1. Log in, add an item to cart, proceed to /checkout-step-one.html, click Continue on empty form
    - expect: Error banner 'Error: First Name is required' is visible
  2. Click the X (dismiss) button on the error banner
    - expect: The error banner is dismissed and no longer visible
    - expect: Form fields remain visible and editable

#### 4.6. TC-027 [HIGH] Cancel on checkout step 1 returns user to cart

**File:** `tests/ts-004-checkout-info/TC-027-cancel-step1.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack to cart, navigate to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout step 1 form is displayed
  2. Click the 'Cancel' button ([data-test='cancel'])
    - expect: User is redirected back to /cart.html
    - expect: Cart still contains Sauce Labs Backpack
    - expect: Cart badge still shows '1'

### 5. TS-005: Checkout - Order Overview (Step 2)

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-028 [HIGH] Order overview displays correct items, prices, tax, and total

**File:** `tests/ts-005-checkout-overview/TC-028-order-summary-display.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart, proceed through checkout step 1 (First Name: John, Last Name: Doe, Zip: 12345) to reach /checkout-step-two.html
    - expect: Checkout: Overview page is displayed
  2. Inspect the order summary section
    - expect: Both products are listed: Sauce Labs Backpack (QTY: 1, $29.99) and Sauce Labs Bike Light (QTY: 1, $9.99)
    - expect: Payment Information section shows: 'SauceCard #31337'
    - expect: Shipping Information section shows: 'Free Pony Express Delivery!'
    - expect: Price Total section shows Item total: $39.98
    - expect: Tax is calculated and shown (e.g., 'Tax: $3.20')
    - expect: Total is the sum of item total and tax (e.g., 'Total: $43.18')

#### 5.2. TC-029 [HIGH] Finish order from overview navigates to checkout complete page

**File:** `tests/ts-005-checkout-overview/TC-029-finish-order.spec.ts`

**Steps:**
  1. Log in, add an item to cart, complete checkout step 1, reach /checkout-step-two.html
    - expect: Order overview page is displayed with a Finish button
  2. Click the 'Finish' button ([data-test='finish'])
    - expect: User is redirected to /checkout-complete.html
    - expect: Page title shows 'Checkout: Complete!'
    - expect: A confirmation message 'Thank you for your order!' is displayed

#### 5.3. TC-030 [HIGH] Cancel on overview returns user to inventory page

**File:** `tests/ts-005-checkout-overview/TC-030-cancel-step2.spec.ts`

**Steps:**
  1. Log in, add an item to cart, complete checkout step 1, reach /checkout-step-two.html
    - expect: Order overview page is displayed
  2. Click the 'Cancel' button ([data-test='cancel'])
    - expect: User is redirected to /inventory.html
    - expect: Cart items are preserved (badge still shows the count)

#### 5.4. TC-031 [MEDIUM] Overview does not display Remove buttons for items (read-only)

**File:** `tests/ts-005-checkout-overview/TC-031-overview-readonly.spec.ts`

**Steps:**
  1. Log in, add items, proceed to /checkout-step-two.html
    - expect: Checkout overview page is shown
  2. Inspect each line item in the overview
    - expect: No 'Remove' buttons are present next to products in the overview
    - expect: Quantities and prices are displayed as read-only text

### 6. TS-006: Checkout Complete

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-032 [HIGH] Checkout complete page shows confirmation message and Pony Express image

**File:** `tests/ts-006-checkout-complete/TC-032-confirmation-page-content.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Backpack to cart, proceed through full checkout flow (step 1: John, Doe, 12345 → step 2 → click Finish), reach /checkout-complete.html
    - expect: Page title shows 'Checkout: Complete!'
    - expect: Pony Express image is displayed (alt='Pony Express')
    - expect: Heading 'Thank you for your order!' is visible
    - expect: Sub-text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!' is displayed
    - expect: 'Back Home' button is visible ([data-test='back-to-products'])
    - expect: 'Generate PDF order' button is visible

#### 6.2. TC-033 [HIGH] Cart is cleared after order completion

**File:** `tests/ts-006-checkout-complete/TC-033-cart-cleared-after-order.spec.ts`

**Steps:**
  1. Log in, add 2 items to cart, complete the full checkout flow to reach /checkout-complete.html
    - expect: Cart badge was showing '2' before order completion
  2. Inspect the header on the checkout-complete page
    - expect: Cart badge is not visible (no number displayed)
    - expect: Cart is empty after order completion

#### 6.3. TC-034 [HIGH] Back Home button from order confirmation returns to inventory with empty cart

**File:** `tests/ts-006-checkout-complete/TC-034-back-home-navigation.spec.ts`

**Steps:**
  1. Complete a full checkout and reach /checkout-complete.html
    - expect: Checkout complete page is displayed with 'Back Home' button
  2. Click the 'Back Home' button ([data-test='back-to-products'])
    - expect: User is redirected to /inventory.html
    - expect: Cart badge is not visible (cart is empty)
    - expect: All 6 products are shown with 'Add to cart' buttons (none showing 'Remove')

### 7. TS-007: Navigation Flow

**Seed:** `tests/seed.spec.ts`

#### 7.1. TC-035 [MEDIUM] Hamburger menu opens and displays all navigation options

**File:** `tests/ts-007-navigation/TC-035-hamburger-menu.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Inventory page is displayed with a hamburger (Open Menu) button in the top-left
  2. Click the 'Open Menu' button ([data-test='open-menu'])
    - expect: Side navigation menu opens/slides in from the left
    - expect: Menu contains: 'All Items' link, 'About' link, 'Logout' link, 'Reset App State' link
    - expect: A 'Close Menu' button (X) is visible at the bottom of the menu
  3. Click the 'Close Menu' button
    - expect: Side navigation menu closes/slides out
    - expect: Main inventory content is fully visible again

#### 7.2. TC-036 [MEDIUM] 'All Items' menu link navigates to inventory page from any page

**File:** `tests/ts-007-navigation/TC-036-all-items-nav.spec.ts`

**Steps:**
  1. Log in, add an item, navigate to /cart.html
    - expect: Cart page is displayed
  2. Open the hamburger menu and click 'All Items'
    - expect: User is redirected to /inventory.html
    - expect: All products are displayed
    - expect: Cart badge still reflects added items

#### 7.3. TC-037 [LOW] 'Reset App State' clears cart and resets product button states

**File:** `tests/ts-007-navigation/TC-037-reset-app-state.spec.ts`

**Steps:**
  1. Log in, add 3 items to cart (verify cart badge shows '3')
    - expect: Cart badge shows '3', product cards show 'Remove' buttons for added items
  2. Open hamburger menu and click 'Reset App State'
    - expect: Cart badge disappears (cart is cleared)
    - expect: All product 'Remove' buttons revert to 'Add to cart'
    - expect: User remains on the current page (no redirect)

#### 7.4. TC-038 [HIGH] Accessing protected pages when not logged in redirects to login

**File:** `tests/ts-007-navigation/TC-038-unauthenticated-access.spec.ts`

**Steps:**
  1. Without logging in, directly navigate to https://www.saucedemo.com/inventory.html
    - expect: User is redirected to https://www.saucedemo.com/
    - expect: Login page is displayed
    - expect: An error banner may appear: 'Epic sadface: You can only access /inventory.html when you are logged in.'
  2. Without logging in, directly navigate to https://www.saucedemo.com/cart.html
    - expect: User is redirected to the login page

#### 7.5. TC-039 [MEDIUM] Cart icon in header navigates to cart page from inventory

**File:** `tests/ts-007-navigation/TC-039-cart-icon-navigation.spec.ts`

**Steps:**
  1. Log in and navigate to /inventory.html
    - expect: Inventory page with cart icon in header
  2. Click the cart icon ([data-test='shopping-cart-link'] or .shopping_cart_link) in the header
    - expect: User is navigated to /cart.html
    - expect: Cart page is displayed with the title 'Your Cart'

#### 7.6. TC-040 [MEDIUM] Browser back button navigates to the previous page in checkout flow

**File:** `tests/ts-007-navigation/TC-040-browser-back-behavior.spec.ts`

**Steps:**
  1. Log in, add an item, proceed through checkout step 1 to reach /checkout-step-two.html
    - expect: Checkout overview page is shown
  2. Press the browser back button
    - expect: User navigates back to /checkout-step-one.html
    - expect: The form fields may be pre-populated with previously entered data or empty depending on browser behavior

### 8. TS-008: End-to-End Flows

**Seed:** `tests/seed.spec.ts`

#### 8.1. TC-041 [HIGH] Complete E2E happy path: login → add single item → checkout → confirmation

**File:** `tests/ts-008-e2e/TC-041-e2e-happy-path-single-item.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is displayed
  2. Log in with standard_user / secret_sauce
    - expect: Redirected to /inventory.html with 6 products
  3. Add 'Sauce Labs Backpack' to cart
    - expect: Cart badge shows '1', button shows 'Remove'
  4. Click the cart icon and navigate to /cart.html
    - expect: Cart shows Sauce Labs Backpack (QTY: 1, $29.99)
  5. Click 'Checkout' button
    - expect: Redirected to /checkout-step-one.html with empty form
  6. Fill in First Name: 'Jane', Last Name: 'Smith', Zip/Postal Code: '90210', then click Continue
    - expect: Redirected to /checkout-step-two.html (Checkout: Overview)
  7. Verify order summary: Sauce Labs Backpack, Payment: SauceCard #31337, Shipping: Free Pony Express Delivery!, Item total: $29.99, Tax shown, Total shown
    - expect: All order details are correct and match the selected item
  8. Click the 'Finish' button
    - expect: Redirected to /checkout-complete.html
    - expect: 'Thank you for your order!' heading is displayed
    - expect: Cart badge is not visible (cart is empty)
  9. Click 'Back Home'
    - expect: Redirected to /inventory.html
    - expect: Cart is empty, all products show 'Add to cart'

#### 8.2. TC-042 [HIGH] Complete E2E happy path: login → add multiple items → full checkout

**File:** `tests/ts-008-e2e/TC-042-e2e-happy-path-multiple-items.spec.ts`

**Steps:**
  1. Log in as standard_user / secret_sauce
    - expect: Inventory page is displayed
  2. Add Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), and Sauce Labs Onesie ($7.99) to cart
    - expect: Cart badge shows '3'
  3. Navigate to cart, verify all 3 items, then click Checkout
    - expect: Cart shows all 3 items. Checkout button navigates to step 1
  4. Fill checkout form: First Name: 'Test', Last Name: 'User', Zip: '10001', click Continue
    - expect: Redirected to /checkout-step-two.html. All 3 items shown in overview
  5. Verify item total = $33.97 (9.99+15.99+7.99), verify tax, verify grand total
    - expect: Item total is $33.97. Tax and total are correctly calculated
  6. Click Finish
    - expect: Redirected to /checkout-complete.html. Confirmation shown. Cart is cleared

#### 8.3. TC-043 [HIGH] Partial checkout: cancel at step 1 preserves cart and returns to cart page

**File:** `tests/ts-008-e2e/TC-043-e2e-cancel-at-step1.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Fleece Jacket ($49.99) to cart, navigate to cart, click Checkout
    - expect: Checkout step 1 form is displayed
  2. Enter some data in the form (First Name: 'Cancel', Last Name: 'Test', Zip: '99999')
    - expect: Form fields are populated
  3. Click the 'Cancel' button
    - expect: User is returned to /cart.html
    - expect: Sauce Labs Fleece Jacket is still in the cart
    - expect: Cart badge still shows '1'

#### 8.4. TC-044 [HIGH] Partial checkout: cancel at step 2 preserves cart and returns to inventory

**File:** `tests/ts-008-e2e/TC-044-e2e-cancel-at-step2.spec.ts`

**Steps:**
  1. Log in, add Sauce Labs Fleece Jacket to cart, proceed through checkout step 1 (valid data) to reach /checkout-step-two.html
    - expect: Checkout overview page is displayed
  2. Click the 'Cancel' button on the overview page
    - expect: User is redirected to /inventory.html
    - expect: Cart badge still shows '1'
    - expect: Sauce Labs Fleece Jacket button shows 'Remove' on inventory page (item still in cart)
