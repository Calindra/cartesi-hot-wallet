import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSegments } from 'expo-router';

export default function TabLayout() {

  const colorScheme = useColorScheme()
  const segments = useSegments()
  const currentPage = segments[segments.length - 1]

  const pagesToHideBar = ['createAccount', 'fullscreen']

  const hideTabBar = pagesToHideBar.includes(currentPage)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          display: hideTabBar ? 'none' : 'flex',
        },
      }}

    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="webview"
        options={{
          title: 'Rives',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="createAccount"
        options={{ href: null }} // or tabBarButton: () => null
      />*/}
      <Tabs.Screen
        name="(fullscreen)/createAccount"
        options={{ href: null }} // or tabBarButton: () => null
      />

    </Tabs>
  );
}
// import { Tabs, useSegments } from 'expo-router'


// import { HapticTab } from '@/components/HapticTab'
// import { IconSymbol } from '@/components/ui/IconSymbol'
// import TabBarBackground from '@/components/ui/TabBarBackground'
// import { Colors } from '@/constants/Colors'
// import { useColorScheme } from '@/hooks/useColorScheme'

// export default function TabLayout() {
//   const colorScheme = useColorScheme()
//   const segments = useSegments()
//   const currentPage = segments[segments.length - 1]

//   const pagesToHideBar = ['createAccount', 'fullscreen']

//   const hideTabBar = pagesToHideBar.includes(currentPage)

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: {
//           display: hideTabBar ? 'none' : 'flex',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Play',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Discover',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="webview"
//         options={{
//           title: 'Rives',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   )
// }
