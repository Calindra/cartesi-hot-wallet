const VERSION = '0.0.1'
const VERSION_CODE = 1
module.exports = {
  expo: {
    name: 'cartesi-hot-wallet',
    icon: './assets/images/cartesi-hot-wallet-logo.png',
    version: VERSION,
    slug: 'cartesi-hot-wallet',
    userInterfaceStyle: 'automatic',
    owner: 'calindratech',
    // jsEngine: 'hermes',
    newArchEnabled: true,

    // O runtimeVersion deve mudar toda vez que alteramos algum plugin
    // ou alteramos a versao do sdk
    runtimeVersion: '1.2.1',
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/cdc7c2e3-7e5c-4570-98a3-299f22db8d86',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'io.cartesi.hotwallet',
      buildNumber: VERSION,
      publishBundlePath: 'ios/CartesiHotWallet/Supporting/shell-app.bundle',
      publishManifestPath: 'ios/CartesiHotWallet/Supporting/shell-app-manifest.json',
      supportsTablet: false,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'io.cartesi.hotwallet',
      //   "package": "com.fabiooshiro.lennaagentproject",
      versionCode: VERSION_CODE,
      publishBundlePath: 'android/app/src/main/assets/shell-app.bundle',
      publishManifestPath: 'android/app/src/main/assets/shell-app-manifest.json',
      permissions: [],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash.png',
          imageWidth: 400,
          resizeMode: 'contain',
          backgroundColor: '#a435f1',
        },
      ],
    ],
    orientation: 'portrait',
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'd4af2bff-dcd5-4d33-bdc5-bd839c286a74',
      },
    },
  },
}
