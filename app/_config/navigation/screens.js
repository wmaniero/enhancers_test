import { APP_PACKAGE_NAME } from '../../_config/app';

const ScreenName = (screen) => 
    `${APP_PACKAGE_NAME}.${screen}`;

export const Screens = {
    Home: ScreenName('Home'),
    AddLocation: ScreenName('AddLocation'),
    LocationDetails: ScreenName('LocationDetails'),
}