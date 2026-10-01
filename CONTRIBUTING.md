# Contributing

These guidelines are intended to make it easier for everyone to work on the
project, review each other's changes, and maintain a clear project history. 
They can be adjusted as the project evolves.

## Table of Contents

1. [Branches](#branches)
2. [Pull Requests](#pull-requests)
3. [Branch Naming Conventions](#branch-naming-conventions)
4. [Commit Naming Conventions](#commit-naming-conventions)

## Branches

`dev` is the shared development branch. Changes to `dev` should be
made through pull requests rather than direct commits.

Changes should be made on a separate branch from `dev`, then merged
into `dev` through a pull request.

```
dev
└── feature/fix/refactor/etc. branches (branch from dev, merge back into dev)
```

## Pull Requests

1. Create a branch (e.g. `feature/user-adoption-dashboard`).
   - See [Branch Naming Conventions](#branch-naming-conventions).
2. Make your changes on the branch.
   - Generally, commits should focus on individual pieces of work.
   - See [Commit Naming Conventions](#commit-naming-conventions).
3. Open a pull request.
   - Fill out the PR template to make the changes easier to review.
   - Include what was changed and how it was tested.
   - Include screenshots/videos when they would be helpful.
4. Have at least one other team member review the PR.
   - Larger or more significant changes may benefit from more reviewers.
5. Make sure CI passes (e.g. formatting and build checks).
6. Merge into `dev` after the PR has been approved.

## Branch Naming Conventions

Branch names should be kept concise while still being descriptive. Use the
format `category/description`.

### Common Categories

- `feature/feature-name`: New functionality, such as a UI element or API.
- `fix/bug-name`: Bug fixes.
- `refactor/describe-refactor`: Changes to project structure that do not
  change behavior.
- `docs/describe-change`: Documentation changes, such as updating ADRs or
  READMEs.

### Other Categories

- `ci/ci-name`: Changes to CI/CD workflows.
- `chore/chore-name`: Maintenance tasks that don't affect application
  behavior or documentation, such as updating `.gitignore`.

## Commit Naming Conventions

Commit messages consist of a category and a short description. Keep
the first line to 72 characters or fewer. A longer description may be
included on subsequent lines when useful. e.g.

```
feat: add API endpoint to filter pet profiles by age

[Optional longer description. If you want to explain complex changes
that were made in a commit, you may do so here. Try to wrap lines once
they reach 72 characters so that they are readable in terminals]
```

### Category

Commit categories are similar to branch categories, though they may be more
varied. The categories below are examples rather than a complete list:

`feat`, `fix`, `refactor`, `docs`, `ci`, `chore`, `style`

Use a category that makes the general purpose of the commit clear.

### Short Description

Short descriptions generally use the imperative tense. Ex:

|Not ideal|Better description|
|-|-|
|Added an API endpoint|Add API endpoint|
|Updated ADRs to reflect agreed upon tech stack|Update ADRs to reflect agreed upon tech stack|

### Optional longer description

A longer description can be useful for explaining complex changes. It is not
usually needed for small changes.

For changes that require more explanation, consider putting that context in 
the PR description instead.
