import { LoginProvider } from '@/hooks/LoginProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
    dsn: 'https://857017361305802b9f7dcf49cb0b200b@o1175882.ingest.us.sentry.io/4509231123922944',
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 0.4,
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const ref = useNavigationContainerRef();

    useEffect(() => {
        if (ref?.current) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <LoginProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                    <Stack.Screen name="fullscreen" />
                    <Stack.Screen name="send" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </LoginProvider>
    );
}

export default Sentry.wrap(RootLayout);
