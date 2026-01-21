import { shouldThrow } from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";
import {
  postWaterServiceConnection,
  putWaterServiceConnection,
  createDataPartitionId,
} from "./waterServiceConnection.fixture";
import {
  copyWaterServiceConnectionTemplate,
  copyPointTemplate,
} from "./waterServiceConnection.template";
import { UserRole } from "../shared/apiUnderTest/tooling/apiUnderTestConfig";

const authorizedRoles: { role: UserRole }[] = [
  { role: "depisteur" },
  { role: "inspecteur" },
  { role: "contremaitre" },
];

const nonForemanRoles: { role: UserRole }[] = [
  { role: "depisteur" },
  { role: "inspecteur" },
];

export function waterServiceConnectionApiTests() {
  describe("Gestion des branchements d'eau", () => {
    describe("Règle: Tout utilisateur autorisé peut créer un branchement d'eau", () => {
      it.each(authorizedRoles)(
        "Création d'un branchement d'eau par un $role",
        async ({ role }) => {
          const request = copyWaterServiceConnectionTemplate((x) => {
            x.dataPartitionId = createDataPartitionId();
            x.location = copyPointTemplate((p) => {
              p.coordinates = [-73.57, 45.51];
            });
          });

          const actual = await postWaterServiceConnection(request, role);

          assert.strictEqual(actual.location.coordinates[0], -73.57);
          assert.strictEqual(actual.location.coordinates[1], 45.51);
          assert.strictEqual(actual.isDeleted, false);
        }
      );
    });

    describe("Règle: Tout utilisateur autorisé peut déplacer un branchement d'eau", () => {
      it.each(authorizedRoles)(
        "Déplacement d'un branchement d'eau par un $role",
        async ({ role }) => {
          const dataPartitionId = createDataPartitionId();
          const createRequest = copyWaterServiceConnectionTemplate((x) => {
            x.dataPartitionId = dataPartitionId;
            x.location = copyPointTemplate((p) => {
              p.coordinates = [-73.58, 45.52];
            });
          });
          const created = await postWaterServiceConnection(createRequest, role);

          const updateRequest = copyWaterServiceConnectionTemplate((x) => {
            x.dataPartitionId = dataPartitionId;
            x.location = copyPointTemplate((p) => {
              p.coordinates = [-73.59, 45.53];
            });
          });
          const actual = await putWaterServiceConnection(created.id, updateRequest, role);

          assert.strictEqual(actual.location.coordinates[0], -73.59);
          assert.strictEqual(actual.location.coordinates[1], 45.53);
        }
      );
    });

    describe("Règle: Seul le contremaître peut supprimer un branchement d'eau", () => {
      it("Le contremaître supprime un branchement d'eau", async () => {
        const dataPartitionId = createDataPartitionId();
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

      it.each(nonForemanRoles)(
        "Un $role ne peut pas supprimer un branchement d'eau",
        async ({ role }) => {
          const dataPartitionId = createDataPartitionId();
          const createRequest = copyWaterServiceConnectionTemplate((x) => {
            x.dataPartitionId = dataPartitionId;
          });
          const created = await postWaterServiceConnection(createRequest, role);

          const deleteRequest = copyWaterServiceConnectionTemplate((x) => {
            x.dataPartitionId = dataPartitionId;
            x.isDeleted = true;
          });

          await shouldThrow(
            () => putWaterServiceConnection(created.id, deleteRequest, role),
            (err) => {
              assert.strictEqual(err.status, 403);
              assert.exists(err.data);
            }
          );
        }
      );
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
