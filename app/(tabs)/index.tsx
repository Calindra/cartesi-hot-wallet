import { StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import ParallaxScrollViewWithWallet from '@/components/ParallaxScrollViewWithWallet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export default function Home() {
  const pathname = usePathname();
  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };
  useEffect(() => {
    if (pathname === "/") {
      changeOrientation();
    }
  }, [pathname])
  return (
    <ParallaxScrollViewWithWallet
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <Link href={{
        pathname: "/fullscreen",
        params: {
          gameURL: "https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs"
        }
      }}><ThemedText>Gamepad test</ThemedText></Link>
      <Link href={{
        // pathname: "/(tabs)/webview",
        pathname: "/fullscreen",
        params: {
          gameURL: "https://mainnet-v5.rives.io/data/cartridges/721f735bbca3"
        }
      }}><ThemedText>Free Doom</ThemedText></Link>
      <Link href={{
        pathname: "/(tabs)/webview",
        params: {
          gameURL: "https://mainnet-v5.rives.io/data/cartridges/40b0cb5ee306"
        }
      }}><ThemedText>Rives Raid</ThemedText></Link>
      <Link href={{
        pathname: "/(tabs)/webview",
        params: {
          gameURL: "https://mainnet-v5.rives.io/data/cartridges/a612d46cd43f"
        }
      }}><ThemedText>Slalom</ThemedText></Link>

      <Link href={{
        pathname: "/(tabs)/webview",
        params: {
          gameURL: "https://mainnet-v5.rives.io/data/cartridges/bba40250eaeb"
        }
      }}><ThemedText>Pakboy</ThemedText></Link>
    </ParallaxScrollViewWithWallet>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
