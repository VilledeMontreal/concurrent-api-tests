import {
  BoroughResponse,
  getBoroughs as getBoroughsApiClient,
  getBoroughsResponseSuccess,
} from "../shared/apiUnderTest/generated/api";
import { getJwtTokenFor } from "../shared/apiUnderTest/tooling/auth.sharedFixture";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

export async function getBoroughs(
  role: UserRole = "depisteur",
  searchQuery?: string
): Promise<BoroughResponse[]> {
  const jwtToken = await getJwtTokenFor(role);
  const response = (await getBoroughsApiClient(
    { q: searchQuery },
    { headers: { Authorization: `Bearer ${jwtToken}` } }
  )) as getBoroughsResponseSuccess;
  return response.data.items ?? [];
}
