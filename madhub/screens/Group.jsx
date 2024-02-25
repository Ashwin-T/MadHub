import {useEffect, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';
import MapView, {Marker} from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import Loading from './Loading';
const Group = ({navigation, route: {params: {group}}}) => {

  const { user, userData, currentGroup, handleEndGroup, handleUploadPhoto} = useData();
  const [hasSelectedImage, setHasSelectedImage] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  useEffect(() => {
    if(currentGroup && currentGroup.notesAdded.includes(user.email)) {
      setHasSelectedImage(true);
    }
  }, [currentGroup])

  const handleAddNotes = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.cancelled) {
      setHasSelectedImage(true);
      handleUploadPhoto(result.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        currentGroup ? (
        <>
          <View style={styles.titleView}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{currentGroup.className}</Text>
              <Text style={styles.title}>Group Study</Text>
            </View>
            <Pressable onPress={()=>navigation.pop()}>
              <Text style={styles.signOutText}>Go Back</Text> 
            </Pressable>
          </View>
          <Text style={styles.text}>Welcome to a study group for {currentGroup.className}</Text>
        </View>
        
        <ScrollView contentContainerStyle={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: 8}}>
            
          <Text style={[styles.bigText, { marginTop: 8 }]}>Where Are We Meeting</Text>
          <MapView style={{ width: '100%', height: 200 }} initialRegion={{
            latitude: currentGroup.location.coords.latitude,
            longitude: currentGroup.location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}  
          >
          <Marker coordinate={{
            latitude: currentGroup.location.coords.latitude,
            longitude: currentGroup.location.coords.longitude,
          }} title={`${currentGroup.className} Study Group`} description='Studying Happening Here' />

          </MapView>

          <Text style={styles.text}>Specific Location Note: {currentGroup.whereInput}</Text>
          
          <Text style={styles.bigText}>What Are We Tackling today</Text>
          <Text style={styles.text}>{currentGroup.description}</Text>

          {
            hasSelectedImage ? 
            <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
              <Button moreStyles={{width: '75%', backgroundColor: 'green'}} title="Added Study Notes 🎉" onPress={()=>{}} disabled/>
              <Text style={[styles.text]}>Note: Adding notes allows you to get a summarized AI generated compliation of the notes at the end of the group.</Text>
            </View>
            :
            <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
              <Button moreStyles={{width: '75%'}} title="Add Study Notes" onPress={handleAddNotes}/>
              <Text style={[styles.text, {color: 'orange'}]}>Note: Adding notes allows you to get an email of summarized AI generated compliation of the notes at the end of the group. Remind everyone to add an image of their notes</Text>
            </View>
          }

          {
            currentGroup.creator === user.uid && 
            <View style={{width: '100%', display: 'flex', alignItems: 'center'}}>
              <Button moreStyles={{width: '75%', backgroundColor : 'red'}} title="End Group" onPress={()=>handleEndGroup(navigation, currentGroup.notesAdded, currentGroup.className)}/>
              <Text style={[styles.text, {color: 'red'}]}>Note: Ending the group will send an email to everyone with a summary of the notes if they added their own notes</Text>
            </View>
          }
        </ScrollView>
        
        
      
      </>
        ) : (
          <Loading />
        )
      }
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  titleView: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 0,
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
    textAlign: 'left',
    color: 'grey',
    marginBottom: 16,
    marginTop: 4
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigText : {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  map: {
    width: '100%',
  },
});

export default Group;
