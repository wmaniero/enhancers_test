
import { 
    RFValue, 
    RFPercentage
} from 'react-native-responsive-fontsize';

//This is the value used during prototyping
const STANDARD_SCREEN_HEIGHT = 896; //Google Pixel Viewport

//Util that helps to auto scale font sizes and dimensions based on screen
//number should match 1:1 ratio value with STANDARD_SCREEN_HEIGHT
export const ScaledValue = (number) => {
    return RFValue(number, STANDARD_SCREEN_HEIGHT);
};

export const ScaledPercentage = (number) => {
    return RFPercentage(number);
};