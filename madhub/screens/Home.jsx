import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Image} from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';

const Home = ({ navigation }) => {
  const { user, loading, currentGroup, handleSignOut} = useData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <View style={styles.header}>
          <Text style={styles.title}>Hi There</Text>
          <Pressable onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
        <Text style={styles.text}>Welcome {user?.email}</Text>
      </View>      

      <Image source={require('../assets/study.png')} style={{width: '100%', height: 350}} />

      <Text style={[styles.text, {textAlign: 'left', width: '95%', marginVertical: 12, fontWeight: 'bold', color:'black', fontSize: 24}]}>What Would You Like To Do?</Text>
      
      <View style={{width: '100%', display: 'flex', justifyContent : 'center', alignItem: 'center'}}>
        <Button title="Join Live Lecture Discussions" onPress={() => navigation.navigate('LectureChat')} />

        <View style={styles.separator}>
          <Text>OR</Text>
        </View>
        {
          currentGroup ? (
            <View>
              <Button title = {`View Curr Group for ${currentGroup.className}`} moreStyles = {{backgroundColor: 'green'}} onPress={() => navigation.navigate('Group', {group: currentGroup.id})} />
            </View>
          ) : (
            <View style={styles.buttonGroup}>
              <Button title="Create a Study Spot" moreStyles = {{backgroundColor: 'green'}} onPress={() => navigation.navigate('CreateStudyGroup')} />
              <Button title="Join a Study Spot" moreStyles = {{backgroundColor: 'orange'}} onPress={() => navigation.navigate('JoinStudyGroup')} />
            </View>
            )
        }
      </View>
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
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'red',
    marginLeft: 'auto',
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
  bigText : {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
  },
  separator: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
});

export default Home;
