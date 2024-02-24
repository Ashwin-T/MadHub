import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView} from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';

const Home = () => {
  const { user, userData } = useData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.text}>Welcome {user.email}</Text>
        <Pressable style={styles.text} onPress={() => signOut(auth)} >
          <Text style={styles.text}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  titleView: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 38,
    margin: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  text: {
    fontSize: 16,
    margin: 4,
    textAlign: 'center',
    color: 'grey',
  },
  classList: {
    width: '85%',
    marginBottom: 16,
  },
  classListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classItem: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Home;
