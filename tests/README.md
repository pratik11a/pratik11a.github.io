# Unit Tests for Portfolio Components

This directory contains unit tests for the JavaScript components used in the portfolio website.

## Test Files

### `company.test.js`
Comprehensive unit tests for the `CompanyComponent` class that handles rendering job experience entries.

**Test Coverage:**
- ✅ Constructor initialization
- ✅ Template loading (success and error cases)
- ✅ Data rendering with variable substitution
- ✅ Error handling for missing templates
- ✅ Special character handling
- ✅ Integration tests with real data
- ✅ Template integrity after multiple renders

## Running Tests

### Prerequisites
- Bun (>=1.2.0)

### Commands

```bash
# Run all tests
bun test

# Run tests with watch mode
bun run test:watch

# Run specific test file
bun tests/company.test.js
```

### Manual Installation for Watch Mode
No extra dependency is needed with Bun.

## Test Framework

The tests use a custom lightweight test framework that provides:
- `describe()` - Groups related tests
- `it()` - Individual test cases
- `expect()` - Assertion methods
  - `toBe()` - Strict equality
  - `toEqual()` - Deep equality
  - `toContain()` - String/array contains
  - `toBeInstanceOf()` - Type checking
  - `toBeTruthy()` / `toBeFalsy()` - Boolean checks

## Mocking

The tests include mocks for:
- `fetch()` API for template loading
- `console.error()` for error logging verification

## Example Test Output

```
📋 CompanyComponent

📋 Constructor
  ✅ should create an instance of CompanyComponent
  ✅ should initialize with empty template

📋 loadTemplate method
  ✅ should load template successfully
  ✅ should handle fetch errors gracefully

📋 render method
  ✅ should return empty string when template not loaded
  ✅ should log error when template not loaded
  ✅ should replace all template variables correctly
  ✅ should handle multiple occurrences of same variable
  ✅ should handle empty data values
  ✅ should handle special characters in data

📋 Integration tests
  ✅ should work end-to-end with real data
  ✅ should maintain template structure after multiple renders

📊 Test Results:
✅ Passed: 12
❌ Failed: 0
📈 Total: 12
🎉 All tests passed!
```

## Adding New Tests

To add tests for new components:

1. Create a new test file in the `tests/` directory
2. Import or define the component class
3. Set up any necessary mocks
4. Write test cases using the test framework
5. Add the test script to `package.json`

## Test Data

Test files include sample data that mirrors the structure expected by components:

```javascript
const sampleCompanyData = {
    id: 'test-1',
    title: 'Software Engineer',
    company: 'Equal Experts',
    companyUrl: 'https://equalexperts.com',
    date: '2024 - Present',
    description: 'Developed and maintained distributed applications...'
};
```

## Coverage

Current test coverage focuses on:
- ✅ Core functionality
- ✅ Error handling
- ✅ Edge cases
- ✅ Data validation
- ✅ Template processing
- ✅ Integration scenarios

## Future Enhancements

Potential additions:
- [ ] Tests for experience.js
- [ ] Tests for script.js
- [ ] Integration tests for DOM manipulation
- [ ] Performance tests
- [ ] Visual regression tests
