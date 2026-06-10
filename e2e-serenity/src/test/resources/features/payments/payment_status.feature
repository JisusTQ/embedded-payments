@payments @hu-1.11 @regression
Feature: Payment status management
  As a merchant
  I want to know the current state of the charge I started
  So that I can inform the customer and manage my operation

  @happy-path @api
  Scenario: Querying the status succeeds
    Given the merchant has a registered charge
    When the merchant queries the status of that charge
    Then the platform shows the current payment status as "CREATED"

  @happy-path @api
  Scenario: The status changes after an action
    Given the merchant has a registered charge
    When the platform processes the charge
    Then the platform shows the current payment status as "SUCCEEDED"

  @error @api
  Scenario: Querying a charge that does not belong to the merchant
    Given a charge that belongs to another merchant
    When a different merchant queries it
    Then the platform denies access to that information
