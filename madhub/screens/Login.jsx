import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView} from 'react-native';
import { useData } from '../contexts/DataContext';
import Button from "../components/Button"

const LoginScreen = ({ navigation }) => {
  const { handleSignIn, setIsRegistering } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = () => {
    handleSignIn(email, password, setError);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style = {styles.titleView}>
        <Text style={styles.title}>MadHub</Text>
        <Text style={styles.text}>Lets get to work!</Text>  
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style = {{width: '85%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Text style = {{marginBottom: 8, marginRight: 8, color: 'grey'}}>Forgot Password?</Text>
      </View>

      {
        error ? <Text style={{ color: 'red', margin: 8}}>{error}</Text> : <View style={{margin: 8}}></View>
      }
    
      <Button buttonStyle = {{backgroundColor: 'red'}} title="Login In" onPress={signIn} />
      <Text style={styles.text}>Don't have an account? <Text style = {{color: "#2a9df1", marginLeft: 8}} onPress = {() => setIsRegistering(true)}>Register Now</Text></Text>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
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
    margin: 8,
    textAlign: 'center',
    color: 'grey',
  },

});

export default LoginScreen;