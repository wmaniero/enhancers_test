import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    StyleSheet
} from 'react-native';
import {
    ScaledValue,
    fontFamilies,
    colors,
    withPreventDoublePress
} from '../../_utils/ui';
import { 
    plus,
    mod_rain_swrs_day,
    sunny,
    cloudy
} from '../../_assets/images';
import FastImage from 'react-native-fast-image';
import RadialGradient from 'react-native-radial-gradient';
import moment from 'moment';

//Wrap pressable components to avoid double press issue
const TouchableOpacityEx = withPreventDoublePress(TouchableOpacity);

const WeatherCard = (props) => {
    console.log('[WeatherCard] props', props);

    const layout = useWindowDimensions();

    const onLocationDetails = () => {
        if(typeof props.onLocationDetails === 'function') {
            props.onLocationDetails(props?.location?.id);
        }
    }

    const currentData = props?.location?.data?.current ?? null;
    const { 
        dt,
        temp,
        weather
    } = currentData || {};

    //Get only int value
    const temperature = Number.parseInt(temp ?? 0, 10);
    const momentObj = moment.unix(dt);

    let gradientColors = ['#011354', '#5B9FE3'];
    let imageProps = null;

    //Conditionally set gradient colors and image props
    //based on current location weather
    if(weather?.length) {
        let weatherObject = weather[0];

        if(weatherObject.main === 'Clear') {
            gradientColors = ['#5374E7', '#77B9F5'];
            imageProps = {
                source: sunny,
                resizeMode: 'contain',
                style: {
                    width: ScaledValue(84),
                    height: ScaledValue(84),
                }
            }

        }else if(weatherObject.main === 'Clouds') {
            gradientColors = ['#464C64', '#99A9B9'];
            imageProps = {
                source: cloudy,
                resizeMode: 'contain',
                style: {
                    width: ScaledValue(84),
                    height: ScaledValue(52),
                }
            }
        }else if(weatherObject.main === 'Sunny') {
            
        } 
    }

    return (

        <TouchableOpacityEx 
            onPress={onLocationDetails}>

            <RadialGradient
                style={{
                    height: ScaledValue(140),
                    borderRadius: ScaledValue(25),
                    marginBottom: ScaledValue(20),
                    paddingVertical: ScaledValue(20),
                    paddingHorizontal: ScaledValue(20),
                    flexDirection: 'row',
                    overflow: 'hidden',
                }}
                center={[0, 0]}
                radius={layout.width}
                colors={gradientColors}>

                {(imageProps) && (
                    <View style={{
                        ...StyleSheet.absoluteFillObject,
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FastImage {...imageProps} />
                    </View>
                )}

                <View style={{
                    flex: 1
                    // backgroundColor: 'cyan',
                }}>
                    <Text style={{
                        fontFamily: fontFamilies.PoppinsSemiBold,
                        fontSize: ScaledValue(26),
                        lineHeight: ScaledValue(30),
                        color: colors.white
                    }}>{props?.location?.name ?? ''}</Text>

                    <Text style={{
                        fontFamily: fontFamilies.PoppinsMedium,
                        fontSize: ScaledValue(15),
                        lineHeight: ScaledValue(18),
                        color: colors.white
                    }}>{`${momentObj.format('dddd D')},\n${momentObj.format('MMMM')}`}</Text>

                    <View style={{
                        marginTop: ScaledValue(12)
                    }}>
                        <Text style={{
                            fontFamily: fontFamilies.PoppinsLight,
                            fontSize: ScaledValue(12),
                            lineHeight: ScaledValue(18),
                            color: colors.white
                        }}>{`${momentObj.format('h:mm a')}`}</Text>
                    </View>
                </View>
                
                <View style={{
                    // backgroundColor: 'orange',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontFamily: fontFamilies.PoppinsSemiBold,
                        fontSize: ScaledValue(50),
                        lineHeight: ScaledValue(76),
                        color: colors.white
                    }}>{`${temperature}°`}</Text>
                </View>
            </RadialGradient>
        </TouchableOpacityEx>
    );
}

export { WeatherCard }