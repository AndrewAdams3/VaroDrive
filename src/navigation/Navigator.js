import React from 'react'
import { Platform } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import colors from '../config/styles/colors'

import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/Signup'
import LandingScreen from '../screens/Landing'
import NotVerifiedScreen from '../screens/NotVerified'
import UserInfoScreen from '../screens/UserInfo'
import HomeScreen from '../screens/HomeScreen'
import TimeInScreen from '../screens/TimeInScreen'
import NewDBScreen from '../screens/NewDBScreen'
import TimeSheetScreen from '../screens/TimesheetScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ViewAssignments from '../screens/ViewAssignments'
import ViewDBs from '../screens/ViewDBs'
import EditProfile from '../screens/EditProfile'

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    SignUp: SignUpScreen
}, {
    initialRouteName: "Login",
    headerMode: "none"
})

const LandingStack = createStackNavigator({
    Landing: LandingScreen
},{
    initialRouteName: 'Landing',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
})

const SetupStack = createStackNavigator({
    NotVerified: NotVerifiedScreen,
    UserInfo: UserInfoScreen
},{
    initialRouteName: "NotVerified",
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
})

const AppNav = createStackNavigator({
    TimeIn: TimeInScreen,
    TimeSheet: TimeSheetScreen,
    Home: HomeScreen,
    NewDB: NewDBScreen,
    Profile: ProfileScreen,
    Edit: EditProfile,
    ViewAssignments: ViewAssignments,
    ViewDBs: ViewDBs,
  },{ 
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.PRIMARY_BACKGROUND,
        opacity: 1,
        height: Platform.OS === "ios" ? 60 : 80,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        flex: 1,
        color: 'white',
        fontSize: 30,
        alignSelf: 'center',
      },
    },
})

export default Navigator = createAppContainer(createSwitchNavigator({
    Landing: LandingStack,
    Auth: AuthStack,
    Setup: SetupStack,
    App: AppNav
}, {
    initialRouteName: "Landing",
}));