
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { 
    persistor, 
    store
} from '../../_store';
import { Navigation } from 'react-native-navigation';
import { withNavigationProvider } from 'react-native-navigation-hooks';
import { Screens } from './screens';
import { 
    Home,
    AddLocation,
    LocationDetails
} from '../../Views';

/**
 * Enhance @Component with redux 
 * 
 * @param {*} Component 
 * @returns 
 */
const ReduxProvider = (Component) => {
	return (props) => {
		return (
            <Provider store={store}>
                <PersistGate 
                    loading={null} 
                    persistor={persistor}>

                    <Component {...props} />
                </PersistGate>
			</Provider>
		);
	};
}

export const registerScreens = () => {
    console.log('Registering screens...');

    Navigation.registerComponent(Screens.Home, () => ReduxProvider(withNavigationProvider(Home)));
    Navigation.registerComponent(Screens.AddLocation, () => ReduxProvider(withNavigationProvider(AddLocation)));
    Navigation.registerComponent(Screens.LocationDetails, () => ReduxProvider(withNavigationProvider(LocationDetails)));
}