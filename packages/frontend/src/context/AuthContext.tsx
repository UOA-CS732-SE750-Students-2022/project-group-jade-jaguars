import {
  User,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase.config';
interface authContext {
  authToken: string;
  setAuthToken: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  authLoaded: boolean;
  setAuthLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  signedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: () => void;
  anonymousLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<authContext>({
  authToken: '',
  setAuthToken: () => '',
  userId: '',
  setUserId: () => '',
  authLoaded: false,
  setAuthLoaded: () => false,
  user: null,
  setUser: () => null,
  signedIn: false,
  login: () => {},
  anonymousLogin: () => {},
  logout: () => {},
});

// This context provider is wrapped around the whole project
// so when the authentication status changes the project re-renders
export const AuthProvider: React.FC<{}> = ({ children }) => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const provider = new GoogleAuthProvider();
  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ credential, token, user });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });
      });
  };

  const logout = () => {
    auth.signOut();
    console.log('logout');
  };

  const anonymousLogin = () => {
    signInAnonymously(auth).then((user) => {
      // * logs in and sets user in firebase
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const updateToken = async () => {
        const authToken = await user?.getIdToken();
        const userId = user?.uid;
        authToken ? authToken : '';
        userId ? userId : '';
        setUserId(userId!);
        setAuthToken(authToken!);
        setUser(user);
      };
      updateToken();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        userId,
        setUserId,
        authLoaded,
        setAuthLoaded,
        user,
        setUser,
        signedIn: !!user,
        login,
        anonymousLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for child components to get the auth object
export const useAuth = () => React.useContext(AuthContext);
