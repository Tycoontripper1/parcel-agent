
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
    apiKey: "https://api.parcelpointng.com:4001/parcel/v1.0",
  },
});
