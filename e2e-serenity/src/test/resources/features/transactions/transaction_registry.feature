@transactions @hu-1.13 @regression
Feature: Transaction registry
  As a platform administrator
  I want every money movement to be recorded
  So that there is full traceability of what happens in the system

  @happy-path @api
  Scenario: A transaction is recorded after a successful payment
    Given a payment was processed correctly
    When the platform confirms the charge
    Then the movement is recorded with its amount and status

  @happy-path @api
  Scenario: A transaction is recorded after a refund
    Given a refund was processed
    When the platform confirms the refund
    Then the corresponding outgoing movement is recorded

  @happy-path @api
  Scenario: Querying transactions by merchant
    Given a merchant with recorded movements
    When its movements are requested
    Then the platform shows the list of transactions for that merchant
