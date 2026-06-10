@payments @hu-1.12 @regression
Feature: Cancellation and refund
  As a merchant
  I want to cancel a charge or refund a customer
  So that I can resolve issues and keep my customers' trust

  @happy-path @api
  Scenario: Successful cancellation before processing
    Given a charge that has not been processed yet
    When the merchant cancels it
    Then the platform cancels it and no charge is made

  @happy-path @api
  Scenario: Successful refund of a processed payment
    Given a charge that was processed successfully
    When the merchant requests a refund to the customer
    Then the platform starts the refund and confirms the operation

  @error @api
  Scenario: Refund attempt on an already cancelled charge
    Given a cancelled charge
    When the merchant tries to refund it
    Then the platform reports that the charge cannot be refunded
