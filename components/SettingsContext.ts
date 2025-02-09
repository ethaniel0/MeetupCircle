import { createContext, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const URL = 'http://10.197.185.73:5069'


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
}

export const SettingsContext = createContext<SettingsContextProps>({
    username: '',
    profileImage: '',
    friends:  [],
    requestNewUsername: (name: string, prof_pic: string) => {}
})

export function useSettings(): SettingsContextProps{
    const [username, setUsername] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [friends, setFriends] = useState<string[]>([]);

   
    async function requestNewUsername(new_username: string, new_profile_picture: string){
        let resp = await fetch(URL + '/enroll', {
            method: 'POST',
            body: JSON.stringify({
                username: new_username,
                profile_img: new_profile_picture
            })
        });
        let json = await resp.json();
        if ('profile_img' in json){
            setUsername(json.username);
            setProfileImage(json.profile_img)
            AsyncStorage.setItem('username', json.username)
        }        
    }

    useEffect(() => {
        async function getStorage(){
            try {
                const value = await AsyncStorage.getItem('username');
                if (value !== null){
                    setUsername(value);

                    let resp = await fetch(URL + '/user_info', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: value
                        })
                    });
                    let json = await resp.json();
                    if ('profile_img' in json){
                        setProfileImage(json.profile_img)
                    }
                    
                    resp = await fetch(URL + '/all_friends', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: value
                        })
                    });
                    json = await resp.json();
                    if ('friends' in json){
                        setFriends(json['friends'].map((f: any) => f.username))
                    }
                }
            } catch (error) {}
        }

        getStorage();
    }, [])

    return {username, friends, profileImage, requestNewUsername}

}