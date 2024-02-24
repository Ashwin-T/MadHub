import 'react-native-gesture-handler'; // Should be on top. Must include this in order to use react navigation

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataProvider, useData } from './contexts/DataContext';
import { StatusBar } from 'react-native';

import Login from './screens/Login';
import Register from './screens/Register';
import Loading from './screens/Loading';
import Home from './screens/Home';
import Setup from './screens/Setup';

const App = () => {

  const { user, isRegistering, loading, authLoading, needsSetup} = useData();
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <NavigationContainer>
          <Stack.Navigator>
            {
              (loading || authLoading) ? (
                <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
              ) :
              (
                <>
                  {user ? (
                    <>
                      {
                        needsSetup ? (
                          <Stack.Screen name="Setup" component={Setup} options={{ headerShown: false }} />
                        ) : 
                        <>
                          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                        </>
                      }
                    </>
                  ) : (
                    <>
                      {isRegistering ? (
                        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                      ) : (
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                      )}
                    </>
                  )}
                </>
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
    </>
  );
};

const AppWrapper = () => {
  return (
    <DataProvider>
      <App />
    </DataProvider>
  );
}

export default AppWrapper;