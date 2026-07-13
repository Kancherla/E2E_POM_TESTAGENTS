End-to-End QA Workflow with Natural Language

Workflow Overview

This prompt guides you through a complete 7-step QA workflow using MCP servers and AI agents to go from user story to committed automated test scripts.

## STEP 1: Read User Story

### Prompt:

- I need to start a new testing workflow. Please read the user story from the file: user-stories/SCRUM-101-ecommerce-checkout.md

Summarize the key requirements, acceptance criteria, and testing scope.

Expected Output:

- Summary of the user story
- List of acceptance criteria
- Application URL and test credentials
- Key features to test

## STEP 2: Create Test Plan

### Prompt

    Based on the user story SCRUM-101 that we just reviewed, use the playwright-test-planner agent to: 

    1. Read the application URL and test credentials from the user story
    2. Explore the application and understand all workflows mentioned in the acceptance criteria
    3. Create a comprehensive test plan that covers all acceptance criteria including:
    - Happy path scenarios
    - Negative scenarios (validation errors, empty fields, invalid data)
    - Edge cases and boundary conditions
    - Navigation flow tests
    - UI element validation
    4. Save the test plan as: specs/saucedemo-checkout-test-plan.md
    Ensure each test scenario includes
    - Clear test case title
    - Detailed step-by-step instructions
    - Expected results for each step
    - Test data requirements

Expected Output:

    - Complete test plan markdown file saved to specs/
    - Organized test scenarios with clear structure
    - Browser exploration screenshots (if needed) 

## STEP 3: Perform Exploratory Testing

### Prompt:

Now I need to perform manual exploratory testing using Playwright MCP browser tools.

Please read the test plan from: specs/saucedemo-checkout-test-plan.md

Then execute the test scenarios defined in that plan:
1. Use Playwright browser tools to manually execute each test scenario from the plan
2. Follow the step-by-step instructions in each test case
3. Verify expected results match actual results
4. Take screenshots at key steps and error states
5. Document your findings:
    - Test execution results for each scenario
    - Any UI inconsistencies or unexpected behaviours
    - Missing validations or bugs discovered
    - Screenshots as evidence

Expected output:

- Manual test execution results
- Screenshots of the application at various states
- List of observations and findings
- Any issues discovered during exploration

## STEP 4: Generate Automation Scripts

### Prompt:

Now I need to create automated test scripts using the playwright-test-generator agent following the Page Object Model (POM) design pattern.

Please review:
1. Test plan from: specs/saucedemo-checkout-test-plan.md
2. Exploratory testing results from Step 3

Use the verified selectors, waits, and UI behaviors discovered during exploratory testing.

### Framework Architecture

Organize the framework as:

- tests/saucedemo-checkout/
- pages/
- components/
- fixtures/
- utils/

Implement a BasePage with reusable methods (click, fill, waitForPageLoad, waitForNetworkIdle, takeScreenshot, etc.) and let all page objects inherit from it.

Create Page Objects for Login, Inventory, Cart, Checkout, Checkout Overview, and Checkout Complete pages.

Extract reusable widgets into Component Objects (Header, Navigation Menu, Cart Badge).

Separate test data into fixtures and utilities.

### Script Requirements

- One feature-based spec file per workflow.
- Use TypeScript
- Tests should use only Page Objects.
- Never duplicate selectors inside test files.
- Follow Playwright best practices.
- Use proper assertions using expect()
- Use descriptive test names matching the format in the test plan.
- Use robust element selectors discovered during manual testing.
- Add comments for complex steps.
- Add proper test hooks (beforeEach, afterEach)
- Configure for multiple browsers(Chrome, Firefox, Safari)
- Prefer data-testid, IDs, ARIA roles, then CSS selectors.
- Use Playwright locators and expect().
- Avoid waitForTimeout().
- Add beforeEach/afterEach hooks.
- Configure Chrome, Firefox, and WebKit.
- Capture screenshots, traces, and HTML reports.

Validate the generated framework by executing all tests and fixing any compilation issues.

Expected Output:

- Complete Playwright framework using Page Object Model.
- Reusable Page Objects and Component Objects.
- Centralized test data and utilities.
- Robust automation using selectors discovered during exploratory testing.
- Multi-browser execution with reporting.

### SDET Recommendation

Adopt a layered automation architecture consisting of:
- Page Objects (UI interactions)
- Component Objects (reusable widgets)
- Service/API layer for authentication and test data setup
- Fixtures for dependency injection
- Utilities and helper libraries
- Test Data Factory for dynamic test data

This architecture improves maintainability, reduces duplication, and makes AI-generated tests easier to extend and auto-heal.

## STEP 5: Execute and Heal Automation Tests

### Prompt:

Now I need to execute the generated automation scripts and heal any failures using the playwright-test-healer agent.

1. Run all automation scripts in: tests/saucedemo-checkout/
2. Identify any failing tests
3. For each failing test, use the playwright-test-healer agent to:
    - Analyze the failure (selector issues, timing issues, assertion failures)
    - Auto-heal the test by fixing selectors, adding waits, or adjusting assertions
    - Update the test script with the fixes.
