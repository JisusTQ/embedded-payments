@transactions @hu-1.14 @regression @ui
Feature: Operations history
  As a merchant
  I want to see the history of all my charges and refunds
  So that I can control my cash flow

  @happy-path
  Scenario: History queried successfully
    Given an authenticated merchant with operations
    When the merchant opens the operations history
    Then the platform shows the merchant movements

  @happy-path
  Scenario: Filtering the history by status
    Given an authenticated merchant with operations
    When the merchant opens the operations history
    And the merchant filters the history by a status with no matches
    Then the platform shows that there are no operations for that filter
    When the merchant filters the history by the completed status
    Then the completed operations are shown again

  @happy-path
  Scenario: Empty history
    Given an authenticated merchant without operations
    When the merchant opens the operations history
    Then the platform reports that there are no operations
