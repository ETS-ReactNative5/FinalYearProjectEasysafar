import React from 'react';

import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
// screens
import Home from '../screens/Home';
import MapPage from '../screens/MapPage';
import Register from '../screens/Register';
import PlaceList from '../screens/PlaceList';
import Guides from '../screens/Guides';
import Onboarding from '../screens/Onboarding';
import Details from '../screens/Details';
import createtrip from '../screens/createtrip';
import GuidePlaceType from '../screens/GuidePlaceType';
import GuidePlaceResult from '../screens/GuidePlaceResult';
import profile from '../screens/profile';
import TripMapPage from '../screens/TripMapPage';


// drawer 
import Menu from './Menu';
import DrawerItem from '../components/DrawerItem';

// header for screens
import Header from '../components/Header';

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

const GuidesStack = createStackNavigator(
  {
    
    Guides: {
      screen: Guides,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Guides" navigation={navigation} />
      })
    },
    GuidePlaceType: {
      screen: GuidePlaceType,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="Guide Place Type" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    },
    GuidePlaceResult: {
      screen: GuidePlaceResult,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="Guide Place Result" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    },
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="Details" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  
  
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const createtripStack = createStackNavigator(
  {
    createtrip: {
      screen: createtrip,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Create Trip" navigation={navigation} />
      })
    },
    TripMapPage: {
      screen: TripMapPage,
      navigationOptions: ({ navigation }) => ({
        header: <Header title="Trip Map Page" navigation={navigation} />
      })
    },
  },
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);



const ProfileStack = createStackNavigator(
  {
    profile: {
      screen: profile,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="My Profile" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        header: <Header search options title="Home" navigation={navigation} />
      })
    },
    MapPage: {
      screen: MapPage,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="MapPage" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    },
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header transparent title="Details" iconColor={'#333'} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  }, 
  {
    cardStyle: {
      backgroundColor: '#FFFFFF'
    },
    transitionConfig
  }
);

const AppStack = createDrawerNavigator(
  {
    
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Register: {
      screen: Register,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => <DrawerItem focused={focused} title="Home Page" />
      })
    },
    createtrip: {
      screen: createtripStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="createtrip" title="Create Trip" />
        )
      })
    },
    Guides: {
      screen: GuidesStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Guides" title="Guides" />
        )
      })
    },
    profile: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => <DrawerItem focused={focused} title="My Profile" />
      })
    },
    Details: {
      screen: Details,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    GuidePlaceType: {
      screen: GuidePlaceType,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    
    GuidePlaceResult: {
      screen: GuidePlaceResult,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    MapPage: {
      screen: MapPage,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    PlaceList: {
      screen: PlaceList,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
   
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
