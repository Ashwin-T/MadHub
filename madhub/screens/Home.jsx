import {SafeAreaView, View, Text, StyleSheet} from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    margin: 4,
    textAlign: 'center',
    color: 'grey',
  },

});

export default Home;