# Git Commit Guidelines

This document outlines the standardized commit message format used in this project to maintain consistency and improve code history readability. **Following this format makes automating versioning and change logs significantly easier**, enabling seamless integration with CI/CD pipelines and automated release processes.

## Commit Message Format

All commit messages should follow this format:

```
TYPE: Commit Message in Title Case
```

### Format Rules

1. **Type Prefix**: Start with one of the predefined types in uppercase
2. **Colon Separator**: Use a colon and space (`: `) to separate type from message
3. **Title Case**: Use Title Case for the commit message (capitalize first letter of each word)
4. **Descriptive**: Make the message clear and descriptive of what the commit accomplishes

## Commit Types

### ADD

Use for adding new files, features, or functionality.

**Examples:**

- `ADD: New User Authentication Component`
- `ADD: Implement Dark Mode Toggle`
- `ADD: Create API Endpoint for User Profiles`
- `ADD: Add Unit Tests for Form Validation`

### BRANCH

Use for creating new feature branches or environment-specific branches.

**Examples:**

- `BRANCH: Feature Branch for Payment Integration`
- `BRANCH: Development Environment Setup`
- `BRANCH: Hotfix Branch for Critical Bug`

### DEPLOY

Use for commits specifically made for deployment purposes.

**Examples:**

- `DEPLOY: Production Build Configuration`
- `DEPLOY: Update Environment Variables for Staging`
- `DEPLOY: Optimize Bundle Size for Production`

### FIX

Use for specific, targeted bug fixes.

**Examples:**

- `FIX: Resolve Memory Leak in Image Upload`
- `FIX: Correct Form Validation Logic`
- `FIX: Fix Navigation Menu on Mobile Devices`
- `FIX: Address TypeScript Compilation Errors`

### MERGE

Use when merging one branch into another.

**Examples:**

- `MERGE: Feature Branch into Main`
- `MERGE: Hotfix Branch into Development`
- `MERGE: Pull Request #123 into Master`

### REFACTOR

Use for refactoring, renaming, reorganizing, or restructuring code without changing functionality.

**Examples:**

- `REFACTOR: Reorganize Component File Structure`
- `REFACTOR: Rename Variables for Better Clarity`
- `REFACTOR: Extract Common Logic into Utility Functions`
- `REFACTOR: Optimize Database Query Performance`

### REMOVE

Use for removing files, features, or functionality.

**Examples:**

- `REMOVE: Delete Unused Dependencies`
- `REMOVE: Remove Deprecated API Endpoints`
- `REMOVE: Clean Up Temporary Test Files`
- `REMOVE: Remove Legacy Authentication Method`

### REVERT

Use when rolling back a previous commit.

**Examples:**

- `REVERT: Rollback Feature That Caused Performance Issues`
- `REVERT: Undo Database Schema Changes`
- `REVERT: Revert to Previous API Version`

### UPDATE

Use for updating existing files, features, or functionality.

**Examples:**

- `UPDATE: Upgrade React to Version 18`
- `UPDATE: Modify User Interface Layout`
- `UPDATE: Update API Documentation`
- `UPDATE: Enhance Error Handling Logic`

## Best Practices

### Message Length

- Keep commit messages concise but descriptive
- Aim for 50 characters or less for the main message
- Use the body for detailed explanations if needed

### Specificity

- Be specific about what changed
- Avoid vague messages like "Fix bug" or "Update code"
- Include context about why the change was made

### Consistency

- Always use the same format across the project
- Follow the established type categories
- Maintain consistent capitalization and punctuation

### Examples of Good vs Bad Messages

**Good:**

- `FIX: Resolve Authentication Token Expiration Issue`
- `ADD: Implement User Profile Image Upload Feature`
- `REFACTOR: Extract Form Validation Logic into Custom Hook`

**Bad:**

- `fix bug` (missing type prefix, not title case)
- `ADD: stuff` (too vague)
- `Update: Fixed the thing` (inconsistent format)

## Multi-line Commit Messages

For complex changes, you can add a detailed description after the main message:

```
FIX: Resolve Memory Leak in Image Processing

- Implement proper cleanup in useEffect hooks
- Add error boundaries for image loading failures
- Update image cache management logic
- Add unit tests for memory leak scenarios
```

## Branch Naming Convention

While not strictly part of commit messages, branch names should follow a similar pattern:

- `feature/user-authentication`
- `fix/memory-leak-issue`
- `refactor/component-structure`
- `hotfix/critical-security-patch`

## Automation Benefits

Following this standardized commit format provides significant advantages for automation:

### Automated Versioning

- **Semantic Versioning**: Commit types map directly to semantic versioning (ADD/FIX = patch, major features = minor, breaking changes = major)
- **Release Automation**: Tools can automatically determine version bumps based on commit types
- **Changelog Generation**: Commit messages can be parsed to generate comprehensive changelogs

### Automated Change Logs

- **Structured Data**: Each commit provides structured data for automated processing
- **Categorized Changes**: Changes are automatically categorized by type (features, fixes, refactors, etc.)
- **Release Notes**: Generate detailed release notes by filtering commits by type and date range

### CI/CD Integration

- **Automated Releases**: Trigger releases based on commit patterns
- **Quality Gates**: Enforce commit message standards in pull requests
- **Deployment Triggers**: Use commit types to determine deployment strategies

## Tools and Automation

Consider using commit message templates or hooks to enforce these guidelines:

### Git Hook Example

Create a `.git/hooks/commit-msg` file to validate commit message format:

```bash
#!/bin/sh
commit_regex='^(ADD|BRANCH|DEPLOY|FIX|MERGE|REFACTOR|REMOVE|REVERT|UPDATE): .*'

if ! grep -qE "$commit_regex" "$1"; then
    echo "ERROR: Commit message must match pattern: TYPE: Message in Title Case"
    echo "Valid types: ADD, BRANCH, DEPLOY, FIX, MERGE, REFACTOR, REMOVE, REVERT, UPDATE"
    exit 1
fi
```

### Automated Changelog Example

With this format, you can easily generate changelogs using tools like:

```bash
# Generate changelog from last release
git log --oneline --grep="^ADD:" --since="1 month ago" > features.md
git log --oneline --grep="^FIX:" --since="1 month ago" > fixes.md
git log --oneline --grep="^REFACTOR:" --since="1 month ago" > refactors.md
```

### Version Bumping Script Example

```bash
#!/bin/bash
# Determine version bump based on commit types since last tag
commits_since_tag=$(git log --oneline --grep="^(ADD|FIX|REFACTOR|REMOVE|UPDATE):" $(git describe --tags --abbrev=0)..HEAD)

if echo "$commits_since_tag" | grep -q "^ADD:"; then
    echo "Minor version bump needed (new features)"
elif echo "$commits_since_tag" | grep -q "^FIX:"; then
    echo "Patch version bump needed (bug fixes)"
else
    echo "No version bump needed"
fi
```

## Conclusion

Following these guidelines ensures:

- **Consistent and readable commit history**
- **Easy identification of change types**
- **Better collaboration among team members**
- **Simplified code review process**
- **Clear project evolution tracking**
- **Automated versioning and release management**
- **Effortless changelog generation**
- **Seamless CI/CD integration**

**Remember**: Good commit messages are an investment in the future maintainability of your codebase. The structured format enables powerful automation that saves time and reduces human error in release processes.
