Feature: Hello API

  A simplistic example to get started with the Gherkin-to-concurrent-API-tests workflow.

  The Hello API returns the authenticated user's information, confirming that
  authentication works and users receive their own identity.

  In a real project, your Gherkin files would describe richer business behaviors.

  Example: Reader can access the hello endpoint
    Given a user with the "reader" role
    When the user accesses the hello endpoint
    Then they receive their user name "reader@example.com"

  Example: Writer can access the hello endpoint
    Given a user with the "writer" role
    When the user accesses the hello endpoint
    Then they receive their user name "writer@example.com"
