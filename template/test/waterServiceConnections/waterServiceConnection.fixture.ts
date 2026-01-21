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

export function createDataPartitionId(): string {
  return uuidv4();
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
