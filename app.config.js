const VERSION = '0.0.7';
const IOS_BUILDNUMBER = '7';
const ANDROID_VERSIONCODE = 7;
module.exports = {
    expo: {
        name: 'Cartesi Hot Wallet',
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
                foregroundImage: './assets/images/cartesi-hot-wallet-logo.png',
                backgroundColor: '#ffffff',
            },
            versionCode: ANDROID_VERSIONCODE,
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
                    imageWidth: 800,
                    resizeMode: 'cover',
                    backgroundColor: '#a435f1',
                },
            ],
            [
                'expo-dev-client',
                {
                    launchMode: 'most-recent',
                },
            ],
            [
                '@sentry/react-native/expo',
                {
                    organization: 'calindra',
                    project: 'cartesi-hot-wallet',
                    url: 'https://sentry.io/',
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
                projectId: 'bd0f0df3-44d7-411b-8ccd-9a1345bb32da',
            },
        }
    },
};
