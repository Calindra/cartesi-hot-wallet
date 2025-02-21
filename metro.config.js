const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  crypto: require.resolve("react-native-polyfill-globals"),
  stream: require.resolve("stream-browserify"),
};

module.exports = defaultConfig;
