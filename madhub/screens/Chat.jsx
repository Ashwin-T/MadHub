import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { useData } from '../contexts/DataContext';
import { onSnapshot, doc, updateDoc, arrayUnion,  } from 'firebase/firestore';
import { db } from '../config/Firebase';

const Chat = ({ navigation,  route: {params: {chat}}}) => {
  const { userData } = useData();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const scrollViewRef = useRef();
  
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'classes', `${chat}`), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setMessages(data.messages.slice(-50))
      } 
    });
  
    return () => {
      if(unsubscribe) unsubscribe();
    };
  }, [])

  const sendMessage = async() => {
    if (messageInput.trim() === '') return;
    
    await updateDoc(doc(db, 'classes', `${chat}`), {
      messages: arrayUnion({
        message: messageInput,
        creator: userData.uid,
      })
    })

    setMessageInput('');
  
  }


  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{chat}</Text>
            <Text style={styles.title}>Live Discussion</Text>
          </View>
          <Pressable onPress={() => navigation.pop()}>
            <Text style={styles.signOutText}>Go Back</Text>
          </Pressable>
        </View>
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
          {messages.length > 0 ? (
            <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
              <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
                {messages.map((message, index) => (
                  <>
                    {
                      message.creator === userData.uid ? (
                        <View key={index} style={[styles.messageContainer, { marginLeft: 150, backgroundColor: '#2a9df1'}]}>
                          <Text style={[styles.messageText, { color: 'white' }]}>{message.message}</Text>
                        </View>

                      ) : (
                        <View key={index} style={[styles.messageContainer, { marginRight: 150}]}>
                          <Text style={[styles.messageText]}>{message.message}</Text>
                        </View>
                      )
                    }
                  </>
                ))}
              </ScrollView>
            
            </View>
           
        ) : (
          <Text style={styles.text}>Nobody has said anything yet in here!</Text>
        )}
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
                style={styles.textInput}
                onChangeText={setMessageInput}
                value={messageInput}
              />
            <Button title="Send" onPress={sendMessage} />
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
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 16,
    padding: 8,
    width: '95%',
  },
  bottomContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 16,
  }  
});

export default Chat;
