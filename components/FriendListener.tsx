import { createContext, useEffect, useRef, useState, useContext } from 'react'
import * as Location from "expo-location";
import { SettingsContext } from './SettingsContext';

const URL = 'http://172.28.57.247:5069'

export interface Friend {
    name: string
    distance: number
    distanceBetween: number
    withinDistance: boolean
    profileImageURL: string
}

export interface FriendContextProps {
    friends: Friend[]   
}

export const FriendContext = createContext<FriendContextProps>({
    friends: []
})

// export function useFriendLocationFinder(): Friend[]{
//     const [friends, setFriends] = useState<Friend[]>([]);
//     const [locationGranted, setLocationGranted] = useState<boolean>(false);
//     const [location, setLocation] = useState<Location.LocationObject | null>(null);
//     const intervalRef = useRef<NodeJS.Timeout | null>(null);

//     const settings = useContext(SettingsContext);


//     useEffect(() => {
//         async function getLocationPermissions() {
//             console.log("here")
//             // const { status } = await Location.requestBackgroundPermissionsAsync();
//             // setLocationGranted(status === "granted");
//             // const location = await Location.getCurrentPositionAsync({});
//             const location: Location.LocationObject = {
//                 coords: {
//                     latitude: 40.7128,  // NYC Latitude
//                     longitude: -74.0060, // NYC Longitude
//                     altitude: 10,        // Approximate altitude (in meters)
//                     accuracy: 5,         // Accuracy in meters
//                     altitudeAccuracy: 5,
//                     heading: 0,          // No movement
//                     speed: 0,            // No movement
//                 },
//                 timestamp: Date.now(), // Current timestamp
//             };
            
//             setLocation(location);
//             console.log("set location")
    
//             intervalRef.current = setInterval(async () => {
//                 const location = await Location.getCurrentPositionAsync({});
//                 setLocation(location);

//                 console.log('sending location', location)

//                 fetch(URL + '/location', 
//                     {
//                         method: 'POST',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify({
//                             username: settings.username,
//                             lat: location.coords.latitude,
//                             lon: location.coords.longitude
//                         })
//                     }
//                 );

//                 console.log('FRIENDS:', settings.friends, settings.username)

//                 for (let friend of settings.friends){
//                     console.log('calling friend info', friend)
//                     fetch(URL + '/friend_info', {
//                         method: 'POST',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify({
//                             username: settings.username,
//                             friend_username: friend
//                         })
//                     }).then(resp => {return resp.json()}).then((json: any) => {
//                         console.log('FRIEND_INFO', json);
//                         if (json.message == "Friend not found") return;

//                         setFriends((fs) => {
//                             let ffs: Friend[] = []
//                             for (let f of fs){
//                                 if (f.name != friend) ffs.push(f);
//                                 else {
//                                     ffs.push({
//                                         name: json.friend_username,
//                                         distance: json.distance,
//                                         withinDistance: json.is_within,
//                                         profileImageURL: json.profile_img
//                                     })
//                                 }
//                             }
//                             return ffs
//                         })

//                     });
//                 }

                
//             }, 5000);
    
//         }

//         getLocationPermissions()

//         console.log("got locarion permissions")

//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//                 intervalRef.current = null;
//             }
//         }
//     }, [])

//     return friends
// }

export function useFriendLocationFinder(): Friend[] {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationGranted, setLocationGranted] = useState<boolean>(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef2 = useRef<NodeJS.Timeout | null>(null);
    const settings = useContext(SettingsContext);

    useEffect(() => {

        async function getLocationPermissions() {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            setLocationGranted(status === "granted");
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            intervalRef2.current = setInterval(async () => {
                if (!locationGranted){
                    console.log('NEW YORK')
                    const location: Location.LocationObject = {
                        coords: {
                            latitude: 40.7128,  // NYC Latitude
                            longitude: -74.0060, // NYC Longitude
                            altitude: 10,        // Approximate altitude (in meters)
                            accuracy: 5,         // Accuracy in meters
                            altitudeAccuracy: 5,
                            heading: 0,          // No movement
                            speed: 0,            // No movement
                        },
                        timestamp: Date.now(), // Current timestamp
                    };
                    setLocation(location)
                }
                else{
                    console.log('LOCATION GRANTED')
                    const location = await Location.getCurrentPositionAsync({});
                    setLocation(location);
                }
            }, 5000);

        }
        getLocationPermissions();


        (async () => {  // ✅ Use IIFE inside useEffect

            // setLocation(location);
            console.log("set location");

            //Ensure interval starts
            intervalRef.current = setInterval(async () => {
                console.log("Fetching new location...");
                // const newLocation = await Location.getCurrentPositionAsync({});
                const newLocation: Location.LocationObject = {
                    coords: {
                        latitude: 40.7128,
                        longitude: -74.0060,
                        altitude: 10,
                        accuracy: 5,
                        altitudeAccuracy: 5,
                        heading: 0,
                        speed: 0,
                    },
                    timestamp: Date.now(),
                };
                setLocation(newLocation);

                // console.log('sending location', newLocation);

                await fetch(URL + '/location', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        username: settings.username,
                        lat: newLocation.coords.latitude,
                        lon: newLocation.coords.longitude
                    })
                });

                console.log('FRIENDS:', settings.friends, settings.username);

                let updatedFriends = []

                for (let friend of settings.friends) {
                    console.log('calling friend info', friend);
                    let resp = await fetch(URL + '/friend_info', {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({
                            username: settings.username,
                            friend_username: friend
                        })
                    });
                    let json = await resp.json();


                    console.log('FRIEND_INFO', json.username, json.message);
                    if (json.message === "Friend not found") continue;

                    console.log(settings.username, 'FRIEND JSON:')

                    console.log("I guess we have friends", json.map((f: any) => f.username))
                    updatedFriends.push({
                        name: json.username,
                        distance: json.distance,
                        distanceBetween: json.distance_between,
                        withinDistance: json.is_within,
                        profileImageURL: json.profile_img
                    });
                    
                }
                setFriends(updatedFriends);
            }, 5000);
        })();

        console.log("got location permissions");

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (intervalRef2.current){
                clearInterval(intervalRef2.current)
                intervalRef2.current = null
            }
        };
    }, []); // ✅ Run only once on mount

    return friends;
}
