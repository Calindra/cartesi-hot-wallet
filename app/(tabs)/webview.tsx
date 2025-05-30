import SettingsModal from '@/components/SettingsModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import LoginContext from '@/hooks/loginContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Settings } from '@/src/model/Settings';
import { settingsService } from '@/src/services/SettingsService';
import { walletService } from '@/src/services/WalletService';
import * as Sentry from '@sentry/react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

const DEFAULT_GAME_PAGE = 'https://ipfs.io/ipfs/bafybeiardcuzfsfkecblcx4p5sueisfrgnvtl6oovqzffeiel5agbv4laa/landscape-fullscreen.html';

//todo: ESSA É A ABA RIVES NO BORUMBÁ
const { height, width } = Dimensions.get('window');
const paddingBottom = Platform.OS === 'ios' ? 120 : Platform.OS === 'android' ? 40 : 0;
const injectedJS = `
    window.innerHeight = ${height - paddingBottom};
    window.__deviceOrientation = {
      enabled:true,
      right: 6.9,
      left: -6.9,
      up: 42,
      down: 50,
    };
    (() => {
      const listeners = {};
      const requests = {};
      window.cartesiWallet = window.ethereum = {
        request: (args) => {
          const reqId = crypto.randomUUID();
          const req = { method: "request", reqId, args };
          window.ReactNativeWebView.postMessage(JSON.stringify(req));
          const promiseWrapper = {}
          promiseWrapper.promise = new Promise((resolve, reject) => {
            promiseWrapper.resolve = resolve;
            promiseWrapper.reject = reject;
          });
          requests[reqId] = promiseWrapper;
          console.log("request", req);
          return promiseWrapper.promise;
        },
        on: (eventName, listenerFn) => {
          try {
            console.log('on', eventName)
            const reqId = crypto.randomUUID();
            let mapFun = listeners[eventName] || new Map();
            mapFun.set(listenerFn, reqId);
            listeners[eventName] = mapFun;
            window.ReactNativeWebView.postMessage(JSON.stringify({ method: "on", reqId, eventName }));
          } catch (e) {
            console.log(e)
          }
        },
        removeListener: (...args) => {
          const reqId = crypto.randomUUID();
          window.ReactNativeWebView.postMessage(JSON.stringify({ method: "removeListener", reqId, args }));
        },
        eventReceiver: (event) => {
          const map = listeners[event.eventName];
          if (!map) {
            return
          }
          for (const fn of map.keys()) {
            fn(event.result)
          }
        },
        responseReceiver: (response) => {
          console.log("response", response)
          if (!requests[response.reqId]) {
            console.log("ReqID not found", response.reqId, requests)
            return
          }
          if (response.error) {
            requests[response.reqId].reject(new Error(response.error.message))
            return
          }
          requests[response.reqId].resolve(response.result)
        },
      };
    })();
    true;
`;

const currentTransaction: any = {};

