import SettingsModal from '@/components/SettingsModal'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import LoginContext from '@/hooks/loginContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { walletService } from '@/src/services/WalletService'
import * as NavigationBar from 'expo-navigation-bar'
import * as SecureStore from 'expo-secure-store'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useContext, useEffect, useRef, useState } from 'react'
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
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { Settings } from '@/src/model/Settings'

const DEFAULT_GAME_PAGE = "https://ipfs.io/ipfs/bafybeiab3lenboyilbcnfnxncswhzmhvrzwt325zv2x2ee6y6uvuxmqxsa/landscape-fullscreen.html"

//TODO:
const { height, width } = Dimensions.get('window')
const paddingBottom = 30

const injectedJS = `
    window.innerHeight = ${Math.min(width, height) - paddingBottom};
    window.innerWidth = ${Math.max(width, height)};
    window.__deviceOrientation = {
      enabled: true,
      right: 5,
      left: -5,
      up: -41,
      down: -51,
    };
    (() => {
      const listeners = {};
      const requests = {};
      window.cartesiWallet = window.ethereum = {
        request: (args) => {
          const reqId = crypto.randomUUID();
          const req = { method: "request", reqId, args };
          window.ReactNativeWebView.postMessage(JSON.stringify(req));
          const promiseWrapper = {};
          promiseWrapper.promise = new Promise((resolve, reject) => {
            promiseWrapper.resolve = resolve;
            promiseWrapper.reject = reject;
          });
          requests[reqId] = promiseWrapper;
          return promiseWrapper.promise;
        },
        on: (eventName, listenerFn) => {
          const reqId = crypto.randomUUID();
          let mapFun = listeners[eventName] || new Map();
          mapFun.set(listenerFn, reqId);
          listeners[eventName] = mapFun;
          window.ReactNativeWebView.postMessage(JSON.stringify({ method: "on", reqId, eventName }));
        },
        removeListener: (...args) => {
          const reqId = crypto.randomUUID();
          window.ReactNativeWebView.postMessage(JSON.stringify({ method: "removeListener", reqId, args }));
        },
        eventReceiver: (event) => {
          const map = listeners[event.eventName];
          if (!map) return;
          for (const fn of map.keys()) fn(event.result);
        },
        responseReceiver: (response) => {
          if (!requests[response.reqId]) return;
          if (response.error) {
            requests[response.reqId].reject(new Error(response.error.message));
            return;
          }
          requests[response.reqId].resolve(response.result);
        },
      };
    })();
    true;
`

const currentTransaction: any = {}

