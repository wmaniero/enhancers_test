import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';
import SplashScreen from 'react-native-splash-screen';
import { 
    HomeTabs,
} from '../../_components';


const Home = (props) => {
    console.log('[Home] props', props);

    useNavigationComponentDidAppear(() => {
        //Hide splashscreen
        SplashScreen.hide();
    });

    return (
        <SafeAreaView 
            style={{ 
                flex: 1,
                backgroundColor: '#EFEFEF'
            }}>

            <HomeTabs />
        </SafeAreaView>
    );
}

export { Home }