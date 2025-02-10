import React, { useEffect, useState } from 'react'; 
import { SplashScreen} from './src/screens';
import { NavigationContainer } from '@react-navigation/native'; 
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import { StatusBar } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
const App = () => {
//sử dụng usestate để lưu thời gian 5 giây y
  const [isShowSplash, setIsShowSplash] = useState(true);

  const [accessToken, setAccessToken] = useState('');

  const {getItem, setItem} = useAsyncStorage('assetToken');
  
  useEffect(() => {
    const timeout = setTimeout(() => { 
      setIsShowSplash (false);
    }, 5000);
  return () => clearTimeout(timeout); 
  }, []);
  useEffect(() => {
    checkLogin();
  },[]);
  const checkLogin = async () => {
    const token = await getItem();
    console.log(token);
    token && setAccessToken(token);
  }


//dùng dấu ! để phủ định điều kiện //background nằm dưới thanh StatusBar
  return <>
    <StatusBar barStyle={'dark-content'} 
    translucent 
    backgroundColor={'transparent'} />
  
  {!isShowSplash ? (
      <SplashScreen />
  ): (
      <NavigationContainer>
        {accessToken ? <MainNavigator/> : <AuthNavigator />}
      </NavigationContainer>
    )
  }
  </>
};
export default App;