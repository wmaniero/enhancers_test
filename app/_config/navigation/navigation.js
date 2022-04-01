
import { Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { screenToRoot } from '../../_utils/navigation';
import { Screens } from './screens';

/**
 * Set initial layout and configure
 * transitions for actions
 */
export const setInitialLayout = () => {

    const duration = 300;
    const {
        width,
        height
    } = Dimensions.get('window');

    Navigation.setDefaultOptions({
        layout: { 
            orientation: ['portrait'] 
        },
        animations: {
            push: {
                content: {
                    translationX: {
                        from: width,
                        to: 0,
                        duration: duration,
                    },
                },
            },
            pop: {
                content: {
                    translationX: {
                        from: 0,
                        to: width,
                        duration: duration
                    },
                }
            },
            showModal: {
                translationY: {
                    from: height,
                    to: 0,
                    duration: duration
                },
            },
            dismissModal: {
                translationY: {
                    from: 0,
                    to: height,
                    duration: duration
                },
            }
        },
    });
}

/**
 * Configure navigation default options shared across whole application
 * and conditionally set root node for app start
 */
export const startApp = () => {
    Navigation.events().registerAppLaunchedListener(() => {

        //Set initial screen
        Navigation.setRoot(screenToRoot(Screens.Home));
    });
};