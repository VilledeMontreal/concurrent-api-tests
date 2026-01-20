import { assert } from "chai";
import { getHello } from "./hello.fixture";

export function helloApiTests() {
  describe("Hello API", () => {
    it("Reader can access the hello endpoint", async () => {
      const actual = await getHello("reader");

      assert.strictEqual(actual.userName, "reader@example.com");
    });

    it("Writer can access the hello endpoint", async () => {
      const actual = await getHello("writer");

      assert.strictEqual(actual.userName, "writer@example.com");
    });
  });
}
