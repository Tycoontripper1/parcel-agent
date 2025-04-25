export default ({ config }) => ({
    ...config,
    extra: {
      ...config.extra,
      apiKey: process.env.TEST_API_KEY,
    },
  });
  