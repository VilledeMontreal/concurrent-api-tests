import {
  User,
  postUser as postUserApiClient,
} from "../shared/apiUnderTest/generated/api";

export async function postUser(request: User): Promise<User> {
  return await postUserApiClient(request);
}
