---
name: gherkin-from-text
description: Create Gherkin feature files from natural language descriptions
---

# Gherkin from text

Your goal is to create one text file per feature with strict Gherkin exemples from the loose description written in natural language provided by the user.

All Gherkin feature files MUST be created in a `gherkin/` folder in the workspace root.

## Workflow Context

**This is incremental and collaborative:**

- Challenge unclear or incomplete requirements — ask questions
- Expect to be challenged — the user may correct or refine your output
- The user may edit your output directly or ask for revisions
- AI assists but does not replace human judgment on business rules

ALWAYS ask questions to the user if:

- the textual description provided as input is not clear
- the feature/rule breakdown is ambiguous
- the feature/rule is poor and need to be challenged
- the textual description contains UX-specific details (colors, fonts, visual positioning, animations, specific UI elements, layout details). You MUST ask the user if these details must be ommited in the Gherkin or if they must be included as distinct file/feature. DO NOT create UX files without explicit user confirmation.

The Gherkin you write MUST ALWAYS :

- be declarative, as opposed to imperative (see "Writing better Gherkin" section).
- be readable by any stakeholder (client, management, product owner, analyst, tester, dev, etc.).
- include a feature description directly under the **Feature** keyword that explains **why this feature matters**, the business value, and context. Aim for complete specifications, not just test input (see "Feature" section).
- **apply the Minimalistic Principle** (see "Minimalistic Principle" section): each example MUST only specify data/attributes that are meaningful for the behavior being tested. Irrelevant details MUST be omitted from Given/When/Then steps.
- **target each execution path once and only once**. Each example should test a unique execution path through the system. Do NOT create multiple examples that test the same execution path with different data values if the execution path remains identical. Avoid redundant tests that cover logic already validated by previous examples.
- **maintain strong feature cohesion** by separating distinct business concerns into individual feature files. When business rules address different functional areas or can be understood independently, create separate `.feature` files rather than combining them into one. Each feature file should have a single, clear purpose. Examples of distinct concerns that should be separated:
  - User authentication vs. user profile management
  - Content creation vs. content statistics/reporting
  - Data input/validation vs. data export
  - Configuration/setup vs. execution/operation
  - Resource selection vs. resource processing
- group related examples under business rules using the "Règle" (or "Rule") keyword only when it significantly clarifies the intent. (see "Rule" section).
- use the keyword "Exemple" (or its equivalent in the target language) instead of "Scenario" for individual test cases.

- only describe functionnal requirements. Do NOT describe non functionnal requirements (ex: response times, availability, etc.).
- be written in the same language as the one provided as input.
  Ex: if the input is in french, the generated Gherkin is in french
- respect the official translation of Gherkin keywords.
  If the language is not english, find the translation in the "Language" section. Stop without completing your job if the language is not found. Do NOT guess or infer translations.