export default function FullScreen() {
  const router = useRouter();
  const { gameURL, webviewURI } = useLocalSearchParams()

  const webViewRef = useRef<WebView>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const progressAnim = useRef(new Animated.Value(0)).current
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { setAddress } = useContext(LoginContext)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const [movementMode, setMovementMode] = useState<'arrows' | 'tilt'>('arrows')

  const injectJS = `
    document.body.style.overflow = 'hidden';
    rivemuUploadCartridge("${gameURL}")
      .then(() => {
        resizeCanvas();
      });
    true;
  `

  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
  }

  useEffect(() => {
    const initialize = async () => {
      await changeOrientation()

      const storedMode = await SecureStore.getItemAsync('movementMode')
      setMovementMode(storedMode === 'tilt' ? 'tilt' : 'arrows')

      if (webViewRef.current && Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('hidden')
      }
    }

    initialize()
  }, [gameURL])

  const onLoadProgress = ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
    setProgress(nativeEvent.progress)
    Animated.timing(progressAnim, {
      toValue: nativeEvent.progress,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const ProgressBar = () =>
    progress !== 1 ? (
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
    ) : null

  const onMovementModeChange = (url: string) => {
    let aux = (webviewURI as string).split('/');
    aux.pop();
    url = `${aux.join('/')}/${url}`;
    console.log('onMovementModeChange', url)
    if (webViewRef.current) {
      const settingsScript = `
        window.location.href = ${JSON.stringify(url)};
        true;
      `
      webViewRef.current.injectJavaScript(settingsScript)
    }
  }

  const handleApplySettings = async (settings: Settings) => {
    if (webViewRef.current) {
      const leftRight = settings.deviceOrientation.leftRight;
      const LR = 30;
      const lr = (1 - (leftRight / 200)) * LR;
      const left = -lr;
      const right = lr;
      const upDown = settings.deviceOrientation.upDown;
      const ud = (1 - (upDown / 200)) * LR;
      const upDownAngle = -settings.deviceOrientation.upDownAngle;
      const up = upDownAngle + ud;
      const down = upDownAngle - ud;
      console.log({ up, down, upDown, upDownAngle })
      const settingsScript = `
        window.__deviceOrientation = {
          enabled: true,
          right: ${right},
          left: ${left},
          up: ${up},
          down: ${down},
        };
        true;
      `
      webViewRef.current.injectJavaScript(settingsScript)
    }
  }

  const cancelTransaction = async () => {
    setModalVisible(false)
    const response = {
      reqId: currentTransaction.request.reqId,
      error: {
        message: `The user canceled the transaction`,
      },
    }
    const eventScript = `
      window.ethereum.responseReceiver(${JSON.stringify(response)});
      true; // To ensure execution is finished
    `
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(eventScript)
    }
  }
  const handleTransaction = async () => {
    setModalVisible(false)
    const client = walletService.getCurrentWallet()
    if (!client) {
      // TODO: open the login screen
      console.log('TODO: open the login screen.')
      return
    }
    try {
      console.log('Sending transaction...')
      const txHash = await client.sendTransaction(currentTransaction.params)
      console.log('Transaction Hash:', txHash)
      const result = txHash
      console.log('result', result)
      const response = {
        reqId: currentTransaction.request.reqId,
        result,
      }
      const eventScript = `
        window.ethereum.responseReceiver(${JSON.stringify(response)});
        true; // To ensure execution is finished
      `
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(eventScript)
      }
    } catch (e) {
      console.error(`Error sending transaction`, e);
      if (e instanceof Error) {
        const response = {
          reqId: currentTransaction.request.reqId,
          result: {
            error: {
              message: e.message,
            }
          },
        };
        const eventScript = `
          window.ethereum.responseReceiver(${JSON.stringify(response)});
          true; // To ensure execution is finished
        `
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(eventScript)
        }
      }
    }
  }

  const handleMessage = async (event: WebViewMessageEvent) => {
    const client = walletService.getCurrentWallet()
    if (!client) {
      setAddress('')
      return
    }
    const message = event.nativeEvent.data // Get message from WebView
    if (message === 'openSettings') {
      setIsSettingsModalOpen(true)
      return
    }
    // Alert.alert("Message from WebView", message);
    if (webViewRef.current) {
      const request = JSON.parse(message)
      console.log('Raw request', request)
      if (request.method === 'request') {
        try {
          console.log(request)
          let result
          if (request.args.method === 'eth_requestAccounts' || request.args.method === 'eth_accounts') {
            result = [client.account?.address]
          } else if (request.args.method === 'eth_sendTransaction') {
            const params = request.args.params[0]
            currentTransaction.params = {
              ...params,
              account: client.account!,
              gasLimit: params.gas,
              gas: undefined,
            }
            currentTransaction.request = request
            console.log('transactionParams', currentTransaction)
            setModalVisible(true)
            return
          } else {
            result = await client.request(request.args)
          }
          console.log('result', result)
          const response = {
            reqId: request.reqId,
            result,
          }
          const eventScript = `
            window.ethereum.responseReceiver(${JSON.stringify(response)});
            true; // To ensure execution is finished
          `
          webViewRef.current.injectJavaScript(eventScript)
        } catch (e) {
          console.error(e)
        }
      } else if (request.method === 'on' && request.eventName === 'accountsChanged') {
        console.log('Register listener', request)
        const result = [client.account?.address]
        const response = {
          eventName: request.eventName,
          result,
        }
        const eventScript = `
          window.ethereum.eventReceiver(${JSON.stringify(response)});
          true; // To ensure execution is finished
        `
        webViewRef.current.injectJavaScript(eventScript)
      }
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Game', headerShown: false }} />

      <SettingsModal
        visible={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSettingsChange={handleApplySettings}
        onMovementModeChange={onMovementModeChange}
      />

      <StatusBar hidden />
      <GestureHandlerRootView>
        <ThemedView style={styles.container}>
          <ProgressBar />
          <WebView
            ref={webViewRef}
            source={{
              uri: (webviewURI as string) || DEFAULT_GAME_PAGE,
            }}
            style={styles.webview}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onLoadProgress={onLoadProgress}
            javaScriptEnabled
            domStorageEnabled
            bounces={false}
            overScrollMode="never"
            onError={({ nativeEvent }) => {
              console.warn('WebView error: ', nativeEvent)
            }}
            injectedJavaScriptBeforeContentLoaded={injectedJS}
            injectedJavaScript={injectJS}
            onMessage={handleMessage}
            webviewDebuggingEnabled
          />
          {isLoading && <ActivityIndicator style={styles.loader} size="large" color={colors.tint} />}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
            supportedOrientations={['portrait', 'landscape-right']} // works=true
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
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
})
