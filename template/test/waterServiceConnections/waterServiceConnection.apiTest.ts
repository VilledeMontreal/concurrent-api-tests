import { shouldThrow } from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";
import {
  postWaterServiceConnection,
  putWaterServiceConnection,
  getDataPartitionId,
} from "./waterServiceConnection.fixture";
import {
  copyWaterServiceConnectionTemplate,
  copyPointTemplate,
} from "./waterServiceConnection.template";

export function waterServiceConnectionApiTests() {
  describe("Gestion des branchements d'eau", () => {
    describe("Règle: Tout utilisateur autorisé peut créer un branchement d'eau", () => {
      it("Création d'un branchement d'eau", async () => {
        const request = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = getDataPartitionId("create-wsc");
          x.location = copyPointTemplate((p) => {
            p.coordinates = [-73.5700, 45.5100];
          });
        });

        const actual = await postWaterServiceConnection(request, "depisteur");

        assert.strictEqual(actual.location.coordinates[0], -73.57);
        assert.strictEqual(actual.location.coordinates[1], 45.51);
        assert.strictEqual(actual.isDeleted, false);
      });
    });

    describe("Règle: Tout utilisateur autorisé peut déplacer un branchement d'eau", () => {
      it("Déplacement d'un branchement d'eau", async () => {
        const dataPartitionId = getDataPartitionId("move-wsc");
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.location = copyPointTemplate((p) => {
            p.coordinates = [-73.5800, 45.5200];
          });
        });
        const created = await postWaterServiceConnection(createRequest, "depisteur");

        const updateRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.location = copyPointTemplate((p) => {
            p.coordinates = [-73.5900, 45.5300];
          });
        });
        const actual = await putWaterServiceConnection(created.id, updateRequest, "depisteur");

        assert.strictEqual(actual.location.coordinates[0], -73.59);
        assert.strictEqual(actual.location.coordinates[1], 45.53);
      });
    });

    describe("Règle: Seul le contremaître peut supprimer un branchement d'eau", () => {
      it("Le contremaître supprime un branchement d'eau", async () => {
        const dataPartitionId = getDataPartitionId("delete-by-foreman");
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
        });
        const created = await postWaterServiceConnection(createRequest, "contremaitre");

        const deleteRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.isDeleted = true;
        });
        const actual = await putWaterServiceConnection(created.id, deleteRequest, "contremaitre");

        assert.strictEqual(actual.isDeleted, true);
      });

      it("Un utilisateur non contremaître ne peut pas supprimer un branchement d'eau", async () => {
        const dataPartitionId = getDataPartitionId("delete-by-screener");
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
        });
        const created = await postWaterServiceConnection(createRequest, "depisteur");

        const deleteRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.isDeleted = true;
        });

        await shouldThrow(
          () => putWaterServiceConnection(created.id, deleteRequest, "depisteur"),
          (err) => {
            assert.strictEqual(err.status, 403);
            assert.exists(err.data);
          }
        );
      });
    });

    describe("Règle: Un branchement d'eau avec des activités rattachées ne peut pas être supprimé", () => {
      // TODO: Implement this test once work report creation is available.
      // This test requires creating a water service connection with related activities
      // (work reports, inspections, etc.) to verify the deletion is rejected.
      it.skip("Impossible de supprimer un branchement avec des activités rattachées", async () => {
        // Arrange: Create a water service connection with related activities
        // Act: Attempt to delete the water service connection
        // Assert: Deletion is rejected with appropriate error
      });
    });
  });
}
