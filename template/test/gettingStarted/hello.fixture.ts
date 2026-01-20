import {
  getHello as getHelloApiClient,
  getHelloResponseSuccess,
} from "../shared/apiUnderTest/generated/api";
import { getJwtTokenFor } from "../shared/apiUnderTest/tooling/auth.sharedFixture";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

export async function getHello(
  role: UserRole = "reader"
): Promise<getHelloResponseSuccess> {
  const jwtToken = await getJwtTokenFor(role);
  return (await getHelloApiClient({
    headers: { Authorization: `Bearer ${jwtToken}` },
  })) as getHelloResponseSuccess;
}
