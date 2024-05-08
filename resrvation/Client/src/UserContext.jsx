import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready,setReady] = useState(false);
    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:4000/profile') // Utilisez l'URL complète
                .then(({ data }) => {
                    setUser(data);
                    setReady(true);
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser,ready}}>
            {children}
        </UserContext.Provider>
    );
};
