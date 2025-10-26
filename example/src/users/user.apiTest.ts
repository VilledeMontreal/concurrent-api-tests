import { assert } from "chai";
import { postUser } from "./user.fixture";
import { copyUserTemplate } from "./user.template";

export function userApiTests() {
  describe("Users", () => {
    // data partition: by user id
    it("Create", async () => {
      const request = copyUserTemplate((x) => {
        x.fullName = "John Doe";
        x.email = "john.doe@gmail.com";
      });

      const actual = await postUser(request);

      assert.strictEqual(actual.body.fullName, "John Doe");
      assert.strictEqual(actual.body.email, "john.doe@gmail.com");
    });
  });
}
