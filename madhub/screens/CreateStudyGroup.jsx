import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, TextInput, Image, KeyboardAvoidingView} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useData } from '../contexts/DataContext';
import Button from '../components/Button';

const CreateStudyGroup = ({ navigation }) => {

  const { user, userData, handleCreateGroup} = useData();
  const [selectedClass, setSelectedClass] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [whereInput, setWhereInput] = useState(''); 
  const [error, setError] = useState('');

  const userClassesInRightFormat = userData.classes ? userData.classes.map((c) => {
    return {label: c.className, value: c.className, key: c.className};
  }): [];

  const createGroup = async() => {
    const docRefId = await handleCreateGroup(navigation, selectedClass, descriptionInput, whereInput, setError);
  } 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a Group</Text>
          <Pressable onPress={()=>navigation.pop()}>
            <Text style={styles.signOutText}>Go Back</Text>
          </Pressable>
        </View>
        <Text style={styles.text}>Create a group to study with your peers</Text>
      </View>

      <Image source={require('../assets/create.png')} style={{width: '100%', height: 350}} />

      <RNPickerSelect
        onValueChange={(value) => setSelectedClass(value)}
        placeholder={{label: 'Select a class', value: null}}
        value={selectedClass}
        items={userClassesInRightFormat}
        style={StyleSheet.create({
          inputIOSContainer: {
            width: '90%',
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            marginLeft: 20,
            display: 'flex',
            justifyContent: 'center',
            paddingHorizontal: 10,
          },
        })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TextInput
        style={styles.input}
        value={whereInput}
        onChangeText={setWhereInput}
        placeholder="Enter description of what you where you are"
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={descriptionInput}
        onChangeText={setDescriptionInput}
        placeholder="Enter description of what you are studying here..."
        
      />


      {
        error ? (
          <Text style={{color: 'red'}}>{error}</Text>
        ) : null
      }
      
      </ KeyboardAvoidingView >

      <Button title="Create a Study Group" onPress={createGroup} />

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
    color: 'blue',
    marginLeft: 'auto',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    width: '100%',
    height: 70,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Background color for iOS
  }
});

export default CreateStudyGroup;
