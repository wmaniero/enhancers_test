import React, {
    forwardRef, 
    memo,
    useEffect,
    useState,
    useContext
} from 'react';
import { 
    useSelector, 
    useDispatch
} from 'react-redux';
import { 
    View,
    ScrollView,
    RefreshControl,
    Text,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import { NavigationContext } from 'react-native-navigation-hooks';
import { Screens } from '../../../../_config/navigation';
import { 
    pushModalScreen,
    pushStackScreen
} from '../../../../_utils/navigation';
import { WeatherCard } from '../../../../_components';
import {
    ScaledValue,
    fontFamilies,
    colors,
    withPreventDoublePress
} from '../../../../_utils/ui';
import { plus } from '../../../../_assets/images';
import { homeActions } from '../../../../_actions';
import { getLocationData } from '../../../../_utils/services';
import { usePrevious } from '../../../../_hooks';
import uuid from 'react-native-uuid';
import FastImage from 'react-native-fast-image';
import Shimmer from 'react-native-shimmer';


//Wrap pressable components to avoid double press issue
const TouchableOpacityEx = withPreventDoublePress(TouchableOpacity);

export const HomeTabs_Home = memo(forwardRef((props, ref) => {
    console.log('[HomeTabs_Home] props', props);

    const dispatch = useDispatch();
    const { componentId } = useContext(NavigationContext);

    //Bind to store.home.locations prop changes
    const storeLocations = useSelector(state => state.home.locations);
    console.log(`[HomeTabs_Home] storeLocations`, storeLocations);

    //Snapshot previous length in order to trigger
    //data refresh only when the dataset actually changes (e.g. city added)
    const prevStoreLocationsLength = usePrevious(storeLocations?.length);
    const [renderLazyContent, setRenderLazyContent] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    //Mount
    useEffect(() => {
        InteractionManager.runAfterInteractions(async () => {
            setRenderLazyContent(true);
        });
    }, []);

    //Listen for storeLocation changes
    useEffect(() => {
        if(prevStoreLocationsLength < storeLocations.length) {
            //Refresh current weather data
            refreshCurrentWeatherData();
        }
    }, [storeLocations]);

    
    const onRefresh = async() => {
        setRefreshing(true);

        //Refresh current weather data
        await refreshCurrentWeatherData();

        setRefreshing(false);
    }

    const onAddCity = async () => {
        pushModalScreen(Screens.AddLocation, {
            modalPresentationStyle: 'overCurrentContext',
            animations: {
                showModal: {
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 150,
                    }
                },
                dismissModal: {
                    alpha: {
                        from: 1,
                        to: 0,
                        duration: 150,
                    }
                },
            }
        }, {
            onLocationSelected: (location) => {

                //TODO: check for dupes?
                //Add location to redux store
                dispatch(homeActions.addLocation({
                    ...location,
                    id: uuid.v4() //Add unique ID
                }));
            } 
        });
    }

    /**
     * 
     * @param {*} locationId 
     */
    const onLocationDetails = (locationId) => {
        console.log(`[onLocationDetails] locationId: ${locationId}`);

        //Navigate to location details screen
        pushStackScreen(componentId, Screens.LocationDetails, null, {
            locationId
        });
    }

    const refreshCurrentWeatherData = async () => {
        if(!storeLocations?.length) {
            return;    
        }
        
        for(let i = 0; i < storeLocations.length; i++) {
            let location = storeLocations[i];

            const [response, responseError] = await getLocationData(location.lat, location.lon);
            console.log(`[getLocationData] response`, response);
            console.log(`[getLocationData] responseError`, responseError);

            if(!responseError) {
                //Add weather data to location item
                dispatch(homeActions.updateLocation(location.id, {
                    data: response,
                }));
            }
        }
    }


    const renderLocations = () => {

        //View is mounting, show placeholders
        if(!renderLazyContent) {
            return (
                Array(2).fill(0).map((_, index) => (
                    <View 
                        key={`placeholder[${index}]`}
                        style={{
                            overflow: 'hidden',
                            borderRadius: ScaledValue(25),
                            marginBottom: ScaledValue(20),
                        }}>

                        <Shimmer style={{
                            height: ScaledValue(140),
                            backgroundColor: colors.grey,
                        }}/>
                    </View>
                ))
            );
        }

        //No locations to show
        if(!storeLocations?.length) {
            return null;
        }

        return storeLocations.map((location, index) => {

            if(location?.data) {
                return (
                    <WeatherCard 
                        key={`item[${location.lat}|${location.lon}]`}
                        onLocationDetails={onLocationDetails}
                        {...{ location }} />
                );

            }else{
                return (
                    <View 
                        key={`placeholder[${index}]`}
                        style={{
                            overflow: 'hidden',
                            borderRadius: ScaledValue(25),
                            marginBottom: ScaledValue(20),
                        }}>

                        <Shimmer style={{
                            height: ScaledValue(140),
                            backgroundColor: colors.grey,
                        }}/>
                    </View>
                );

            }
        });
    }

    return (
        <ScrollView 
            contentContainerStyle={{
                paddingHorizontal: ScaledValue(20),
                paddingTop: ScaledValue(50),
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh} />
            }>

            <Text style={{
                fontFamily: fontFamilies.PoppinsSemiBold,
                fontSize: ScaledValue(28),
                lineHeight: ScaledValue(42),
                textAlign: 'center',
                color: colors.darkBlue
            }}>{`Good morning!\nMario`}</Text>

            <TouchableOpacityEx 
                style={{
                    marginTop: ScaledValue(30),
                    // backgroundColor: 'red',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={onAddCity}>

                <FastImage
                    source={plus} 
                    resizeMode="contain" 
                    tintColor="#01175F"
                    style={{
                        width: ScaledValue(24),
                        height: ScaledValue(24),
                    }} />

                <View style={{
                    marginLeft: ScaledValue(15),
                    paddingVertical: ScaledValue(18)
                }}>
                    <Text style={{
                        fontFamily: fontFamilies.PoppinsSemiBold,
                        fontSize: ScaledValue(20),
                        lineHeight: ScaledValue(30),
                        textAlign: 'center',
                        color: colors.darkBlue
                    }}>Aggiungi città</Text>
                </View>
            </TouchableOpacityEx>

            <View style={{
                marginTop: ScaledValue(30),
            }}>
                {renderLocations()}
            </View>
        </ScrollView>
    );
}));