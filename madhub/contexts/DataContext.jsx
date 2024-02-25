import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import { collection, doc, getDoc, setDoc, addDoc, updateDoc, query, onSnapshot, where, arrayUnion} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from '../config/Firebase';
import * as Location from 'expo-location';

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
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });

    return () => {
      if(unsubscribe) {
        unsubscribe();
      }
    }
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
    };
  
    let unsubscribeUserData;
    let unsubscribeGroupData;
  
    const getGroupData = async () => {
      const groupDocs = collection(db, "groups");
      const q = query(groupDocs, where("members", "array-contains", user.uid));
      unsubscribeGroupData = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No data available");
          setCurrentGroup(null);
          alert('This Study Group has ended!');
        } else {
          querySnapshot.forEach((doc) => {
            if (doc.data().ended && currentGroup) {
              setCurrentGroup(null);
              alert('This Study Group has ended!');
            }
            if (!doc.data().ended) {
              setCurrentGroup({id: doc.id, ...doc.data()});
            }
          });
        }
        setLoading(false);
      });
    };
  
    if(user) {
      getUserData();
      getGroupData();
    }
    else {
      setLoading(false);
    }
  
    return () => {
      if(unsubscribeUserData) {
        unsubscribeUserData();
      }
      if(unsubscribeGroupData) {
        unsubscribeGroupData();
      }
    };
  }, [user]);
  

  const handleSignIn = async (email, password, setError) => {

    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }

    // if(!email.endsWith('@wisc.edu')) {
    //   setError('Please use a valid wisc email');
    //   return;
    // }
  
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (error) {
      setError(errorMap[error.message] || error.message);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };
  
  const handleRegister = async (email, password, setError) => {
    
    if (!email.trim() || !password.trim()) {
      setError('Email or password is empty');
      return;
    }

    // if(!email.endsWith('@wisc.edu')) {
    //   setError('Please use a valid wisc email');
    //   return;
    // }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
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

    setUserData({email: user.email, uid: user.uid, classes: classArray});

    setNeedsSetup(false);
  }

  const handleCreateGroup = async(navigation, selectedClass, descriptionInput, whereInput, setError) => {
    // Check for errors
    if(selectedClass === '') {
      setError('Please select a class');
      return;
    }
    if(whereInput === '') {
      setError('Please enter a location');
      return;
    }
    if(descriptionInput === '') {
      setError('Please enter a description');
      return;
    }

    if (currentGroup) {
      setError('You are already in a study group!');
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        console.log('Permission to access location was denied');
        alert('Permission to access location was denied');
        return;
      }

    let location = await Location.getCurrentPositionAsync({});
        
    // Create the group
    const docRef = await addDoc(collection(db, "groups"), {
      className: selectedClass,
      description: descriptionInput,
      whereInput: whereInput,
      members: [user.uid],
      notesAdded: [],
      ended : false,
      location: location,
      creator: user.uid
    });
    navigation.pop();
    alert('Group created successfully');
    return docRef.id
  };

  const handleEndGroup = async(navigation, emails, className) => {

    // Send the emails
    await fetch('https://7187aed6d39da8.lhr.life/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupId: currentGroup.id,
        emails: emails,
        className: className
      })

    })

    // End the group
    await updateDoc(doc(db, "groups", currentGroup.id), {
      ended: true
    });

    navigation.pop();
    setCurrentGroup(null);
    alert('Group ended successfully');

  }

  const handleUploadPhoto = async(uri) => {
    // Upload the photo
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `notes/${currentGroup.id}/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        console.log(error);
      }, 
      async() => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          // Save the downloadURL to the group
          await updateDoc(doc(db, "groups", currentGroup.id), {
            notesAdded: arrayUnion(user.email),
          })
        });
      }
    );
  }

  const handleJoinGroup = async(groupId, navigation) => {
      
    if (currentGroup) {
      alert('You are already in a study group!');
      return;
    }

    // Join the group
    await updateDoc(doc(db, "groups", groupId), {
      members: arrayUnion(user.uid)
    });
    alert('Group joined successfully');
    navigation.navigate('Group', {group: groupId})
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
    handleCreateGroup,
    loading,
    authLoading,
    needsSetup,
    setCurrentGroup,
    currentGroup,
    handleEndGroup,
    handleUploadPhoto,
    handleJoinGroup
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