- ommit the language directive (e.g., "# language: fr") at the beginning of the file.
- use precise, explicit, and unambiguous language.
- avoid idioms, metaphors, or context-dependent references.
- define all acronyms and domain-specific terms.
- ensure the document is self-contained and does not rely on external context.
- use "Scenario Outline" when multiple examples follow the same pattern, to improve readability and reduce repetition (see "Scenario Outline" section).
- use "Background" ONLY to avoid repeating the same **Given** steps in all **Example** of a **Feature**, and only when it significantly improves readability (see "Background" section). Do NOT use "Background" to provide general context or feature description.
- **separate UX-specific behaviour into a distinct file/feature with a `@UX` tag**. UX-specific details include: colors, fonts, visual positioning, animations, specific UI elements (buttons, fields), layout details, and any presentation-specific implementation. The main feature file should describe the functional behavior in a declarative manner without UI implementation details (see "UX Separation" section). You MUST ask the user before creating UX files.
- favor end-to-end behaviour description over UX-specific behaviour (avoid unless it's a major concern).

## Writing better Gherkin

There are several ways to make your Gherkin better.

### Describe behaviour

Your scenarios should describe the intended behaviour of the system, not the implementation. In other words, it should describe what, not how.

For example, for an authentication Scenario, you should write:

```
When "Bob" logs in
```

instead of:

```
  Given I visit "/login"
  When I enter "Bob" in the "user name" field
    And I enter "tester" in the "password" field
    And I press the "login" button
  Then I should see the "welcome" page
```

The first example, **When "Bob" logs in**, is a _functional requirement_. The second, much longer, example is a _procedural reference_. Functional requirements are features, but procedures belong in the implementation details.

That way, when the implementation of a feature changes, you'll only need to change the process steps behind the scenes. The behaviour does not have to change just because the implementation does. In fact, a good question to ask yourself when writing a feature clause is: "Will this wording need to change if the implementation does?".

If the answer is "Yes", then you should rework it avoiding implementation specific details. As a side benefit, in consequence your scenarios will be a lot shorter and much easier to follow and understand.

### Consider a more declarative style

One way to make scenarios easier to maintain and less brittle is to use a declarative style. Declarative style describes the behaviour of the application, rather than the implementation details. Declarative scenarios read better as "living documentation". A declarative style helps you focus on the value that the customer is getting, rather than the keystrokes they will use.

Imperative tests communicate details, and in some contexts this style of test is appropriate. On the other hand, because they are so closely tied to the mechanics of the current UI, they often require more work to maintain. Any time the implementation changes, the tests need to be updated too.

Here's an example of a feature in an imperative style:

```
Feature: Subscribers see different articles based on their subscription level

Scenario: Free subscribers see only the free articles
  Given users with a free subscription can access "FreeArticle1" but not "PaidArticle1"
  When I type "freeFrieda@example.com" in the email field
  And I type "validPassword123" in the password field
  And I press the "Submit" button
  Then I see "FreeArticle1" on the home page
  And I do not see "PaidArticle1" on the home page

Scenario: Subscriber with a paid subscription can access "FreeArticle1" and "PaidArticle1"
  Given I am on the login page
  When I type "paidPattya@example.com" in the email field
  And I type "validPassword123" in the password field
  And I press the "Submit" button
  Then I see "FreeArticle1" and "PaidArticle1" on the home page
```

Each step is a precise instruction. The inputs and expected results are specified exactly. But it's easy to imagine changes to the application which would require changing these tests. The available options for free versus paid subscriptions can change. Even the means of logging in could change. What if, in the future, users log in with a voice interface or a thumbprint?

A more declarative style hides the details of how the application's capabilities are implemented.

```
Feature: Subscribers see different articles based on their subscription level

Scenario: Free subscribers see only the free articles
  Given Free Frieda has a free subscription
  When Free Frieda logs in with her valid credentials
  Then she sees a Free article

Scenario: Subscriber with a paid subscription can access both free and paid articles
  Given Paid Patty has a basic-level paid subscription
  When Paid Patty logs in with her valid credentials
  Then she sees a Free article and a Paid article
```

With a declarative style, each step communicates an idea, but the exact values aren't specified. The details of how the user interacts with the system, such as which specific articles are free or paid, and the subscription level of different test users, are specified in the step definitions (the automation code that interacts with the system). The subscription packages could change in the future. The business could change what content is available to subscribers on free and paid plans, without having to change this scenario and other scenarios that use the same step definitions. If another subscription level is added later, it's easy to add a scenario for that. By avoiding terms like "click a button" that suggest implementation, the scenario is more resilient to implementation details of the UI. The intent of the scenario remains the same, even if the implementation changes later. In addition, having too many implementation details in a scenario, makes it harder to understand the intended behaviour it illustrates.

## Minimalistic Principle

> **CRITICAL**: Over-specification makes Gherkin harder to read, understand, and maintain. Irrelevant details obscure the business intent and create noise that distracts stakeholders from the actual behavior being documented.

Each example MUST only include details that are **meaningful for the specific behavior being documented**. Ask yourself for each detail:

1. "Is this detail essential to understand this specific behavior?"
2. "Would removing this detail change what the example is describing?"

If the answer is "No" to either question, **omit the detail**.

### Given steps

Only specify preconditions that are **meaningful for the behavior being documented**. Do NOT include irrelevant context.

**Over-specified Given (PROHIBITED):**

```gherkin
Exemple: Title is required when creating a blog post
  Given a user "John Doe" with email "john@example.com" and role "author"
  And the user has a profile picture
  And the blog post category is "Technology"
  And the blog post has 3 keywords: "api", "testing", "gherkin"
  When the user creates a blog post without a title
  Then the creation fails with error "Title is required"
```

**Minimalistic Given (CORRECT):**

```gherkin
Exemple: Title is required when creating a blog post
  When a user creates a blog post without a title
  Then the creation fails with error "Title is required"
```

### Then steps

Only verify outcomes that are **meaningful for the behavior being documented**. Do NOT include irrelevant attributes.

**Over-specified Then (PROHIBITED):**

```gherkin
Exemple: Create a draft blog post
  When a user creates a draft blog post with title "My Draft"
  Then the blog post is created
  And the title is "My Draft"
  And the status is "draft"
  And the creation date is today
  And the author is the current user
  And the comment count is 0
  And the like count is 0
  And the view count is 0
```

**Minimalistic Then (CORRECT):**

```gherkin
Exemple: Create a draft blog post
  When a user creates a draft blog post with title "My Draft"
  Then the blog post is created with title "My Draft" and status "draft"
```

### When steps

Only include parameters that are **meaningful for the behavior being documented**.

**Over-specified When (PROHIBITED):**

```gherkin
Exemple: Search returns matching posts by keyword
  When the user searches for posts with keyword "cucumber" and sort "date" and limit 10 and offset 0
  Then posts containing "cucumber" are returned
```

**Minimalistic When (CORRECT):**

```gherkin
Exemple: Search returns matching posts by keyword
  When the user searches for posts with keyword "cucumber"
  Then posts containing "cucumber" are returned
```

### Key questions to avoid over-specification

Before writing each example, ask:

1. **What specific behavior is this example documenting?**
2. **Which details are essential to understand this behavior?**
3. **Have I omitted all irrelevant details?**

## Feature

The purpose of the Feature keyword is to provide a high-level description of a software feature, and to group related scenarios.

The first primary keyword in a Gherkin document must always be Feature, followed by a : and a short text that describes the feature.

You can add free-form text underneath Feature to add more description.

These description lines are ignored by Cucumber at runtime, but are available for reporting (they are included by reporting tools like the official HTML formatter).

### Aim for Complete Specifications

A well-written Feature is more than test input — it's living documentation. Include:

- **Business context** — Why does this feature exist?
- **Value proposition** — What problem does it solve? Who benefits?
- **Business rules** — General rules, not just examples
- **Decision links** (optional) — References to ADRs or design documents

```
Feature: Guess the word

  The word guess game is a turn-based game for two players.
  The Maker makes a word for the Breaker to guess. The game
  is over when the Breaker guesses the Maker's word.

  Why this matters:
  - Players need a way to challenge each other
  - The game must have clear win conditions

  Example: Maker starts a game
```

The name and the optional description have no special meaning to Cucumber. Their purpose is to provide a place for you to document important aspects of the feature, such as a brief explanation and a list of business rules (general acceptance criteria).

The free format description for Feature ends when you start a line with the keyword Background, Rule, Example or Scenario Outline (or their alias keywords).

You can place tags above Feature to group related features, independent of your file and directory structure.

You can only have a single Feature in a .feature file.

## Descriptions

Free-form descriptions (as described above for Feature) can also be placed underneath Example/Scenario, Background, Scenario Outline and Rule.

You can write anything you like, as long as no line starts with a keyword.

Descriptions can be in the form of Markdown - formatters including the official HTML formatter support this.

## Rule

The (optional) Rule keyword has been part of Gherkin since v6.

The purpose of the Rule keyword is to represent one business rule that should be implemented. It provides additional information for a feature. A Rule is used to group together several scenarios that belong to this business rule. A Rule should contain one or more scenarios that illustrate the particular rule.

For example:

```
# -- FILE: features/gherkin.rule_example.feature
Feature: Highlander

  Rule: There can be only One

    Example: Only One -- More than one alive
      Given there are 3 ninjas
      And there are more than one ninja alive
      When 2 ninjas meet, they will fight
      Then one ninja dies (but not me)
      And there is one ninja less alive

    Example: Only One -- One alive
      Given there is only 1 ninja alive
      Then they will live forever ;-)

  Rule: There can be Two (in some cases)

    Example: Two -- Dead and Reborn as Phoenix
      ...
```

## Scenario Outline

The **Scenario Outline** keyword can be used to run the same **Scenario** multiple times, with different combinations of values.

The keyword **Scenario Template** is a synonym of the keyword **Scenario Outline**.

Copying and pasting scenarios to use different values quickly becomes tedious and repetitive:

```
Scenario: eat 5 out of 12
  Given there are 12 cucumbers
  When I eat 5 cucumbers
  Then I should have 7 cucumbers

Scenario: eat 5 out of 20
  Given there are 20 cucumbers
  When I eat 5 cucumbers
  Then I should have 15 cucumbers
```

We can collapse these two similar scenarios into a **Scenario Outline**.

Scenario outlines allow us to more concisely express these scenarios through the use of a template with < >-delimited parameters:

```
Scenario Outline: eating
  Given there are <start> cucumbers
  When I eat <eat> cucumbers
  Then I should have <left> cucumbers

  Examples:
    | start | eat | left |
    |    12 |   5 |    7 |
    |    20 |   5 |   15 |
```

## Background

Occasionally you'll find yourself repeating the same **Given** steps in all of the scenarios in a **Feature**.

Since it is repeated in every scenario, this is an indication that those steps are not essential to describe the scenarios; they are incidental details. You can literally move such **Given** steps to the background, by grouping them under a **Background** section.

A **Background** allows you to add some context to the scenarios that follow it. It can contain one or more **Given** steps, which are run before each scenario, but after any Before hooks.

A **Background** is placed before the first **Scenario/Example**, at the same level of indentation.

For example:

```
Feature: Multiple site support
  Only blog owners can post to a blog, except administrators,
  who can post to all blogs.

  Background:
    Given a global administrator named "Greg"
    And a blog named "Greg's anti-tax rants"
    And a customer named "Dr. Bill"
    And a blog named "Expensive Therapy" owned by "Dr. Bill"

  Scenario: Dr. Bill posts to his own blog
    Given I am logged in as Dr. Bill
    When I try to post to "Expensive Therapy"
    Then I should see "Your article was published."

  Scenario: Dr. Bill tries to post to somebody else's blog, and fails
    Given I am logged in as Dr. Bill
    When I try to post to "Greg's anti-tax rants"
    Then I should see "Hey! That's not your blog!"

  Scenario: Greg posts to a client's blog
    Given I am logged in as Greg
    When I try to post to "Expensive Therapy"
    Then I should see "Your article was published."
```

**Background** is also supported at the **Rule** level, for example:

```
Feature: Overdue tasks
  Let users know when tasks are overdue, even when using other
  features of the app

  Rule: Users are notified about overdue tasks on first use of the day
    Background:
      Given I have overdue tasks

    Example: First use of the day
      Given I last used the app yesterday
      When I use the app
      Then I am notified about overdue tasks

    Example: Already used today
      Given I last used the app earlier today
      When I use the app
      Then I am not notified about overdue tasks
  ...
```

You can only have one set of **Background** steps per **Feature** or **Rule**. If you need different **Background** steps for different scenarios, consider breaking up your set of scenarios into more **Rules** or more **Feature**s.

### Tips for using Background

- Don't use **Background** to set up complicated states, unless that state is actually something the client needs to know.
  - For example, if the user and site names don't matter to the client, use a higher-level step such as **Given I am logged in as a site owner**.
- Keep your **Background** section short.
  - The client needs to actually remember this stuff when reading the scenarios. If the **Background** is more than 4 lines long, consider moving some of the irrelevant details into higher-level steps.
- Make your **Background** section **vivid**.
  - Use colourful names, and try to tell a story. The human brain keeps track of stories much better than it keeps track of names like "User A", "User B", "Site 1", and so on.
- Keep your scenarios **short**, and don't have too many.
  - If the **Background** section has scrolled off the screen, the reader no longer has a full overview of what's happening. Think about using higher-level steps, or splitting the \*.feature file.

## Language

### French/français (`fr`)

| Keyword          | Equivalent(s)                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Feature          | Fonctionnalité                                                                           |
| Background       | Contexte                                                                                 |
| Rule             | Règle                                                                                    |
| Scenario         | Exemple                                                                                  |
| Scenario Outline | Plan du scénario                                                                         |
| Examples         | Exemples                                                                                 |
| Given            | Étant donné que, Étant donné qu', Étant donné, Étant donnée, Étant donnés, Étant données |
| When             | Quand                                                                                    |
| Then             | Alors                                                                                    |
| And              | Et                                                                                       |
| But              | Mais                                                                                     |

## UX Separation

**CRITICAL**: Always create TWO separate files when UX-specific details are present in the input description:

### File naming convention:

- Main feature: `feature-name.feature`
- UX feature: `feature-name-ux.feature`

### Example of separation:

**Bad (mixed functional and UX in one file):**

```gherkin
Exemple: User submits incorrect password
  When the user enters an incorrect password
  Then an error message "Invalid password" is displayed in red text
  And a warning icon appears to the left of the message
```

**Good (separated into two files):**

`login.feature`:

```gherkin
Exemple: User submits incorrect password
  When the user enters an incorrect password
  Then the user is notified that the password is invalid
```

`login-ux.feature`:

```gherkin
@UX
Exemple: Error notification visual display
  When the user is notified of an invalid password
  Then the error message "Invalid password" is displayed in red text
  And a warning icon appears to the left of the message
```

## Sources

- https://cucumber.io/docs/bdd/better-gherkin
- https://cucumber.io/docs/gherkin/reference
- https://cucumber.io/docs/gherkin/languages