export default function WebViewScreen() {
    const { gameURL, webviewURI, tiltGamepad, arrowGamepad } = useLocalSearchParams();

    const webViewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { setAddress } = useContext(LoginContext);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [calculatedURI, setCalculatedURL] = useState('');

    const injectJS = `
    document.body.style.overflow = 'hidden';
    rivemuUploadCartridge("${gameURL}")
      .then(() => {
        resizeCanvas();
      });
    true;
  `;

    useEffect(() => {
        const initialize = async () => {
            const storedSettings = await settingsService.loadSettings();
            handleApplySettings(storedSettings);
            handleMovementModeChange(storedSettings.movementMode);
        };
        initialize();
    }, [gameURL]);

    const onLoadProgress = ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
        setProgress(nativeEvent.progress);
        Animated.timing(progressAnim, {
            toValue: nativeEvent.progress,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const ProgressBar = () => {
        return progress !== 1 ? (
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: colors.tint,
                        width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        ) : null;
    };

    const handleMovementModeChange = (movementMode: string) => {
        if (movementMode === 'tilt' && tiltGamepad) {
            navigateToGamepad(tiltGamepad as string);
        } else if (movementMode === 'arrow' && arrowGamepad) {
            navigateToGamepad(arrowGamepad as string);
        }
    };

    const navigateToGamepad = (gamepadFileName: string) => {
        let aux = (webviewURI as string).split('/');
        aux.pop();
        gamepadFileName = `${aux.join('/')}/${gamepadFileName}`;
        console.log('navigateToGamepad', gamepadFileName);
        setCalculatedURL(gamepadFileName);
        if (webViewRef.current) {
            const settingsScript = `
        window.location.href = ${JSON.stringify(gamepadFileName)};
        true;
      `;
            webViewRef.current.injectJavaScript(settingsScript);
        }
    };

    const handleApplySettings = async (settings: Settings) => {
        if (webViewRef.current) {
            const leftRight = settings.deviceOrientation.leftRight;
            const LR = 30;
            const lr = (1 - leftRight / 200) * LR;
            const left = -lr;
            const right = lr;
            const upDown = settings.deviceOrientation.upDown;
            const ud = (1 - upDown / 200) * LR;
            const upDownAngle = -settings.deviceOrientation.upDownAngle;
            const up = upDownAngle + ud;
            const down = upDownAngle - ud;
            console.log({ up, down, upDown, upDownAngle });
            const settingsScript = `
          window.__deviceOrientation = {
            enabled: true,
            right: ${right},
            left: ${left},
            up: ${up},
            down: ${down},
          };
          true;
        `;
            webViewRef.current.injectJavaScript(settingsScript);
        }
    };

    const cancelTransaction = async () => {
        setModalVisible(false);
        const response = {
            reqId: currentTransaction.request.reqId,
            error: {
                message: `The user canceled the transaction`,
            },
        };
        const eventScript = `
      window.ethereum.responseReceiver(${JSON.stringify(response)});
      true; // To ensure execution is finished
    `;
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(eventScript);
        }
    };

    const handleTransaction = async () => {
        setModalVisible(false);
        const client = walletService.getCurrentWallet();
        if (!client) {
            // TODO: open the login screen
            console.log('TODO: open the login screen.');
            return;
        }
        try {
            console.log('Sending transaction...');
            const txHash = await client.sendTransaction(currentTransaction.params);
            console.log('Transaction Hash:', txHash);
            const result = txHash;
            console.log('result', result);
            const response = {
                reqId: currentTransaction.request.reqId,
                result,
            };
            const eventScript = `
          window.ethereum.responseReceiver(${JSON.stringify(response)});
          true; // To ensure execution is finished
        `;
            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(eventScript);
            }
        } catch (e) {
            console.error(`Error sending transaction`, e);
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test3@example.com' }, // context info about user
                tags: { feature: 'handleTransaction' },
                extra: { debugData: '@webview.tsx - Error sending transaction' },
                // fingerprint: ['custom-fingerprint'],
            });
            if (e instanceof Error) {
                const response = {
                    reqId: currentTransaction.request.reqId,
                    result: {
                        error: {
                            message: e.message,
                        },
                    },
                };
                const eventScript = `
            window.ethereum.responseReceiver(${JSON.stringify(response)});
            true; // To ensure execution is finished
          `;
                if (webViewRef.current) {
                    webViewRef.current.injectJavaScript(eventScript);
                }
            }
        }
    };

    const handleMessage = async (event: WebViewMessageEvent) => {
        const client = walletService.getCurrentWallet();
        if (!client) {
            // TODO: open the login screen
            console.log('No client!');
            setAddress('');
            return;
        }
        const message = event.nativeEvent.data; // Get message from WebView
        if (message === 'openSettings') {
            setIsSettingsModalOpen(true);
            return;
        }
        // Alert.alert("Message from WebView", message);
        if (webViewRef.current) {
            const request = JSON.parse(message);
            console.log('Raw request', request);
            if (request.method === 'request') {
                try {
                    console.log(request);
                    let result;
                    if (request.args.method === 'eth_requestAccounts' || request.args.method === 'eth_accounts') {
                        result = [client.account?.address];
                    } else if (request.args.method === 'eth_sendTransaction') {
                        const params = request.args.params[0];
                        currentTransaction.params = {
                            ...params,
                            account: client.account!,
                            gasLimit: params.gas,
                            gas: undefined,
                        };
                        currentTransaction.request = request;
                        console.log('transactionParams', currentTransaction);
                        setModalVisible(true);
                        return;
                    } else {
                        result = await client.request(request.args);
                    }
                    console.log('result', result);
                    const response = {
                        reqId: request.reqId,
                        result,
                    };
                    const eventScript = `
            window.ethereum.responseReceiver(${JSON.stringify(response)});
            true; // To ensure execution is finished
          `;
                    webViewRef.current.injectJavaScript(eventScript);
                } catch (e) {
                    Sentry.captureException(e, {
                        // user: { id: '123', email: 'test1@example.com' }, // context info about user
                        tags: { feature: 'handleMessage' },
                        extra: { debugData: '@createAccount.tsx - Error handling message' },
                        // fingerprint: ['custom-fingerprint'],
                    });
                    console.error(e);
                }
            } else if (request.method === 'on' && request.eventName === 'accountsChanged') {
                console.log('Register listener', request);
                const result = [client.account?.address];
                const response = {
                    eventName: request.eventName,
                    result,
                };
                const eventScript = `
          window.ethereum.eventReceiver(${JSON.stringify(response)});
          true; // To ensure execution is finished
        `;
                webViewRef.current.injectJavaScript(eventScript);
            }
        }
    };
    console.log(`webview url = ${(webviewURI as string) || DEFAULT_GAME_PAGE}`);
    return (
        <GestureHandlerRootView>
            <SettingsModal
                visible={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSettingsChange={handleApplySettings}
                onMovementModeChange={handleMovementModeChange}
            />
            <ThemedView style={styles.container}>
                <ProgressBar />
                <WebView
                    ref={webViewRef}
                    source={{
                        uri: calculatedURI || (webviewURI as string) || DEFAULT_GAME_PAGE,
                    }}
                    style={styles.webview}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onLoadProgress={onLoadProgress}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    bounces={false}
                    overScrollMode="never"
                    onError={syntheticEvent => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                    injectedJavaScriptBeforeContentLoaded={injectedJS}
                    injectedJavaScript={injectJS}
                    onMessage={handleMessage}
                    webviewDebuggingEnabled={true}
                />
                {isLoading && <ActivityIndicator style={styles.loader} size="large" color={colors.tint} />}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide" // Changed to slide for better UX
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1} // Prevents opacity flash
                        onPress={() => setModalVisible(false)} // Close on background press
                    >
                        <View
                            style={styles.modalContent}
                            onStartShouldSetResponder={() => true} // Prevents closing when pressing modal content
                        >
                            <ThemedText style={styles.modalTitle}>Confirm Transaction</ThemedText>
                            <ThemedText style={styles.modalMessage}>Are you sure you want to send this transaction?</ThemedText>
                            <View style={styles.buttonContainer}>
                                <Pressable style={[styles.button, styles.cancelButton]} onPress={cancelTransaction}>
                                    <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                                </Pressable>
                                <Pressable style={[styles.button, styles.confirmButton]} onPress={handleTransaction}>
                                    <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ThemedView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    webview: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    progressBar: {
        height: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better contrast
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '85%', // More responsive width
        maxWidth: 400, // Maximum width for larger screens
        minWidth: 280, // Minimum width for smaller screens
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5, // Android shadow
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: '#F2F2F2',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
