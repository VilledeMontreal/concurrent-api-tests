import * as config from "config";

export interface RoleCredentials {
  username: string;
  password: string;
}

export interface ApiUnderTestConfig {
  apiBaseUrl: string;
  roles: Record<string, RoleCredentials>;
}

export const apiUnderTestConfig: ApiUnderTestConfig = config.get(
  "shared.apiUnderTest",
);

export type UserRole = keyof typeof apiUnderTestConfig.roles;
