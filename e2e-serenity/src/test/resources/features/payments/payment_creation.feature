@payments @hu-1.9 @regression
Feature: Payment creation
  As an active merchant
  I want to start a charge to a customer
  So that I can receive the money for a product or service

  @happy-path @ui
  Scenario: A charge is created successfully
    Given an active and authenticated merchant
    When the merchant creates a charge with a valid amount and currency
    Then the platform generates a pending payment intent
    And the merchant receives the checkout reference

  @error @api
  Scenario: An inactive merchant cannot create a charge
    Given an inactive merchant
    When the merchant tries to create a charge
    Then the platform rejects the operation

  @error @api
  Scenario Outline: A charge with an invalid amount is rejected
    Given an active merchant
    When the merchant creates a charge for an amount of <amount>
    Then the platform reports that the value is not acceptable

    Examples:
      | amount |
      | 0      |
      | -10    |
