import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import { doc, getDoc, } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { auth, db } from '../config/Firebase';

const DataContext = createContext();

const errorMap = {
  'Firebase: Error (auth/invalid-credential).': 'Email and password combination is not found',
  'Firebase: Error (auth/email-already-in-use).': 'Email is already in use',
}

const DataProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    const getUserData = async () => {
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if(userDoc.exists()) {
        setUserData(userDoc.data());
      }
      else {
        setNeedsSetup(true);
      }
    }

    if(user) {
      getUserData().then((data) => {
        setLoading(false);
      })
    }
    else {
      setLoading(false);
    }
    
  }, [user])

  const handleSignIn = async (email, password, setError) => {

    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }

    if(!email.endsWith('@wisc.edu')) {
      setError('Please use a valid wisc email');
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (error) {
      setError(errorMap[error.message] || error.message);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };
  
  const handleRegister = async (email, password, setError) => {
    
    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }

    if(!email.endsWith('@wisc.edu')) {
      setError('Please use a valid wisc email');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      
      // Signed in
      const user = userCredential.user;    
  
      setUser(user);
      setIsRegistering(false);
    } catch (error) {
      console.error('Error during registration:', error);
      setError(errorMap[error.message] || error.message);
    }
  };  

  const handleSetup = async(classArray, setError) => {
  
    if (!classArray.length) {
      alert('Please add at least one class');
      return;
    }

    const docRef = doc(db, 'users', user.uid);

    await setDoc(docRef, {
      email: user.email,
      uid: user.uid,
      classes: classArray,
    });

    setNeedsSetup(false);
  }

  const value = {
    user,
    userData,
    handleSignIn,
    handleSignOut,
    handleRegister,
    isRegistering,
    handleSetup,
    setIsRegistering,
    loading,
    authLoading,
    needsSetup
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within an DataContext');
  }
  return context;
};

export { DataProvider, useData };