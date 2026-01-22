import { assert } from "chai";
import { getBoroughs } from "./borough.fixture";

export function boroughApiTests() {
  describe("Fonctionnalité: Consultation des arrondissements", () => {
    describe("Règle: La liste des arrondissements est triée en ordre alphabétique", () => {
      it("Exemple: Lister tous les arrondissements", async () => {
        const actual = await getBoroughs();

        assert.strictEqual(actual[0].name, "Ahuntsic - Cartierville");
      });
    });

    describe("Règle: La recherche par nom est insensible à la casse", () => {
      it.each([{ critere: "Cart" }, { critere: "cart" }])(
        "Plan du scénario: Rechercher un arrondissement par nom partiel (critère: $critere)",
        async ({ critere }) => {
          const actual = await getBoroughs("depisteur", critere);

          assert.strictEqual(actual.length, 1);
          assert.strictEqual(actual[0].name, "Ahuntsic - Cartierville");
        }
      );
    });

    describe("Règle: Seul le contremaître a accès à l'arrondissement \"Inconnue\"", () => {
      it("Exemple: Le contremaître voit l'arrondissement \"Inconnue\"", async () => {
        const actual = await getBoroughs("contremaitre");

        assert.strictEqual(actual.length, 20);
        assert.isTrue(actual.some((b) => b.name === "Inconnue"));
      });

      it.each([{ role: "depisteur" as const }, { role: "inspecteur" as const }])(
        "Plan du scénario: Les autres rôles ne voient pas l'arrondissement \"Inconnue\" (rôle: $role)",
        async ({ role }) => {
          const actual = await getBoroughs(role);

          assert.strictEqual(actual.length, 19);
          assert.isFalse(actual.some((b) => b.name === "Inconnue"));
        }
      );

      it.each([{ role: "depisteur" as const }, { role: "inspecteur" as const }])(
        "Plan du scénario: Les autres rôles ne trouvent pas l'arrondissement \"Inconnue\" par recherche (rôle: $role)",
        async ({ role }) => {
          const actual = await getBoroughs(role, "Inconnue");

          assert.strictEqual(actual.length, 0);
        }
      );
    });
  });
}
