// const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

// const defaultConfig = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname)

config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-polyfill-globals'),
  stream: require.resolve('stream-browserify'),
}

module.exports = config