4. Re-run the healed tests to verify they pass
5. Repeat the heal process until all tests are stable and passing.
6. Document:
    - Initial test results (pass/fail count)
    - Healing activities performed
    - Final test results after healing
    - Any tests that couldn't be auto-healed

Expected Output:
    - All automation tests executed
    - Failing tests identified and healed using playwright-test-healer agent
    - Healed test scripts updated in tests/saucedemo-checkout/
    - Final stable test execution results
    - Summary of healing activities performed

## STEP 6: Generate Test Report

### Prompt:

Now I need to create a comprehensive test execution report based on manual testing, automation execution and healing activities.

Please compile results from:
- Step 3: Manual exploratory testing results
- Step 4: Generated automation scripts
- Step 5: Automated test execution and healing results

Structure the report as: test-results/SCRUM-101-checkout-test-report.md

Include:
1. Executive Summary
    - Total test cases planned
    - Test cases executed (manual + automated)
    - Overall Pass/Fail/Blocked status

2. Manual Test Results
    - Results from Step 3 exploratory testing
    - Screenshots and observations
    - Issues found during manual testing

3. Automated Test Results
    - Initial automation results from Step 5
    - Healing activities performed
    - Final test execution results after healing
    - Test suite execution summary
    - Pass/Fail count for each test suite

4. Defects Log
    - For any failed tests (manual or automated)
    * Bug ID
    * Severity (Critical/High/Medium/Low)
    * Title and Description
    * Steps to Reproduce
    * Expected vs Actual Behavior
    * Screenshots/Evidence
    * Environment Details

5. Test Coverage Analysis
    - Which acceptance criteria are covered
    - Coverage from manual vs automated tests
    - Any gaps in test coverage
    - Recommendations for additional testing

6. Summary and Recommendations
    - Overall quality assessment
    - Risk areas
    - Next steps

Expected Output:
 - Comprehensive test execution report covering both manual and automated testing
 - Clear PASS/FAIL status for all test scenarios
 - Detailed bug reports for failures
 - Complete test coverage analysis
 - Evidence and screenshots attached

## Step 7: Commit to Git repository
Git repository URL: https://github.com/Kancherla/E2E_POM_TESTAGENTS.git
### Prompt

Now I need to commit all the test artifacts to the Git repository using the GitHub MCP server.

Git Repository URL: https://github.com/Kancherla/E2E_POM_TESTAGENTS.git

Please perform the following Git operations:

1. Initialize Git repository if not already initialized.
2. Stage all files in the workspace (all new and modified files)
3. Create a commit with the message:
    "feat(tests): Add complete test suite for SCRUM-101 checkout workflow

        - Add user story documentation
        - Add comprehensive test plan with all scenarios
        - Add test execution report with results
        - Add automated test scripts for checkout process
        - Include validation, navigation, and edge case tests

        Resolves SCRUM-101"

4. Push all changes to the Git repository
5. Provide a summary of what was committed

Expected Output:
    - All workspace files committed to git
    - Descriptive commit message following conventional commit format 
    - Confirmation of successful push to the provided repository
    - Summary of changes

#### Complete Workflow Execution

Single Combined Prompt (for video Demo)

I want to demonstrate a complete end-to-end QA workflow using natural language and MCP servers.

STEP 1 - REAAD USER STORY:
First, read the user story from: user-stories/SCRUM-101-ecommerce-checkout.md Provide a brief summary of what needs to be tested.

STEP 2: CREATE TEST PLAN:
Use the playwright-test-planner agent to create a comprehensive test plan based oin the user story. The agent should explore the application URL from the user story and cover all acceptance criteria. Save it as: specs/saucedemo-checkout-test-plan.md

STEP 3: - EXPLORATORY TESTING:
Read the test plan from specs/saucedemo-checkout-test-plan.md and use Playwright browser tools to manually executeeach test scenario. Document findings with screenshots and note any issues discovered.

STEP 4: - GENERATE AUTOMATION SCRIPTS:
Review both the test plan (specs/saucedemo-checkout-test-plan.md) and exploratory testing results from step 3. Use the playwright-test-generator agent to create TypeScript automation scripts leveraging the element selectors and insigghts discovered during manual testing. Save scripts in tests/saucedemo-checkout/.

STEP 5: EXECUTE AND HEAL TESTS:
Run all automation scripts from tests/saucedemo-checkout/. Use the playwright-test-healer agent to identify and auto-heal any failing tests. Re-run tests until all are stable and passing. Document healing activities.

STEP 6: CREATE TEST REPORT:
Create a comprehensive test execution report at: test-results/SCRUM-101-checkout-test-report.md 
Compile results from Step 3 (manual testing), Step 4 (script generation), and Step 5 (execution and healing). Include PASS/FAIL status, healing summary, defects log, and test coverage anaysis.

STEP 7: - COMMIT TO GIT:
Use the GitHub MCP server to commit all new files with a descriptive message and push to the
repository.

Execute this complete workflow and provide status updates after each step.


