describe('End-to-End Workflow', () => {

  it('Requester creates a request', () => {

  const requestText = `Request-${Date.now()}`

    // 1. Login as requester
    cy.loginAsRequester()
    cy.url().should('include', '/dashboard')    
        //Create a new request
        cy.contains('New Request').click()
        cy.get('[data-testid="request-title-input"]').type(requestText)
        cy.get('[data-testid="request-description-input"]').type('Request created by Cypress E2E test.')
        cy.contains('Submit Request').click()

       cy.contains(requestText, { timeout: 60000 })
         .parent()
         .as('requestRow')

       cy.get('@requestRow')
         .find('[data-testid="request-status"]', { timeout: 60000 })
         .should('contain', 'ready for review')

    

     })   

  })

