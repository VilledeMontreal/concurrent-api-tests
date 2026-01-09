Feature: Blog post management

  The blog post system allows authors to create and publish blog posts.
  Each blog post contains a title, content, keywords, and author information.
  The system maintains engagement statistics for each post.

  Rule: Title is mandatory for blog post creation

    Example: Successfully create a blog post with a title
      When a user creates a blog post with title "Introduction to API Testing"
      Then the blog post is created with title "Introduction to API Testing"
      And the likeCount is 0
      And the commentCount is 0

    Example: Cannot create a blog post without a title
      When a user creates a blog post without a title
      Then the creation fails with error "The title is required."

  Rule: Blog posts can be searched by keyword

    Example: Search returns only blog posts containing the specified keyword
      Given a blog post about API testing exists with keyword "api"
      And a blog post about BDD exists with keyword "gherkin"
      When a user searches for blog posts with keyword "api"
      Then the blog post about API testing is returned
      And the blog post about BDD is not returned
