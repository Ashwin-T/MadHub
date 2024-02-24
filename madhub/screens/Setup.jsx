import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView} from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';

const Setup = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const { handleSetup } = useData();

  const addClass = () => {
    if (className && startTime && stopTime) {
      const newClass = { className, startTime, stopTime };
      setClasses([...classes, newClass]);
      // Clear input fields after adding class
      setClassName('');
      setStartTime('');
      setStopTime('');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Setup!</Text>
        <Text style={styles.text}>Let's get all set up!</Text>
      </View>
      <View style={styles.classList}>
        <Text style={styles.classListTitle}>Classes:</Text>
        {classes.map((classItem, index) => (
          <Text key={index} style={styles.classItem}>{classItem.className}</Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Class Name"
        value={className}
        onChangeText={text => setClassName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Time"
        value={startTime}
        onChangeText={text => setStartTime(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Stop Time"
        value={stopTime}
        onChangeText={text => setStopTime(text)}
      />
      <Button moreStyles={{ backgroundColor: 'green' }}  title="Add Class" onPress={addClass} />
      <Button title="Register Now" onPress={() => handleSetup(classes)} />
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

export default Setup;
