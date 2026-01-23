npmmodule.exports = {
  apiUnderTest: {
    input: "./test/shared/apiUnderTest/open-api.yaml",
    output: {
      target: "./test/shared/apiUnderTest/generated/api.ts",
      client: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./test/shared/apiUnderTest/tooling/mutator.ts",
          default: true,
        },
      },
    },
  },
};
