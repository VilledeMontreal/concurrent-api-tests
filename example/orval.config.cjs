module.exports = {
  robotDictee: {
    input: "./gherkins/robot-dictée/open-api.yaml",
    output: {
      target: "./test/shared/apiUnderTest/generated/api.ts",
      baseUrl: "https://echo.free.beeceptor.com",
      client: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
          forceSuccessResponse: true
        },
      },
    },
  },
};
