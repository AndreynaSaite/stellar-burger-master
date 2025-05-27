declare namespace Cypress {
  interface Chainable {
    addFillings(type: string): Chainable<void>;
  }
}
