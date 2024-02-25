import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';
import MapView, { Marker } from 'react-native-maps';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/Firebase';

const JoinStudyGroups = ({ navigation }) => {
  const { userData, handleJoinGroup } = useData();
  const [studyGroups, setStudyGroups] = useState([]);
  const [choosenGroup, setChosenGroup] = useState(null);

  useEffect(() => {
    const fetchStudyGroups = async () => {
      if (!userData.classes || userData.classes.length === 0) {
        // No classes in userData, do nothing
        return;
      }
  
      const toSearchAcrossArray = userData.classes.map(
        (className) => className.className
      );
      console.log(toSearchAcrossArray);

      const studyGroupsCollection = collection(db, 'groups');
      const q = query(
        studyGroupsCollection,
        where('className', 'in', toSearchAcrossArray),
        where('ended', '==', false)
      );
  
      // Listen for real-time updates to the study groups
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const groups = [];
        querySnapshot.forEach((doc) => {
          groups.push({ id: doc.id, ...doc.data() });
        });

        console.log("Groups:", groups);
  
        const chosenGroupId = choosenGroup ? choosenGroup.id : null;
        const isGroupPresent = groups.find((group) => group.id === chosenGroupId);
        if (choosenGroup && !isGroupPresent) {
          alert(`${choosenGroup.className} study group has ended`);
          setChosenGroup(null); // Reset the chosen group
        }
        setStudyGroups(groups);
      });
  
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };
  
    fetchStudyGroups();
  }, [userData]);
  

  const renderMarkers = () => {
    return studyGroups.map((group) => (
    
      <Marker key={group.id}
      coordinate={{
      latitude: group.location.coords.latitude,
      longitude: group.location.coords.longitude,
      }} title={`${group.className} Study Group`} 
      onPress={() => setChosenGroup(group)}
      />
       
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Find Study</Text>
            <Text style={styles.title}>Groups</Text>
          </View>
          <Pressable onPress={()=>navigation.pop()}>
            <Text style={styles.signOutText}>Go Back</Text>
          </Pressable>
        </View>
        <Text style={styles.text}>Find a study group near you!</Text>
      </View>
  
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.073598,
          longitude: -89.409183,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035,
        }}
      >
        {renderMarkers()}
      </MapView>
  
      {choosenGroup && (
        <ScrollView contentContainerStyle={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: 8}}>
          <Text style={styles.bigText}>{choosenGroup.className} Study Group 💯</Text>
         
          <Text style={styles.text2}>What Are We They Studying Right Now 💭</Text>
          <Text style={styles.text}>{choosenGroup.description}</Text>
          <View style={{width: '100%'}}>
            <Button title="Join Group" onPress={() => handleJoinGroup(choosenGroup.id, navigation)} />
          </View>
        </ScrollView>
      )}

      {
        studyGroups.length === 0 && <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.bigText}>Oh No!</Text>
          <Text style={styles.text}>No study groups found for your classes</Text>
          <Button title="Start One Right Now!" onPress={() => {
            navigation.navigate('CreateStudyGroup');
          }} />
        </View>
      }
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  titleView: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'black',
  },
  signOutText: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 'auto',
    marginTop: 4
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
  },
  text2: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
    marginBottom: 4,
  },
  separator: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 350,
  },
  calloutContainer: {
    width: 200,
  },
  description: {
    marginTop: 5,
  },
  joinButton: {
    marginTop: 5,
    backgroundColor: 'blue',
    color: 'white',
    padding: 5,
    textAlign: 'center',
  },
});

export default JoinStudyGroups;
