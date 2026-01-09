import {
  User,
  postUser as postUserApiClient,
  postUserResponseSuccess,
} from "../shared/apiUnderTest/generated/api";

export async function postUser(
  request: User
): Promise<postUserResponseSuccess> {
  return (await postUserApiClient(request)) as postUserResponseSuccess;
}
