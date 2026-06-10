@audit @hu-1.16 @gap
Feature: State change auditing
  As an administrator
  I want to know who made which change and when
  So that I have control and accountability over every important action

  Scenario: A state change is recorded automatically
    Given a state change occurred on a payment or merchant
    When the platform processes the change
    Then it records who did it, what changed and when

  Scenario: Querying the audit trail
    Given the administrator wants to review recent changes
    When the administrator queries the audit log
    Then the platform shows the list of events ordered by date

  Scenario: Attempting to modify an audit record
    Given a stored audit record
    When someone tries to modify it
    Then the platform prevents it and protects the record integrity
