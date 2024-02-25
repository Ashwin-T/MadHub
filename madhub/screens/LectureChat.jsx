import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { onSnapshot, doc,  } from 'firebase/firestore';
import { db } from '../config/Firebase';

const LectureChat = ({ navigation }) => {
  const { userData } = useData();
  const [openChatrooms, setOpenChatrooms] = useState([]);

  useEffect(() => {
    const getTimeAsDate = (timeString) => {
      let [hours, minutes] = timeString.split(':').map(Number);
      // Adjust hours if needed
      if (hours >= 12) {
        // For PM hours, add 12 to convert to 24-hour format
        hours += 12;
      } 
    
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    };

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const currentTimeAsDate = getTimeAsDate(currentTime);

    const filteredChatrooms = userData.classes.filter((classItem) => {
      console.log(classItem);
      const startTimeAsDate = getTimeAsDate(classItem.startTime);
      const startTimeHours = startTimeAsDate.getHours();
    
      // Check if the start time is between 8 AM and 12 PM or between 12 PM and 6 PM
      if ((startTimeHours >= 8 && startTimeHours < 12) || (startTimeHours >= 12 && startTimeHours < 18)) {
        const timeDifference = Math.abs(currentTimeAsDate.getHours() - startTimeHours);
        return timeDifference <= 1.5 && timeDifference >= 0;
      }
      
      return false;
    });
    

    setOpenChatrooms(filteredChatrooms);
  }, [userData.classes]);

    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Lecture</Text>
            <Text style={styles.title}>Discussions</Text>
          </View>
          <Pressable onPress={() => navigation.pop()}>
            <Text style={styles.signOutText}>Go Back</Text>
          </Pressable>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        > 
          {openChatrooms.length > 0 ? (
            <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
            }}>

            <Text style={styles.bigText}>Available Chatrooms</Text>
            
            {
              openChatrooms.map((chatroom, index) => {
                return (
                  <TouchableOpacity key={index} style = {{backgroundColor: 'lightgrey', padding: 16, borderRadius: 8, marginBottom: 8, width: '75%', fontSize: 16}} onPress = {() => {
                    navigation.navigate('Chat', {chat: chatroom.className})
                  }}>
                  
                    <Text style = {{fontSize: 16, fontWeight: 'bold'}}>{chatroom.className}</Text>
                  </TouchableOpacity>
                )
              })
            } 
            </View>
           
        ) : (
          <Text style={styles.text}>No open chatrooms at the moment.</Text>
        )}
        </View>
      </View>
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
    marginTop: 4,
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    color: 'grey',
    marginBottom: 16,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    color: 'black',
    width: 150
  },
  messageText: {
    fontSize: 16,
  },
  
});

export default LectureChat;
