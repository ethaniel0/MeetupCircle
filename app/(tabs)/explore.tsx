import { StyleSheet, Image, Platform, TextInput, Text, ScrollView, View, Button, Pressable } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useContext, useState } from 'react';
import { SettingsContext } from '@/components/SettingsContext';

export default function TabTwoScreen() {

  const ctx = useContext(SettingsContext);

  const [username, setUsername] = useState(ctx.username);
  const [img, setImg] = useState(ctx.profileImage)

  const [friendUsername, setFriendUsername] = useState('')
  const [friendDistance, setFriendDistance] = useState('100')

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image source={{
          uri: img
        }} 
        style={{width: '100%', height: '100%'}}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ScrollView style={{gap: 10}}>

        <View>
          <Text style={{color: 'gray', marginBottom: 1}}>Username</Text>
          <TextInput
              style={{
                borderColor: 'black',
                borderWidth: 2,
                padding: 6,
                borderRadius: 6
              }}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
            />
        </View>

        <View style={{marginTop: 10}}>
          <Text style={{color: 'gray', marginBottom: 1}}>Profile Image</Text>
          <TextInput
              style={{
                borderColor: 'black',
                borderWidth: 2,
                padding: 6,
                borderRadius: 6
              }}
              onChangeText={setImg}
              value={img}
              placeholder="Profile Image"
            />
        </View>

        {
          (ctx.username != username || ctx.profileImage != img) &&
          (<View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Pressable
                onPress={() => {
                  ctx.requestNewUsername(username, img)
                  console.log('req ', username, img)
                }}
                style={{padding: 10, backgroundColor: 'rgb(154, 170, 243)', marginTop: 10, width: '50%', borderRadius: 6}}
              >
                <Text style={{textAlign: 'center'}}>Save</Text>
            </Pressable>
          </View>)
        }

        <View style={{marginTop: 20, marginBottom: 50}}>
          <Text style={{color: 'gray', marginBottom: 10}}>Friends</Text>
          <View style={{gap: 10}}>
            {
              ctx.friends.map((f, i) => (
                <View key={i} style={styles.friendBox}>
                  <Text style={{width: '75%'}}>{f}</Text>
                  <Pressable
                    onPress={() => ctx.removeFriend(f)}
                    style={styles.removeButton}
                  >
                    <Text>Remove</Text>
                  </Pressable>
                </View>
              ))
            }

            <Pressable
              onPress={() => {
                ctx.addFriend(friendUsername, parseFloat(friendDistance))
              }}
              style={{backgroundColor: 'rgb(154, 170, 243)', padding: 10, borderRadius: 6}}
            >
              <Text style={{textAlign: 'center'}}>Add Friend</Text>
            </Pressable>

            <View>
              <Text style={{color: 'gray', marginBottom: 1}}>Friend Username</Text>
              <TextInput
                style={{
                  borderColor: 'black',
                  borderWidth: 2,
                  padding: 6,
                  borderRadius: 6
                }}
                onChangeText={setFriendUsername}
                value={friendUsername}
                placeholder="Friend Username"
              />
            </View>

            <View>
              <Text style={{color: 'gray', marginBottom: 1}}>Friend Distance Threshold (meters)</Text>
              <TextInput
                style={{
                  borderColor: 'black',
                  borderWidth: 2,
                  padding: 6,
                  borderRadius: 6
                }}
                onChangeText={setFriendDistance}
                value={friendDistance}
                placeholder="Friend Username"
                keyboardType="numeric"
              />
            </View>

          </View>

        </View>

      </ScrollView>
      
      
    </ParallaxScrollView>
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
  removeButton: {
    backgroundColor: 'rgb(239, 133, 133)', 
    padding: 5, 
    borderRadius: 6,
  },
  friendBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
