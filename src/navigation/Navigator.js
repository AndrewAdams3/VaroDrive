import React from 'react'
import { Platform , TouchableOpacity, Image} from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import colors from '../config/styles/colors'
import Images from '../config/images'

import Screen from '../components/Screen'
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


const HeaderStyles = {
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
}
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
    TimeIn: {
        screen: (props) =>( 
            <Screen>
                <TimeInScreen {...props}/>
            </Screen>
        ),
        path: '/timeIn',
        navigationOptions: {
            title: "Time Clock",
            ...HeaderStyles
        }
    },
    TimeSheet: {
        screen: (props) =>( 
            <Screen>
                <TimeSheetScreen props={props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "Time Sheet",
            ...HeaderStyles
        }
    },
    Home: {
        screen: (props) =>( 
            <Screen>
                <HomeScreen {...props}/>
            </Screen>
        ),
        navigationOptions: (props) => ({
            title: "Home",
            ...HeaderStyles,
            headerLeftContainerStyle: {
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                width: "15%",
                padding: 10
            },
            headerLeft: (
                <TouchableOpacity style={{flex: 1, width: "100%", justifyContent: "center", alignItems: "center"}} onPress={() => {props.navigation.navigate("Profile")}}>
                    <Image style={{height: "100%", width: "100%", tintColor: "white"}} source={Images.profile} resizeMode="contain"/>
                </TouchableOpacity>
            )
        })
    },
    NewDB: {
        screen: (props) =>( 
            <Screen>
                <NewDBScreen {...props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "New Driveby",
            ...HeaderStyles
        }
    },
    Profile: {
        screen: (props) =>( 
            <Screen>
                <ProfileScreen {...props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "Profile",
            ...HeaderStyles
        }
    },
    Edit: {
        screen: (props) =>( 
            <Screen>
                <EditProfile {...props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "Edit Profile",
            ...HeaderStyles
        }
    },
    ViewAssignments: {
        screen: (props) =>( 
            <Screen>
                <ViewAssignments {...props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "View Assignments",
            ...HeaderStyles
        }
    },
    ViewDBs: {
        screen: (props) =>( 
            <Screen>
                <ViewDBs {...props}/>
            </Screen>
        ),
        navigationOptions: {
            title: "View Drivebys",
            ...HeaderStyles
        }
    },
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