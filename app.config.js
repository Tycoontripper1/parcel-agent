
export default ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    [
      "expo-build-properties",
      {
        android: {
          kotlinVersion: "2.0.0"
        }
      }
    ]
  ],
  extra: {
    ...config.extra,
    apiKey: "http://45.9.191.184:8001/parcel/v1.0/api",
  },
});
