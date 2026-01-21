import {
  WaterServiceConnectionRequest,
  WaterServiceConnectionResponse,
  postWaterServiceConnection as postWaterServiceConnectionApiClient,
  putWaterServiceConnection as putWaterServiceConnectionApiClient,
  getWaterServiceConnection as getWaterServiceConnectionApiClient,
  getDeletedWaterServiceConnection as getDeletedWaterServiceConnectionApiClient,
  DeletedWaterServiceConnectionItemResponse,
  postWaterServiceConnectionResponseSuccess,
  putWaterServiceConnectionResponseSuccess,
  getWaterServiceConnectionResponseSuccess,
  getDeletedWaterServiceConnectionResponseSuccess,
} from "../shared/apiUnderTest/generated/api";
import { getJwtTokenFor } from "../shared/apiUnderTest/tooling/auth.sharedFixture";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

export async function postWaterServiceConnection(
  request: WaterServiceConnectionRequest,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const response = (await postWaterServiceConnectionApiClient(request, undefined, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  })) as postWaterServiceConnectionResponseSuccess;
  return response.data;
}

export async function putWaterServiceConnection(
  id: string,
  wsc: WaterServiceConnectionResponse,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const request: WaterServiceConnectionRequest = {
    location: wsc.location,
    receiveWaterFrom: wsc.receiveWaterFrom,
    propertyLineBeforeCurbLengthInCm: wsc.propertyLineBeforeCurbLengthInCm,
    servedAddresses: wsc.servedAddresses,
    isDeleted: wsc.isDeleted,
  };
  const response = (await putWaterServiceConnectionApiClient(id, request, undefined, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  })) as putWaterServiceConnectionResponseSuccess;
  return response.data;
}

export async function getWaterServiceConnection(
  id: string,
  role: UserRole = "depisteur"
): Promise<WaterServiceConnectionResponse> {
  const jwtToken = await getJwtTokenFor(role);
  const response = (await getWaterServiceConnectionApiClient(id, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  })) as getWaterServiceConnectionResponseSuccess;
  return response.data;
}

export async function getDeletedWaterServiceConnections(
  dataPartitionId: string,
  role: UserRole = "depisteur"
): Promise<DeletedWaterServiceConnectionItemResponse[]> {
  const jwtToken = await getJwtTokenFor(role);
  const response = (await getDeletedWaterServiceConnectionApiClient(
    { dataPartitionId },
    { headers: { Authorization: `Bearer ${jwtToken}` } }
  )) as getDeletedWaterServiceConnectionResponseSuccess;
  return response.data.items ?? [];
}
