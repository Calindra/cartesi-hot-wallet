import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity, RefreshControl, Animated, Alert } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createPublicClient, createWalletClient, http, parseEther, PrivateKeyAccount, toBytes } from "viem";
import { holesky } from "viem/chains";
import { HDKey } from '@scure/bip32';
import { keccak256, hexToBytes, bytesToHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// const seedHex = 'your_hex_seed_here'; // Replace with a 64-byte hex seed
const seedHex = 'another_super_secret_here'; // Replace with a 64-byte hex seed

// Convert seed to bytes
const seedBytes = toBytes(seedHex);

// Apply Keccak-256 hash to the seed
const hashedSeed = keccak256(seedBytes);
console.log('Keccak-256 Hashed Seed:', hashedSeed);

// Convert hashed seed to bytes
const hashedSeedBytes = hexToBytes(hashedSeed);

// Use hashed seed to generate an HD wallet
const hdWallet = HDKey.fromMasterSeed(hashedSeedBytes);
const child = hdWallet.derive("m/44'/60'/0'/0/0"); // Standard Ethereum derivation path

// Convert the private key to hex
const privateKey = child.privateKey ? bytesToHex(child.privateKey) : null;

let account: PrivateKeyAccount | undefined
if (privateKey) {
  console.log('Derived Private Key:', privateKey);
  account = privateKeyToAccount(privateKey);
}

const client = createWalletClient({
  account,
  chain: holesky,
  transport: http(),
});

const injectedJS = `
    (() => {
      const listeners = {};
      const requests = {};
      window.ethereum = {
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
          alert("Event received in WebView:" + JSON.stringify(event));
        },
        responseReceiver: (response) => {
          console.log("response", response)
          if (!response.error) {
            if (!requests[response.reqId]) {
              console.log("ReqID not found", response.reqId, requests)
              return
            }
            requests[response.reqId].resolve(response.result)
          }
        },
      }
    })();
`;

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setRefreshing(false);
  }, []);

  const onLoadProgress = ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
    setProgress(nativeEvent.progress);
    Animated.timing(progressAnim, {
      toValue: nativeEvent.progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const onNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
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

  const NavigationBar = () => (
    <View style={[styles.navigationBar, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        onPress={() => webViewRef.current?.goBack()}
        disabled={!canGoBack}
        style={styles.navButton}
      >
        <IconSymbol
          name="chevron.left"
          size={24}
          color={canGoBack ? colors.tint : colors.tabIconDefault}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => webViewRef.current?.goForward()}
        disabled={!canGoForward}
        style={styles.navButton}
      >
        <IconSymbol
          name="chevron.right"
          size={24}
          color={canGoForward ? colors.tint : colors.tabIconDefault}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => webViewRef.current?.reload()}
        style={styles.navButton}
      >
        <IconSymbol
          name="arrow.clockwise"
          size={24}
          color={colors.tint}
        />
      </TouchableOpacity>
    </View>
  );

  const handleMessage = async (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data; // Get message from WebView
    // Alert.alert("Message from WebView", message);
    if (webViewRef.current) {
      const request = JSON.parse(message);
      if (request.method === 'request') {
        try {
          console.log(request)
          let result
          if (request.args.method === 'eth_requestAccounts' || request.args.method === 'eth_accounts') {
            result = [client.account?.address]
          } else if (request.args.method === 'eth_sendTransaction') {
            const params = request.args.params[0]
            const transactionParams = {
              ...params,
              account: client.account!,
              gasLimit: params.gas,
              gas: undefined,
            }
            console.log('transactionParams', transactionParams)
            const txHash = await client.sendTransaction(transactionParams)
            console.log('Transaction Hash:', txHash);
            result = txHash;
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
      }
      // const eventScript = `
      // window.ethereum.eventReceiver({
      //   detail: {
      //     ok: 1,
      //   },
      // });
      // true; // To ensure execution is finished
      // `;
      // webViewRef.current.injectJavaScript(eventScript);

    }
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.container}>
        <ProgressBar />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://dapp-coprocessor-frontend.vercel.app/' }}
            style={styles.webview}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onLoadProgress={onLoadProgress}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={onNavigationStateChange}
            bounces={false}
            overScrollMode="never"
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
            injectedJavaScriptBeforeContentLoaded={injectedJS}
            onMessage={handleMessage}
            webviewDebuggingEnabled={true}
          />
        </ScrollView>

        {isLoading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.tint}
          />
        )}

        {/* <NavigationBar /> */}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    padding: 10,
  },
  progressBar: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
});
