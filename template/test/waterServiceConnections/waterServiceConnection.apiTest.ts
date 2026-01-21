import { shouldThrow, getTestRunId } from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";
import {
  postWaterServiceConnection,
  putWaterServiceConnection,
  getWaterServiceConnection,
  getDeletedWaterServiceConnections,
} from "./waterServiceConnection.fixture";
import {
  copyWaterServiceConnectionTemplate,
  copyPointTemplate,
} from "./waterServiceConnection.template";

export function waterServiceConnectionApiTests() {
  describe("Fonctionnalité: Gestion des branchements d'eau", () => {
    describe("Règle: Tout utilisateur autorisé peut créer un branchement d'eau", () => {
      it("Exemple: Création d'un branchement d'eau", async () => {
        const dataPartitionId = `${getTestRunId()}-create-wsc`;
        const request = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.location = copyPointTemplate((p) => {
            p.coordinates = [-73.5673, 45.5017];
          });
        });

        const actual = await postWaterServiceConnection(request);

        assert.deepEqual(actual.location.coordinates, [-73.5673, 45.5017]);
        assert.strictEqual(actual.isDeleted, false);
      });
    });

    describe("Règle: Tout utilisateur autorisé peut déplacer un branchement d'eau", () => {
      it("Exemple: Déplacement d'un branchement d'eau", async () => {
        const dataPartitionId = `${getTestRunId()}-move-wsc`;
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
          x.location = copyPointTemplate((p) => {
            p.coordinates = [-73.5673, 45.5017];
          });
        });
        const created = await postWaterServiceConnection(createRequest);

        created.location.coordinates = [-73.6000, 45.5100];
        const actual = await putWaterServiceConnection(created.id, created);

        assert.deepEqual(actual.location.coordinates, [-73.6000, 45.5100]);
      });
    });

    describe("Règle: Seul le contremaître peut supprimer un branchement d'eau", () => {
      it("Exemple: Le contremaître supprime un branchement d'eau", async () => {
        const dataPartitionId = `${getTestRunId()}-delete-wsc-contremaitre`;
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
        });
        const created = await postWaterServiceConnection(createRequest);

        created.isDeleted = true;
        await putWaterServiceConnection(created.id, created, "contremaitre");

        const deletedList = await getDeletedWaterServiceConnections(
          dataPartitionId,
          "contremaitre"
        );
        assert.strictEqual(deletedList.length, 1);
        assert.strictEqual(deletedList[0].id, created.id);
      });

      it("Exemple: Un utilisateur non contremaître ne peut pas supprimer un branchement d'eau", async () => {
        const dataPartitionId = `${getTestRunId()}-delete-wsc-depisteur`;
        const createRequest = copyWaterServiceConnectionTemplate((x) => {
          x.dataPartitionId = dataPartitionId;
        });
        const created = await postWaterServiceConnection(createRequest);

        created.isDeleted = true;

        await shouldThrow(
          () => putWaterServiceConnection(created.id, created, "depisteur"),
          (err) => {
            assert.strictEqual(err.status, 403);
          }
        );
      });
    });
  });
}
