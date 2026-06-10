@payments @hu-1.10 @regression
Feature: Payment authorization
  As the payments platform
  I want to verify that a charge meets the required conditions
  So that only valid payments are processed

  @happy-path @ui
  Scenario: A payment is authorized correctly
    Given a pending payment intent
    When the customer pays the checkout with valid card details
    Then the platform approves the payment and marks it as successful

  @error @ui
  Scenario: A payment is declined due to insufficient funds
    Given a pending payment intent that will be declined
    When the customer pays the checkout with valid card details
    Then the platform declines the payment and reports the reason

  @error @api
  Scenario: A payment is rejected due to inconsistent data
    Given a checkout reference that does not exist
    When the platform tries to authorize it
    Then the platform rejects the operation and reports the problem
