/*
 * Main Application Routing
 * * */


// -- Forms & User Login, Register, etc..
// export const UserLogin          = 'LoginPage';
// export const UserSignup         = 'SignupPage';


// -- Content Pages
export const Landing            = 'LandingPage';
export const Checker            = 'CheckerPage';
export const Pulse              = 'PulsePage';
export const Settings           = 'SettingsPage';
export const Aboutus            = 'AboutusPage';


// -- The page the user lands on after opening the app and without a session
export const FirstRunPage       = Landing;


// -- The main page the user will see as they use the app over a long period of time.
export const MainPage           = Checker;


// -- Pages List (Navigation Menu)
// /*
//  * App Pages Menu.
//  *
//  * -- Access Levels:
//  * -- NOTE: THIS NEEDS FURTHER WORK TO BE FULLY IMPLEMENTED
//  * --
//  * -- -> "none"      ->  Available for NOBODY.
//  * -- -> "any"       ->  Available for ANYONE.
//  * -- -> "guest"     ->  Available for only NON-LOGGED-IN USERS.
//  * -- -> "user"      ->  Available for only LOGGED-IN USERS WITH ANY TYPE.
//  * -- -> "customer"  ->  Available for only LOGGED-IN USERS WITH TYPE `CUSTOMER`.
//  * -- -> "provider"  ->  Available for only LOGGED-IN USERS WITH TYPE `SERVICE-PROVIDER`.
//  */
export const PAGES: any[] = [
    {
        title: 'CHECKER',
        icon: 'ios-cash',
        access: 'any',
        component: Checker,
    },
    {
        title: 'SETTINGS',
        icon: 'ios-cog',
        access: 'any',
        component: Settings,
    },
    {
        title: 'ABOUT',
        icon: 'information-circle',
        access: 'any',
        component: Aboutus,
    },
    {
        title: 'SHARE_APP',
        icon: 'md-share',
        access: 'any',
        component: '$action',
        action: 'share'
    },
];
