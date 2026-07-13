export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_pass' },
};

export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: '$29.99', dataTest: 'sauce-labs-backpack' },
  bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99', dataTest: 'sauce-labs-bike-light' },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    dataTest: 'sauce-labs-bolt-t-shirt',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    dataTest: 'sauce-labs-fleece-jacket',
  },
  onesie: { name: 'Sauce Labs Onesie', price: '$7.99', dataTest: 'sauce-labs-onesie' },
  redTShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
    dataTest: 'test.allthethings()-t-shirt-(red)',
  },
};

export const checkoutInfo = {
  valid: { firstName: 'John', lastName: 'Doe', postalCode: '10001' },
  missingFirst: { firstName: '', lastName: 'Doe', postalCode: '10001' },
  missingLast: { firstName: 'John', lastName: '', postalCode: '10001' },
  missingZip: { firstName: 'John', lastName: 'Doe', postalCode: '' },
};

export const errorMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};
