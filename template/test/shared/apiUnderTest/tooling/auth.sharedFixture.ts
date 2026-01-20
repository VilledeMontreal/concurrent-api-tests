import { defineGetSharedFixtureByKey } from "@villedemontreal/concurrent-api-tests";
import {
  apiUnderTestConfig,
  UserRole,
  RoleCredentials,
} from "./apiUnderTestConfig";

export type JwtToken = string;

/**
 * Authenticates a user and returns a JWT token.
 */
async function fetchJwtToken(credentials: RoleCredentials): Promise<JwtToken> {
  // TODO: Replace with actual authentication call to your API
  // Example implementation:
  //
  // const response = await fetch(`${apiUnderTestConfig.apiBaseUrl}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     username: credentials.username,
  //     password: credentials.password,
  //   }),
  // });
  //
  // if (!response.ok) {
  //   throw new Error(`Authentication failed for ${credentials.username}`);
  // }
  //
  // const data = await response.json();
  // return data.token;

  // Placeholder: returns a fake token for demonstration
  return `fake-jwt-token-for-${credentials.username}`;
}

/**
 * Gets a cached JWT token for the specified role.
 *
 * The first call for a role triggers authentication.
 * Subsequent calls reuse the cached token, avoiding redundant auth calls.
 *
 * Usage in fixtures:
 * ```typescript
 * export async function getHello(role: UserRole = "reader") {
 *   const jwtToken = await getJwtTokenFor(role);
 *   return await api.getHello({
 *     headers: { Authorization: `Bearer ${jwtToken}` },
 *   });
 * }
 * ```
 */
export const getJwtTokenFor = defineGetSharedFixtureByKey<UserRole, JwtToken>(
  async (role: UserRole) => {
    const credentials = apiUnderTestConfig.roles[role];
    if (!credentials) {
      throw new Error(
        `Unknown role: ${role}. Available roles: ${Object.keys(apiUnderTestConfig.roles).join(", ")}`
      );
    }
    return fetchJwtToken(credentials);
  }
);
