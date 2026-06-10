@ledger @hu-1.15 @regression
Feature: Financial ledger
  As an administrator
  I want to see the consolidated balance of money in and out
  So that I can verify the platform accounts are in order

  @gap
  Scenario: Querying the general balance
    Given an authenticated administrator
    When the administrator requests the platform financial summary
    Then the system shows total income, expenses and available balance

  @happy-path @ui
  Scenario: Balance by merchant
    Given a merchant with recorded operations
    When the merchant checks the balance
    Then the system shows the income associated with that merchant

  @gap
  Scenario: Detecting an inconsistency in the balance
    Given transaction records that do not match the balance
    When the administrator reviews the ledger
    Then the system flags the inconsistency for review
