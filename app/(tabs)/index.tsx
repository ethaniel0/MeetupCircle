import { Image, StyleSheet, Platform, ScrollView} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FriendContext, useFriendLocationFinder } from '@/components/FriendListener';
import { useContext } from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {

  const friends = useFriendLocationFinder();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/friend-tracker-header.png')}
          style={styles.titleImage}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Friends</ThemedText>
      </ThemedView>

      <View style={styles.backgroundContainer} />
      <ScrollView style={styles.friendsList}>
        {friends.sort((a, b) => a.distance - b.distance).map((f, i) => (
            <View key={i} style={styles.friendBox}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: f.profileImageURL }}
                  style={styles.profileImage}
                />
              </View>
          
              <View style={styles.textContainer}>
                <Text style={styles.friendName}>{f.name}</Text>
                <Text style={[styles.friendDistance, { color: f.withinDistance ? 'green' : 'black' }]}>
                  {f.distance}m
                </Text>
              </View>
            </View>
        ))}
      </ScrollView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleImage: {
    overflow: 'hidden',     
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(175, 255, 180)',
    backgroundRepeat: 'repeat',
    zIndex: -1,
  },
  friendsList: {
    padding: 10, 
  },
  friendBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', 
    padding: 20, 
    marginBottom: 15, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 5, 
    alignItems: 'center', 
  },
  imageContainer: {
    width: 50,
    height: 50, 
    borderRadius: 25, 
    backgroundColor: 'blue',
    overflow: 'hidden', 
    marginRight: 15, 
  },
  profileImage: {
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  friendName: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333',
  },
  friendDistance: {
    fontSize: 18, 
    marginTop: 5, 
    color: '#000', 
  }  
});

