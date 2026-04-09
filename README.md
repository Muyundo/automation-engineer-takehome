# Automation Engineer Take-Home Test Suite

## Overview

This repository contains an end-to-end automation test suite built with Cypress for the Automation Engineer take-home assessment.

The suite validates the primary request lifecycle in the application under test:

- a requester logs in and creates a request
- the request is processed by the application
- a reviewer approves the request
- a claimer claims the approved request

Application under test:

- `https://automation-engineer-test.onrender.com`

## Test Workflow Covered

The main test is implemented in `cypress/e2e/workflow.cy.js` and follows the business flow below:

1. **Requester login**  
   Logs in with requester credentials using reusable Cypress commands.

2. **Request creation**  
   Creates a new request with a unique title so each test run remains isolated.

3. **Status progression**  
   Waits for the request to move through the application state until it is ready for review.

4. **Reviewer approval**  
   Logs in as the reviewer, searches for the request, opens it, and approves it.

5. **Claimer action**  
   Logs in as the claimer, finds the approved request, and claims it.

6. **Final verification**  
   Confirms that the request status updates correctly at each stage.

## Project Structure

```text
automation-engineer-takehome/
├── cypress/
│   ├── e2e/
│   │   └── workflow.cy.js
│   ├── fixtures/
│   │   └── example.json
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── cypress.env.json          # local only, not intended for commit
├── package.json
└── README.md
```

## File Guide

### `cypress/e2e/workflow.cy.js`
Contains the end-to-end workflow test. This is the main test specification file that drives the full request lifecycle.

### `cypress/support/commands.js`
Defines reusable Cypress commands, including the login helper methods for each user role.

### `cypress/support/e2e.js`
Loads shared support behavior before test execution and imports the custom commands.

### `cypress.config.js`
Contains the Cypress configuration for the project, including the application base URL.

### `cypress.env.json`
Stores local environment-specific values such as test credentials. This file is intended for local use only.

### `package.json`
Declares the Cypress dependency required to install and run the test suite.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- npm (included with Node.js)
- Git

## How to Clone the Repository

```bash
git clone https://github.com/Muyundo/automation-engineer-takehome.git
cd automation-engineer-takehome
```

If the repository is already available locally, you can skip this step.

## Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment configuration

Create a `cypress.env.json` file in the project root and add the credentials provided in the take-home exercise.

Example:

```json
{
  "REQUESTER_EMAIL": "[email]",
  "REQUESTER_PASSWORD": "[password]",
  "REVIEWER_EMAIL": "[email]",
  "REVIEWER_PASSWORD": "[password]",
  "CLAIMER_EMAIL": "[email]",
  "CLAIMER_PASSWORD": "[password]"
}
```

This file is used by the custom login commands in `cypress/support/commands.js`.

## How to Run the Tests

### Run in the Cypress Test Runner

```bash
npx cypress open
```

Then select:

- **E2E Testing**
- the preferred browser
- `workflow.cy.js`

### Run headlessly from the terminal

```bash
npx cypress run --spec cypress/e2e/workflow.cy.js
```

## Notes on Test Design

- The test uses a unique request name based on the current timestamp to avoid collisions between runs.
- Login is abstracted into reusable commands to keep the test readable.
- Assertions are included after each major workflow transition to verify the correct application behavior.
- The current project focuses on the core end-to-end business flow rather than broad edge-case coverage.

## Troubleshooting

### `cy.type() can only accept a string or number. You passed in: undefined`
This usually means one or more required values in `cypress.env.json` are missing or incorrectly named.

Check that the following keys exist exactly as written:

- `REQUESTER_EMAIL`
- `REQUESTER_PASSWORD`
- `REVIEWER_EMAIL`
- `REVIEWER_PASSWORD`
- `CLAIMER_EMAIL`
- `CLAIMER_PASSWORD`

### Base URL issues
If the application does not load correctly, verify that `cypress.config.js` points to:

```js
baseUrl: "https://automation-engineer-test.onrender.com"
```

## Summary

This project is structured to keep the automation flow readable, maintainable, and aligned with the business process under test. The core intent is to demonstrate a practical and professional approach to end-to-end automation using Cypress.
