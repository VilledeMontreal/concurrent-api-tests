import { defineCopyTemplate } from "@villedemontreal/concurrent-api-tests";
import {
  WaterServiceConnectionRequest,
  PointRequest,
  ServedAddressesRequest,
} from "../shared/apiUnderTest/generated/api";

export const copyPointTemplate = defineCopyTemplate<PointRequest>({
  type: "Point",
  coordinates: [-73.5673, 45.5017],
});

export const copyServedAddressesTemplate =
  defineCopyTemplate<ServedAddressesRequest>({
    useCorrection: false,
  });

export const copyWaterServiceConnectionTemplate =
  defineCopyTemplate<WaterServiceConnectionRequest>({
    location: copyPointTemplate(),
    servedAddresses: copyServedAddressesTemplate(),
    isDeleted: false,
    dataPartitionId: null,
  });
