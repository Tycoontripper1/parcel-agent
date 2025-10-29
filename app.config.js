export default ({ config }) => ({
  ...config,
  plugins: [
    // keep existing plugins
    ...(config.plugins || []),

    // ✅ add expo-web-browser plugin
    "expo-web-browser",

    // keep your existing expo-build-properties setup
    [
      "expo-build-properties",
      {
        android: {
          kotlinVersion: "2.0.0",
        },
      },
    ],
  ],
  extra: {
    ...config.extra,
    apiKey: "http://45.9.191.184:8001/parcel/v1.0/api",
  },
});
