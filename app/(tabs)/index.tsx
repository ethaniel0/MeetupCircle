import { Image, StyleSheet, Platform, ScrollView} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FriendContext, useFriendLocationFinder } from '@/components/FriendListener';
import { useContext } from 'react';
import { View, Text } from 'react-native';
import { useEffect } from 'react';

export default function HomeScreen() {

  // const friends = useFriendLocationFinder();
  const friends = [
    {
    name: 'Rick',
    distance: 12.42,
    withinDistance: true,
    profileImageURL: 'https://external-preview.redd.it/rick-astley-i-didnt-want-fame-i-wanted-enough-money-to-v0-WHDThApWRRRewyJcWmWaUl6MEcWTVjEhxWAh2Swezck.jpg?width=1080&crop=smart&auto=webp&s=9c117275efdc83bda0ba7390e1228f60239e9b5d'
    },
    {
      name: 'Jill',
      distance: 1624.31,
      withinDistance: true,
      profileImageURL: 'https://cdn.britannica.com/37/75637-050-B425E8F1/Killer-whale.jpg'
      },
      {
      name: 'June',
      distance: 130724.61,
      withinDistance: false,
      profileImageURL: 'data:image/png;base64,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'
      },
      {
        name: 'Hope',
        distance: 50.42,
        withinDistance: true,
        profileImageURL: 'https://plus.unsplash.com/premium_photo-1690579805307-7ec030c75543?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29uJTIwaWNvbnxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
        name: 'Alex',
        distance: 24643.42,
        withinDistance: false,
        profileImageURL: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg'
        }
        
  ]

  
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

