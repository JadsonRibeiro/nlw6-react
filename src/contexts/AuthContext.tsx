import { createContext, ReactNode, useEffect, useState } from "react";

import { auth, firebase } from "../services/firebase";

type User = {
    uid: string;
    name: string;
    avatar: string;
}

type AuthContextProps = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                const { displayName, photoURL, uid } = user;

                if(!displayName || !photoURL) {
                    throw new Error('Missing information from Google');
                }

                setUser({
                    uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        })
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const response = await auth.signInWithPopup(provider);

        if(response.user) {
            const { displayName, photoURL, uid } = response.user;

            if(!displayName || !photoURL) {
                throw new Error('Missing information from Google');
            }

            setUser({
                uid,
                name: displayName,
                avatar: photoURL
            });
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}