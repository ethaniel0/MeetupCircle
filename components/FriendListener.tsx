import { createContext, useEffect, useRef, useState, useContext } from 'react'
import * as Location from "expo-location";
import { SettingsContext } from './SettingsContext';

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

                fetch(URL + '/location', 
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            username: settings.username,
                            lat: location.coords.latitude,
                            lon: location.coords.longitude
                        })
                    }
                );

                for (let friend of settings.friends){
                    fetch(URL + '/friend_info', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: settings.username,
                            friend_username: friend
                        })
                    }).then(resp => resp.json()).then((json: any) => {
                        if (json.message == "Friend not found") return;

                        setFriends((fs) => {
                            let ffs: Friend[] = []
                            for (let f of fs){
                                if (f.name != friend) ffs.push(f);
                                else {
                                    ffs.push({
                                        name: json.username,
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
    }, [settings.username])

    return friends
}