import { v4 as uuidv4 } from "uuid";
import { getTestRunId } from "@villedemontreal/concurrent-api-tests";
import {
  postWaterServiceConnection as postWaterServiceConnectionApiClient,
  postWaterServiceConnectionResponseSuccess,
  putWaterServiceConnection as putWaterServiceConnectionApiClient,
  putWaterServiceConnectionResponseSuccess,
  getWaterServiceConnection as getWaterServiceConnectionApiClient,
  getWaterServiceConnectionResponseSuccess,
  WaterServiceConnectionRequest,
  WaterServiceConnectionResponse,
} from "../shared/apiUnderTest/generated/api";
import { getJwtTokenFor } from "../shared/apiUnderTest/tooling/auth.sharedFixture";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

// Map to store UUID per test name to ensure consistent partitioning within a test
const testPartitionIds = new Map<string, string>();

/**
 * Generates a unique data partition ID (UUID format) for test isolation.
 * The same testName will return the same UUID within a test run.
 */
export function getDataPartitionId(testName: string): string {
  const key = `${getTestRunId()}-${testName}`;
  if (!testPartitionIds.has(key)) {
    testPartitionIds.set(key, uuidv4());
  }
  return testPartitionIds.get(key)!;
}

export async function postWaterServiceConnection(
  request: WaterServiceConnectionRequest,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const response = await postWaterServiceConnectionApiClient(request, undefined, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
  return (response as postWaterServiceConnectionResponseSuccess).data;
}

export async function putWaterServiceConnection(
  id: string,
  request: WaterServiceConnectionRequest,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const response = await putWaterServiceConnectionApiClient(id, request, undefined, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
  return (response as putWaterServiceConnectionResponseSuccess).data;
}

export async function getWaterServiceConnection(
  id: string,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const response = await getWaterServiceConnectionApiClient(id, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
  return (response as getWaterServiceConnectionResponseSuccess).data;
}
