import 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { 
    registerScreens, 
    setInitialLayout, 
    startApp,
} from './app/_config/navigation';

//Setup custom JS error handler instead of default error screen
setJSExceptionHandler((e, isFatal) => {
    Alert.alert(e.name, e.message);
});

//Register navigation screens
registerScreens();

//Set initial layout
setInitialLayout();

//Configure default navigation options
//and set root node
startApp();