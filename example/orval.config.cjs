module.exports = {
  robotDictee: {
    input: "./test/shared/apiUnderTest/open-api.yaml",
    output: {
      target: "./test/shared/apiUnderTest/generated/api.ts",
      client: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./test/shared/apiUnderTest/mutator.ts",
          default: true,
        },
      },
    },
  },
};
