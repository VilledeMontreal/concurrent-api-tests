import { assert } from "chai";
import {
  defineGetSharedFixture,
  defineGetSharedFixtureByKey,
  shouldThrow,
} from "..";
import { describe, it } from "vitest";

describe("Shared fixture", () => {
  it("Get shared fixture load only once", async () => {
    let loadSharedFixtureCount = 0;
    const getShareFixture = defineGetSharedFixture<string>(async () => {
      loadSharedFixtureCount++;
      return "something slow to setup";
    });

    const first = await getShareFixture();
    const second = await getShareFixture();

    assert.strictEqual(loadSharedFixtureCount, 1);
    assert.strictEqual(first, "something slow to setup");
    assert.strictEqual(second, "something slow to setup");
  });

  it("Get shared fixture by key load each key once", async () => {
    const loadSharedFixtureByKeyCount: Record<string, number> = {
      admin: 0,
      guess: 0,
    };
    const getShareFixtureByKey = defineGetSharedFixtureByKey<string, string>(
      async (key) => {
        loadSharedFixtureByKeyCount[key] = loadSharedFixtureByKeyCount[key] + 1;
        return `default user with role = ${key}`;
      }
    );

    const adminFirst = await getShareFixtureByKey("admin");
    const adminSecond = await getShareFixtureByKey("admin");
    const guessFirst = await getShareFixtureByKey("guess");
    const guessSecond = await getShareFixtureByKey("guess");

    assert.strictEqual(loadSharedFixtureByKeyCount.admin, 1);
    assert.strictEqual(adminFirst, "default user with role = admin");
    assert.strictEqual(adminSecond, "default user with role = admin");
    assert.strictEqual(loadSharedFixtureByKeyCount.guess, 1);
    assert.strictEqual(guessFirst, "default user with role = guess");
    assert.strictEqual(guessSecond, "default user with role = guess");
  });

  it("Get shared fixture load only once", async () => {
    const getShareFixture = defineGetSharedFixture<string>(async () => {
      throw new Error("Pow");
    });

    await shouldThrow(
      () => getShareFixture(),
      (err: any) => assert.strictEqual(err.message, "Pow")
    );
  });
});
