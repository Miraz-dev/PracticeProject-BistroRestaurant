// import React from 'react';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();


    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const setProfile = (resultUser, userInfoAsObject) => {
        setLoading(true);
        return updateProfile(resultUser, userInfoAsObject);
    }

    const updateUserProfile = (name, photo) => {
        // setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        })
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log("Current User: ", currentUser);
            if(currentUser){
                setUser(currentUser);
                
                // Get token and store client
                const userInfo = {email: currentUser.email};
                axiosPublic.post("/jwt", userInfo)
                    .then(res => {
                        if(res.data.token){
                            localStorage.setItem("access-token", res.data.token);
                            setLoading(false); //when token is recieved from database, then setLoading()
                        }
                    });
                
            }
            else{
                setUser(currentUser);
                // Todo: Remove Token
                localStorage.removeItem("access-token");
                setLoading(false);

            }
            console.log("User: ", user);
        });
        

        return () => {
            return unsubscribe();
        }

    }, [axiosPublic, user]);

    const authInfo = {
        user,
        loading,
        createUser,
        googleSignIn,
        logOut,
        setProfile,
        signInUser,
        updateUserProfile
    };
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export default AuthProvider;