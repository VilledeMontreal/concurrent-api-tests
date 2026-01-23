# Flaky Test Reporter Demo

Demo of the `FlakyTestReporter` from `@villedemontreal/concurrent-api-tests`.

## Usage

```bash
npm install
npm start
```

## Expected output

The test suite includes:
- A passing test
- A test that always fails
- Two flaky tests (fail once or twice, then pass)

The `FlakyTestReporter` displays detailed information about flaky tests, including the errors from each failed attempt.
