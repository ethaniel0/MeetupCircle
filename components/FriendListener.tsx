import { createContext, useEffect, useRef, useState, useContext } from 'react'
import * as Location from "expo-location";
import { SettingsContext } from './SettingsContext';

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

export const FriendContext = createContext<FriendContextProps>({
    friends: []
})

export function useFriendLocationFinder(): Friend[]{
    const [friends, setFriends] = useState<Friend[]>([]);
    const [locationGranted, setLocationGranted] = useState<boolean>(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const settings = useContext(SettingsContext);


    useEffect(() => {
        async function getLocationPermissions() {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            setLocationGranted(status === "granted");
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
    
            intervalRef.current = setInterval(async () => {
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);

                console.log('sending location', location)

                fetch(URL + '/location', 
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: settings.username,
                            lat: location.coords.latitude,
                            lon: location.coords.longitude
                        })
                    }
                );

                console.log('FRIENDS:', settings.friends, settings.username)

                for (let friend of settings.friends){
                    console.log('calling friend info', friend)
                    fetch(URL + '/friend_info', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: settings.username,
                            friend_username: friend
                        })
                    }).then(resp => {return resp.json()}).then((json: any) => {
                        console.log('FRIEND_INFO', json);
                        if (json.message == "Friend not found") return;

                        setFriends((fs) => {
                            let ffs: Friend[] = []
                            for (let f of fs){
                                if (f.name != friend) ffs.push(f);
                                else {
                                    ffs.push({
                                        name: json.friend_username,
                                        distance: json.distance,
                                        withinDistance: json.is_within,
                                        profileImageURL: json.profile_img
                                    })
                                }
                            }
                            return ffs
                        })

                    });
                }

                
            }, 5000);
    
        }

        getLocationPermissions()

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [settings.friends])

    return friends
}