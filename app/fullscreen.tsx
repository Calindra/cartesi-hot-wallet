import React, { useRef, useState, useContext, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity, Animated, Modal, Text, Pressable, Platform, StatusBar, Dimensions } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { walletService } from '@/src/services/WalletService';
import LoginContext from '@/hooks/loginContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from "expo-navigation-bar";

const { height, width } = Dimensions.get("window");
const paddingBottom = 30;
const injectedJS = `
    window.innerHeight = ${Math.min(width, height) - paddingBottom};
    window.innerWidth = ${Math.max(width, height) + 60};
    console.log("=> width", ${width});
    console.log("=> height", ${height});
    window.__deviceOrientation = {
      enabled: true,
      right: 3,
      left: -3,
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
          } catch(e) {
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

const currentTransaction: any = {}

export default function FullScreen() {
  const { gameURL } = useLocalSearchParams();

  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { setAddress } = useContext(LoginContext);

  const injectJS = `
  document.body.style.overflow = 'hidden';
  rivemuUploadCartridge("${gameURL}" || "https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs");
  true; // To ensure execution is finished
  `

  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  };

  useEffect(() => {
    if (webViewRef.current) {
      const changeGameJS = `
        rivemuUploadCartridge("${gameURL}");
        true;
      `
      webViewRef.current.injectJavaScript(changeGameJS);
      changeOrientation();
      NavigationBar.setVisibilityAsync("hidden"); // Hides the nav bar
      // NavigationBar.setBehaviorAsync('');
    }
  }, [gameURL, webViewRef])

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

  const handleTransaction = async () => {
    setModalVisible(false)
    const client = walletService.getCurrentWallet()
    if (!client) {
      // TODO: open the login screen
      return
    }
    const txHash = await client.sendTransaction(currentTransaction.params)
    console.log('Transaction Hash:', txHash);
    const result = txHash;
    console.log('result', result)
    const response = {
      reqId: currentTransaction.request.reqId,
      result,
    }
    const eventScript = `
      window.ethereum.responseReceiver(${JSON.stringify(response)});
      true; // To ensure execution is finished
    `;
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(eventScript);
    }
  }

  const cancelTransaction = async () => {
    setModalVisible(false)
    const response = {
      reqId: currentTransaction.request.reqId,
      error: {
        message: `The user canceled the transaction`
      },
    }
    const eventScript = `
      window.ethereum.responseReceiver(${JSON.stringify(response)});
      true; // To ensure execution is finished
    `;
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(eventScript);
    }
  }

  const handleMessage = async (event: WebViewMessageEvent) => {
    const client = walletService.getCurrentWallet()
    if (!client) {
      // TODO: open the login screen
      console.log('No client!')
      setAddress('')
      return;
    }
    const message = event.nativeEvent.data; // Get message from WebView
    // Alert.alert("Message from WebView", message);
    if (webViewRef.current) {
      const request = JSON.parse(message);
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
            result = await client.request(request.args);
          }
          console.log('result', result)
          const response = {
            reqId: request.reqId,
            result,
          }
          const eventScript = `
            window.ethereum.responseReceiver(${JSON.stringify(response)});
            true; // To ensure execution is finished
          `;
          webViewRef.current.injectJavaScript(eventScript);
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
        `;
        webViewRef.current.injectJavaScript(eventScript);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Game", headerShown: false }} />
      <StatusBar hidden />
      <GestureHandlerRootView>
        <ThemedView style={styles.container}>
          <ProgressBar />
          <WebView
            ref={webViewRef}
            source={{
              // uri: 'https://dapp-coprocessor-frontend.vercel.app/',
              // uri: 'https://ipfs.io/ipfs/bafybeiaw6ei6hn6ntbqj55z2vg6h3nal4fytmytld55py6fupgtpd2jwg4/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeienj675xszfyjftik45ixba66mo5hy6bxp44fmamrrf6inbnhdoru/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeib6kwururikmw7o6ktopa7gk5hwtbw7clnqrfles6athxptukvml4/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeifyokmwtszcl3mubveqe7guc63h35a7xn2ygcifxw46wqfrhvaq24/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeigpd45klqkhxws3q33bhahfvkwnbmyltxtzbjjjzlnvsho4xc3f7i/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeicpd2hanzolpo2pywggkuv5frxikf4zl7lsqupfmml4trjnmjmly4/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeibldkyjrrw6wuaeiihwt5dez7g5mlxzrm7uip2o6wpxwfrquwgabe/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeifw7emfguwfcg7pabxjatcfs4ds6r45odz2wkbwpizsr2i26a76gu/gamepad.html'
              // uri: 'https://ipfs.io/ipfs/bafybeick7wjxbris3bzia624z6a3zzjhihpfpr6hepvahm4nw3tyw75lfa/gamepad.html'
              uri: 'https://ipfs.io/ipfs/bafybeidiiw6eoysstullgnvxd6odnq2tvvypkvjhsdmznbbp2azardlloi/landscape-fullscreen.html'
            }}
            style={styles.webview}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onLoadProgress={onLoadProgress}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            bounces={false}
            overScrollMode="never"
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            injectedJavaScriptBeforeContentLoaded={injectedJS}
            injectedJavaScript={injectJS}
            onMessage={handleMessage}
            webviewDebuggingEnabled={true}
          />
          {isLoading && (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={colors.tint}
            />
          )}
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
                <Text style={styles.modalTitle}>Confirm Transaction</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to send this transaction?
                </Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={cancelTransaction}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleTransaction}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </ThemedView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
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
