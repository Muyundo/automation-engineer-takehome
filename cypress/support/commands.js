Cypress.Commands.add('login', (email, password) => {
    // Visit the login page
  cy.visit('/login', { timeout: 60000 })
  cy.get('[data-testid="login-email-input"]').clear().type(email)
  cy.get('[data-testid="login-password-input"]').clear().type(password)

  cy.get('[data-testid="login-submit-button"]').click()
})


// Custom commands for logging in as different user roles
Cypress.Commands.add('loginAsRequester', () => {
  cy.login(
    Cypress.env('REQUESTER_EMAIL'),
    Cypress.env('REQUESTER_PASSWORD')
  )
})

Cypress.Commands.add('loginAsReviewer', () => {
  cy.login(
    Cypress.env('REVIEWER_EMAIL'),
    Cypress.env('REVIEWER_PASSWORD')
  )
})

Cypress.Commands.add('loginAsClaimer', () => {
  cy.login(
    Cypress.env('CLAIMER_EMAIL'),
    Cypress.env('CLAIMER_PASSWORD')
  )
})