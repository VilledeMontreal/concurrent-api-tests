import {
  getHello as getHelloApiClient,
  getHelloResponseSuccess,
} from "../shared/apiUnderTest/generated/api";
import { getJwtTokenFor } from "../shared/apiUnderTest/tooling/auth.sharedFixture";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

export async function getHello(
  role: UserRole = "reader", // Each fixture sets its own default role
): Promise<getHelloResponseSuccess["data"]> {
  const jwtToken = await getJwtTokenFor(role);
  const response = await getHelloApiClient({
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
  return (response as getHelloResponseSuccess).data; // Return body directly to improve readability
}
