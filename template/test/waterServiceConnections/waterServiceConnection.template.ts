import { defineCopyTemplate } from "@villedemontreal/concurrent-api-tests";
import {
  WaterServiceConnectionRequest,
  PointRequest,
} from "../shared/apiUnderTest/generated/api";

export const copyPointTemplate = defineCopyTemplate<PointRequest>({
  type: "Point",
  coordinates: [-73.5673, 45.5017],
});

export const copyWaterServiceConnectionTemplate =
  defineCopyTemplate<WaterServiceConnectionRequest>({
    location: {
      type: "Point",
      coordinates: [-73.5673, 45.5017],
    },
    servedAddresses: {
      useCorrection: false,
    },
    isDeleted: false,
    dataPartitionId: null,
  });
