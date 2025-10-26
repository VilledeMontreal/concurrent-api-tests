import {
  defineGetSharedFixture,
  defineGetSharedFixtureByKey,
} from "@villedemontreal/concurrent-api-tests";
import {
  HttpResponse,
  postUserApiClient,
  User,
} from "../shared/apiUnderTest/apiClient";
import { apiUnderTestConfig } from "../shared/apiUnderTest/apiUnderTestConfig";
import { copyUserTemplate } from "./user.template";

// A fixture may be shared between the test cases of the same test run if
// 1) the attribute of the user are not meaningful for the test
// 2) the fixture is immutable
//
// Although shared fixture can speed up test runs and reduce the amount of data created
// on the server, they must be used with care since they can produce flaky test cases
// if the two points above are not respected. In doubt, create a new fixture for each
// test case. Fast tests are important, but reliable tests are even more important.
export const getImmutableGuessUser = defineGetSharedFixture<User>(() =>
  createUser("guess"),
);

export const getImmutableUser = defineGetSharedFixtureByKey<string, User>(
  (role) => createUser(role),
);

async function createUser(role: string) {
  const response = await postUser(
    copyUserTemplate((x) => {
      x.role = role;
      x.fullName = `${role} user`;
    }),
  );
  return response.body;
}

export async function postUser(request: User): Promise<HttpResponse<User>> {
  return await postUserApiClient(apiUnderTestConfig.apiBaseUrl, request);
}
