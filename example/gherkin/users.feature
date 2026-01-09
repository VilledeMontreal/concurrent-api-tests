Feature: User management

  The system manages users who can create and interact with blog posts.
  Each user has a role, fullname, and email address.

  Example: Create a new user
    When a user is created with role "author", fullname "Jane Smith", and email "jane.smith@example.com"
    Then the user is created
