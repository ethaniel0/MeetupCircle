import { createContext, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const URL = 'http://172.28.57.247:5069'


export interface Friend {
    name: string
    distance: number
    withinDistance: boolean
    profileImageURL: string
}

export interface FriendContextProps {
    friends: Friend[]   
}


export interface SettingsContextProps {
    username: string
    profileImage: string
    friends: string[]
    requestNewUsername: (name: string, prof_pic: string) => void
    addFriend: (name: string, distance: number) => void
    removeFriend: (name: string) => void
}

export const SettingsContext = createContext<SettingsContextProps>({
    username: '',
    profileImage: '',
    friends:  [],
    requestNewUsername: (name: string, prof_pic: string) => {},
    addFriend: (name: string, distance: number) => {},
    removeFriend: (name: string) => {}
})

export function useSettings(): SettingsContextProps{
    const [username, setUsername] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [friends, setFriends] = useState<string[]>([]);

    async function requestNewUsername(new_username: string, new_profile_picture: string){
        let resp = await fetch(URL + '/enroll', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: new_username,
                profile_img: new_profile_picture
            })
        });
        let json = await resp.json();
        console.log("maybe here", json)
        // if ('profile_img' in json){
            console.log("maybe here2")
            setUsername(json.username);
            setProfileImage(json.profile_img || "")
            AsyncStorage.setItem('username', json.username)
        // }        
    }

    async function addFriend(friend: string, distance: number){
        if (friends.includes(friend)) return;
        let resp = await fetch(URL + '/friend', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                friend_username: friend,
                distance
            })
        });
        let json = await resp.json();
        if (json.message == 'Friend added'){
            setFriends(f => [...f, json.friend_username])
        }
    }

    async function removeFriend(friend: string){
        if (!friends.includes(friend)) return;

        let resp = await fetch(URL + '/unfriend', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                friend_username: friend
            })
        });
        setFriends(friends.filter(f => f != friend));
    }

    useEffect(() => {

        const areSetsEqual = (setA: Set<string>, setB: Set<string>) => setA.size === setB.size && [...setA].every(value => setB.has(value))

        async function loadFriends(){
            console.log('loading friends for A')
            let resp = await fetch(URL + '/all_friends', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            });
            let json = await resp.json();
            if ('friends' in json){
                let friendlist = json['friends'].map((f: any) => f.username);
                let friendSet: Set<string> = new Set<string>(friendlist);
                let existingFriendSet = new Set<string>(friends);
                if (!areSetsEqual(friendSet, existingFriendSet)){
                    setFriends(friendlist)
                    console.log('SETTING FRIENDS', username, friendlist, existingFriendSet)
                }
            }
        }

        async function getStorage(){
            try {
                const value = await AsyncStorage.getItem('username');
                if (value !== null){
                    setUsername(value);

                    let resp = await fetch(URL + '/user_info', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: value
                        })
                    });
                    let json = await resp.json();
                    if ('profile_img' in json){
                        setProfileImage(json.profile_img)
                    }
                    else {
                        setUsername("")
                        setFriends([])
                    }
                    
                    resp = await fetch(URL + '/all_friends', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: value
                        })
                    });
                    json = await resp.json();
                    if ('friends' in json){
                        let friendlist = json['friends'].map((f: any) => f.username);
                        let friendSet = new Set(friendlist);
                        let existingFriendSet = new Set(friends);
                        if (friendSet.difference(existingFriendSet).size == 0){
                            setFriends(json['friends'].map((f: any) => f.username))
                        }
                    }
                }
            } catch (error) {}
        }
        getStorage();


        let interval = setInterval(loadFriends, 5000);

        return () => clearInterval(interval);
    }, [])

    return {username, friends, profileImage, requestNewUsername, addFriend, removeFriend}

}