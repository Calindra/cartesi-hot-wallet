const VERSION = '0.0.1'
const IOS_BUILDNUMBER = '1'
module.exports = {
  expo: {
    name: 'cartesi-hot-wallet',
    slug: 'cartesi-hot-wallet',
    version: VERSION,
    orientation: 'portrait',
    icon: './assets/images/cartesi-hot-wallet-logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'io.cartesi.hotwallet',
      supportsTablet: false,
      buildNumber: IOS_BUILDNUMBER,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'io.cartesi.hotwallet',
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
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'add-something-here',
      },
    },
    cli: {
      appVersionSource: 'remote',
    },
  },
}
