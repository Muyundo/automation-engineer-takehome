# Automation Engineer Take-Home Test Suite

## Overview

This repository contains an end-to-end automation test suite built with Cypress for the Automation Engineer take-home assessment.

The suite currently validates both the primary request lifecycle and an important negative workflow condition in the application under test:

- a requester logs in and creates a request
- the request is processed asynchronously by the application
- a reviewer approves the request once it is ready for review
- a claimer claims the approved request
- a reviewer should not see a newly created request before the AI processing phase completes

Application under test:

- `https://automation-engineer-test.onrender.com`

## Test Workflow Covered

The current implementation in `cypress/e2e/workflow.cy.js` includes two end-to-end scenarios.

### 1. Full request lifecycle

This test covers the main business workflow from start to finish:

1. **Requester login**  
   Logs in with requester credentials using reusable Cypress commands.

2. **Request creation**  
   Creates a new request with a unique title so each run stays isolated and repeatable.

3. **AI processing and status transition**  
   Waits for the request to appear and verifies that its status changes to `ready for review`.

4. **Reviewer approval**  
   Logs in as the reviewer, searches for the request, opens the request details page, and approves it using the confirmation modal.

5. **Claimer action**  
   Logs in as the claimer, searches for the approved request, opens it, and claims it using the claim confirmation modal.

6. **Final verification**  
   Confirms that the request status reaches `claimed` at the end of the workflow.

### 2. Reviewer visibility restriction before AI completion

This test validates a negative case:

- a requester creates a new request and logs out immediately
- a reviewer logs in and searches for the same request
- the test verifies that the request is not yet visible to the reviewer before the AI process completes

## Project Structure

```text
automation-engineer-takehome/
├── .github/
│   └── workflows/
│       └── cypress.yml
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
Contains the main business workflow tests. It currently includes:

- a full happy-path request lifecycle test
- a negative test verifying that reviewers cannot access a request before the asynchronous AI stage completes

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

### `.github/workflows/cypress.yml`
Defines the GitHub Actions CI workflow that runs Cypress tests on pushes and pull requests to `main`.

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

### 3. Configure GitHub Actions secrets (for CI)

If you want tests to run in GitHub Actions, add these repository secrets in GitHub:

- `REQUESTER_EMAIL`
- `REQUESTER_PASSWORD`
- `REVIEWER_EMAIL`
- `REVIEWER_PASSWORD`
- `CLAIMER_EMAIL`
- `CLAIMER_PASSWORD`

Path in GitHub:

- **Repository Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**

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

### Run in GitHub Actions

The workflow file is located at `.github/workflows/cypress.yml`.

It triggers on:

- pushes to `main`
- pull requests targeting `main`

The workflow uses Node `18.18.2`, installs dependencies, wakes the target app, and runs `npx cypress run` with credentials loaded from GitHub secrets.

## Notes on Test Design

- Each scenario uses a unique request name based on the current timestamp to avoid collisions between runs.
- Login is abstracted into reusable commands in `cypress/support/commands.js` to keep the test flow readable.
- The workflow uses application-facing selectors such as `data-testid` attributes, search inputs, and modal confirmations to drive realistic UI behavior.
- Assertions are included after each major workflow transition to verify status changes such as `ready for review`, `approved`, and `claimed`.
- The suite currently balances one strong happy-path test with one meaningful negative scenario rather than attempting broad edge-case coverage.

## Key Design Decisions

- A single end-to-end test was used for the main workflow because the process is sequential and state-dependent across roles.
- Tests were not split to avoid introducing shared state or brittle dependencies between test cases.
- Cypress retry-ability was used to handle asynchronous AI processing instead of hard waits.
- Selectors were based on `data-testid` attributes to improve stability and avoid brittle DOM coupling.
- One focused negative scenario was added instead of multiple edge cases to balance coverage with clarity.

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

This project is structured to keep the automation flow readable, maintainable, and aligned with the business process under test. The current suite demonstrates both the primary happy path and a reviewer-access restriction scenario, providing practical end-to-end coverage using Cypress.
