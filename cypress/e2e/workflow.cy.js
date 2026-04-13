describe('End-to-End Workflow', () => {

  it('should complete full request lifecycle', () => {

    const requestText = `Request-${Date.now()}`

    // REQUESTER
    cy.loginAsRequester()
    cy.url().should('include', '/dashboard')

    // Create request
    cy.contains('New Request').click()
    cy.get('[data-testid="request-title-input"]').type(requestText)
    cy.get('[data-testid="request-description-input"]')
      .type('Request created by Cypress E2E test.')
    cy.contains('Submit Request').click()

    // Wait for AI → Ready for Review
    cy.contains(requestText, { timeout: 60000 })
      .parent()
      .as('requestRow')

    cy.get('@requestRow')
      .find('[data-testid="request-status"]', { timeout: 60000 })
      .should('contain.text', 'ready for review')
    cy.contains('Logout').click()


    //  REVIEWER
    cy.loginAsReviewer()
    cy.url().should('include', '/dashboard')

    cy.get('[data-testid="search-input"]').type(requestText)

    cy.contains(requestText, { timeout: 10000 })
      .parent()
      .as('requestRow')

    cy.get('@requestRow')
      .find('[data-testid^="request-link-"]')
      .click()

    cy.url().should('include', '/requests/')

    // Approve request
    cy.contains('Approve').click()

    cy.get('#approve-modal', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Confirm').click()
      })

    // Verify approved
    cy.get('[data-testid="request-status"]')
      .should('contain.text', 'approved')
    cy.contains('Logout').click()



    // CLAIMER
    cy.loginAsClaimer()
    cy.url().should('include', '/dashboard')

    cy.get('[data-testid="search-input"]').type(requestText)

    cy.contains(requestText, { timeout: 10000 })
      .parent()
      .as('requestRow')

    cy.get('@requestRow')
      .find('[data-testid^="request-link-"]')
      .click()

    cy.url().should('include', '/requests/')

    // Claim request
    cy.contains('Claim').click()

    cy.get('#claim-modal', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Confirm').click()
      })

    // Verify claimed
    cy.get('[data-testid="request-status"]')
      .should('contain.text', 'claimed')

  })  

  it('Reviewer cannot see request before AI completes', () => {

    const requestText = `Request-${Date.now()}`

    // REQUESTER
    cy.loginAsRequester()
    cy.url().should('include', '/dashboard')

    cy.contains('New Request').click()
    cy.get('[data-testid="reque"]').type(requestText)
    cy.get('[data-testid="request-description-input"]').type('Edge case test for AI processing.')
    cy.contains('Submit Request').click()
    cy.contains('Logout').click()

    // REVIEWER
    cy.loginAsReviewer()
    cy.url().should('include', '/dashboard')

    cy.get('[data-testid="search-input"]').type(requestText)

    // Verify request is NOT visible
    cy.contains(requestText).should('not.exist')

})
})