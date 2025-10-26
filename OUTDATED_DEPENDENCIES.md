# Outdated Dependencies Report

Generated on: October 26, 2025

## Summary

This report lists all dependencies in the repository that are not up to date with the latest available versions.

## Library Package (`/lib/package.json`)

### Dependencies (Production)

| Package | Current Version | Latest Version | Type | Notes |
|---------|----------------|----------------|------|-------|
| `uuid` | 9.0.1 | 13.0.0 | **Major Update** | Breaking changes expected - requires migration guide review |

### DevDependencies (Development)

| Package | Current Version | Latest Version | Type | Notes |
|---------|----------------|----------------|------|-------|
| `@types/lodash` | 4.17.7 | 4.17.20 | Minor Update | TypeScript type definitions update |
| `@types/uuid` | 10.0.0 | 11.0.0 | **Major Update** | Type definitions update for uuid |

### Up-to-date Dependencies

The following dependencies are already at their latest versions:
- `@eslint/js`: 9.38.0 ✓
- `@types/chai`: 5.2.3 ✓
- `@types/node`: 24.9.1 ✓
- `chai`: 6.2.0 ✓
- `eslint`: 9.38.0 ✓
- `globals`: 16.4.0 ✓
- `jiti`: 2.6.1 ✓
- `lodash`: 4.17.21 ✓
- `prettier`: 3.6.2 ✓
- `typescript`: 5.9.3 ✓
- `typescript-eslint`: 8.46.2 ✓
- `vitest`: 4.0.3 ✓

## Example Package (`/example/package.json`)

### Status: All Up-to-Date ✓

All dependencies in the example package are up to date:
- `@types/chai`: 5.2.3 ✓
- `@types/config`: 3.3.5 ✓
- `@villedemontreal/mocha-concurrent-api-tests`: 1.0.7 ✓
- `chai`: 6.2.0 ✓
- `config`: 4.1.1 ✓
- `vitest`: 4.0.3 ✓
- `@eslint/js`: 9.38.0 ✓
- `eslint`: 9.38.0 ✓
- `globals`: 16.4.0 ✓
- `jiti`: 2.6.1 ✓
- `prettier`: 3.6.2 ✓
- `typescript`: 5.9.3 ✓
- `typescript-eslint`: 8.46.2 ✓

## Recommendations

### Critical Updates

1. **uuid (9.0.1 → 13.0.0)**
   - This is a major version upgrade spanning versions 10, 11, 12, to reach 13
   - Review the [uuid changelog](https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md) before updating
   - Test thoroughly as breaking changes are expected
   - Consider updating in a separate PR with comprehensive testing

### Non-Breaking Updates

2. **@types/lodash (4.17.7 → 4.17.20)**
   - Type definitions update only
   - Low risk update
   - Can be updated safely

3. **@types/uuid (10.0.0 → 11.0.0)**
   - Type definitions update
   - Should be updated alongside uuid package upgrade
   - Relatively low risk

## Next Steps

1. Review uuid breaking changes between versions 9.x and 13.x
2. Update @types/lodash as a low-risk improvement
3. Plan uuid migration with proper testing
4. Update @types/uuid after uuid is updated

## Notes

- All checks performed using `npm outdated` command
- Latest versions verified on October 26, 2025
- All current tests pass with existing dependency versions
