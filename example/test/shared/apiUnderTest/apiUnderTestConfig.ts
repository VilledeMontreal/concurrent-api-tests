import * as config from "config";

export interface ApiUnderTestConfig {
  apiBaseUrl: string;
}

export const apiUnderTestConfig: ApiUnderTestConfig = config.get("shared.apiUnderTest");
