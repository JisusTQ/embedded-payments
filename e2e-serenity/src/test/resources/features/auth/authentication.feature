@auth @regression
Feature: Authentication
  As a merchant
  I want to sign in securely
  So that I can operate my dashboard

  @happy-path
  Scenario Outline: Successful login with valid credentials
    Given the merchant is on the login page
    When the merchant signs in with email "<email>" and password "<password>"
    Then the merchant reaches the dashboard

    Examples:
      | email            | password |
      | test@example.com | password |

  @error
  Scenario: Login is rejected with invalid credentials
    Given the merchant is on the login page
    When the merchant signs in with email "test@example.com" and password "wrong-password"
    Then an authentication error is shown and the merchant stays on the login page

  @error
  Scenario: Accessing a protected route without a session redirects to login
    Given the merchant has no active session
    When the merchant opens a protected route
    Then the platform redirects to the login page
