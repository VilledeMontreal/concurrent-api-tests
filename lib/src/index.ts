import { v4 as uuidv4 } from 'uuid';
import assert = require('assert');
import lodash = require('lodash');

// By design, there can be only one apiTestSuite; thus, global properties are acceptable in this context.
let testRunId: string | null = null;

export function getTestRunId() {
  if (!testRunId) {
    // With the prefix zApiTest, it's easy to identify data created by the api tests.
    // The purpose z in zApiTest is to list data created by the api tests at the end.
    // Most system use alphabetical order as default sort order. Api tests tends to
    // create a lot of data. In general, listing manually created data before the data
    // created by api tests is better.
    testRunId = `zApiTest-${uuidv4()}`;
  }
  return testRunId;
}

export function aFewSeconds(delayInSeconds: number): Promise<void> {
  const delayInMiliseconds = delayInSeconds * 1000;
  return new Promise(resolve => {
    setTimeout(async () => {
      resolve();
    }, delayInMiliseconds);
  });
}

export async function shouldThrow<T>(act: () => Promise<T>, customAssert: (err: any) => void): Promise<void> {
  let haveTrown = true;
  try {
    await act();
    haveTrown = false;
  } catch (err) {
    customAssert(err);
  }
  if (!haveTrown) {
    assert.fail('It should have thrown an exception, but it succeeded unexpectedly.');
  }
}

export type InitTemplate<T> = (templateCopy: T) => void;
export type CopyTemplate<T> = (init?: InitTemplate<T>) => T;
export function defineCopyTemplate<T>(template: T): CopyTemplate<T> {
  return (init?: InitTemplate<T>) => {
    const templateCopy = lodash.cloneDeep<T>(template);
    if (init) {
      init(templateCopy);
    }
    return templateCopy;
  };
}

export function defineCopyTemplateVariation<T>(
  originalCopyTemplate: CopyTemplate<T>,
  variation: InitTemplate<T>
): CopyTemplate<T> {
  return (init?: InitTemplate<T>) => {
    return originalCopyTemplate((templateCopy: T) => {
      variation(templateCopy);
      if (init) {
        init(templateCopy);
      }
    });
  };
}

export type CreateSharedFixture<TRootEntity> = () => Promise<TRootEntity>;
export type GetSharedFixture<TRootEntity> = () => Promise<TRootEntity>;
export function defineGetSharedFixture<TRootEntity>(
  createSharedFixture: CreateSharedFixture<TRootEntity>
): GetSharedFixture<TRootEntity> {
  // defineGetSharedFixtureByKey is adapted for the case where a single share fixture is required.
  const getSharedFixtureByKey = defineGetSharedFixtureByKey<string, TRootEntity>(key => createSharedFixture());
  return () => getSharedFixtureByKey('single-key');
}

export type CreateSharedFixtureByKey<TKey, TRootEntity> = (key: TKey) => Promise<TRootEntity>;
export type GetSharedFixtureByKey<TKey, TRootEntity> = (key: TKey) => Promise<TRootEntity>;
export function defineGetSharedFixtureByKey<TKey, TRootEntity>(
  createSharedFixtureByKey: CreateSharedFixtureByKey<TKey, TRootEntity>
): GetSharedFixtureByKey<TKey, TRootEntity> {
  const map: Map<TKey, Promise<TRootEntity>> = new Map();

  return (key: TKey) => {
    // The shared fixture promise will only be created on the first call.
    // Next calls will await for the same share fixture promise;
    // thus, the same fixture is shared between many test cases.
    if (!map.has(key)) {
      const sharedFixturePromise = createSharedFixtureByKey(key)
        // Share fixture must be immutable. Here we enforce it.
        .then(x => Object.freeze(x));

      map.set(key, sharedFixturePromise);
    }

    return map.get(key)!; // We know it exists because we just set it if it wasn't there
  };
}

//*******************************************************************************************
// Reporting
//*******************************************************************************************
