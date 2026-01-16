import { assert } from "chai";
import { postUser } from "./user.fixture";
import { copyUserTemplate } from "./user.template";

export function userApiTests() {
  describe("User management", () => {
    it("Create a new user", async () => {
      const request = copyUserTemplate((x) => {
        x.role = "author";
        x.fullName = "Jane Smith";
        x.email = "jane.smith@example.com";
      });

      const actual = await postUser(request);

      assert.strictEqual(actual.data.role, "author");
      assert.strictEqual(actual.data.fullName, "Jane Smith");
      assert.strictEqual(actual.data.email, "jane.smith@example.com");
    });
  });
}
