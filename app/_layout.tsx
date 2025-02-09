import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FriendContext, useFriendLocationFinder } from '@/components/FriendListener';
import { SettingsContext } from '@/components/SettingsContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const friends = useFriendLocationFinder();
  const settingsContext = useContext(SettingsContext);
  

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{
      username: "",
      friends: ['Bob', 'Jim', 'Jerry', 'Jeffery', 'Jackson', 'Jack', 'Justin', 'James', 'Jud']
    }}>
      <FriendContext.Provider value={{friends: [{
        name: 'Bob',
        distance: 0.21,
        withinDistance: true,
        profileImageURL: 'https://img.apmcdn.org/768cb350c59023919f564341090e3eea4970388c/square/72dd92-20180309-rick-astley.jpg'
      }, {
        name: 'Jim',
        distance: 1.40,
        withinDistance: true,
        profileImageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNZ3UWO1L3smA8zPsQX76lXN2l1UX9qFKmYQ&s'
      }, {
        name: 'Jerry',
        distance: 20.67,
        withinDistance: false,
        profileImageURL: 'https://static.wikia.nocookie.net/myat40/images/5/56/Rick_Astley.jpg/revision/latest/thumbnail/width/360/height/450?cb=20120721170426'
      }, {
        name: 'Jeffrey',
        distance: 100.53,
        withinDistance: false,
        profileImageURL: 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2021/02/Rickrolling-in-4K-920x595.jpg'
      }, {
        name: 'Jackson',
        distance: 10.61,
        withinDistance: false,
        profileImageURL: 'https://img.songfacts.com/blog/1250.jpg'
      }, {
        name: 'Jack',
        distance: 0.13,
        withinDistance: true,
        profileImageURL: 'https://www.nme.com/wp-content/uploads/2021/07/RickAstley2021.jpg'
      }, {
        name: 'Justin',
        distance: 30.59,
        withinDistance: false,
        profileImageURL: 'https://lastfm.freetls.fastly.net/i/u/avatar170s/92c372883f05137bb7c6e9ec49afe403'
      }, {
        name: 'James',
        distance: 10.53,
        withinDistance: true,
        profileImageURL: 'https://i.pinimg.com/736x/24/a4/83/24a4832c7c9e40bb404a93dd1a4b43c3.jpg'
      }, {
        name: 'Jud',
        distance: 2000.32,
        withinDistance: false,
        profileImageURL: 'https://i.redd.it/tospo6k2u9l81.png'
      }]}}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </FriendContext.Provider>
    </SettingsContext.Provider>
  );
}
