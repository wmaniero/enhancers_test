import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { 
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
    InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Header
} from '../../_components';
import {
    ScaledValue,
    fontFamilies,
    colors,
    withPreventDoublePress
} from '../../_utils/ui';
import { 
    arrow_left,
    plus,
    mod_rain_swrs_day,
    sunny,
    cloudy
} from '../../_assets/images';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import Shimmer from 'react-native-shimmer';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';
import moment from 'moment';


//Wrap pressable components to avoid double press issue
const TouchableOpacityEx = withPreventDoublePress(TouchableOpacity);

class LocationDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderLazyContent: false,
            layoutFirstTimelineCircle: null,
        }

        this.onBack = this._onBack.bind(this);
        this.onAdd = this._onAdd.bind(this);
        this.onLayoutTimelineCircle = this._onLayoutTimelineCircle.bind(this);
        this.renderHeaderLeftAccessory = this._renderHeaderLeftAccessory.bind(this);
        this.renderHeaderRightAccessory = this._renderHeaderRightAccessory.bind(this);
    }

	componentDidMount() {
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
        this.navigationEventListener?.remove();
	}

	componentDidAppear() {

        InteractionManager.runAfterInteractions(() => {
            this.setState({ renderLazyContent: true });
        });
	}

    _onBack() {
        const { componentId } = this.props;

        Navigation.pop(componentId);
    }

    _onAdd() {
        //TODO: ...
    }

    /**
     * @param {*} event 
     */
    _onLayoutTimelineCircle(event) {
        const { x, y, width, height } = event.nativeEvent.layout;

        this.setState({ 
            layoutFirstTimelineCircle: {
                x,
                y,
                width,
                height
            }
        }, () => console.log('this.state', this.state));
    }

    /**
     * Get gradient colors based on current
     * location weather data
     */
    _getGradientColors() {
        const { location } = this.props;

        let gradientColors = ['#011354', '#5B9FE3'];

        if(location?.data?.current?.weather?.length) {
            let weatherObject = location.data.current.weather[0];

            if(weatherObject.main === 'Clear') {
                gradientColors = ['#5374E7', '#77B9F5'];

            }else if(weatherObject.main === 'Clouds') {
                gradientColors = ['#464C64', '#99A9B9'];

            }else if(weatherObject.main === 'Sunny') {
                gradientColors = ['#011354', '#5B9FE3'];
            } 
        }
        return gradientColors;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    _parseForecastData(data) {
        console.log('[_parseForecastData] data', data);

        let forecastData = [];
        let dayOffset = 1;

        if(!data?.length) {
            return [];
        }

        //Get weather data for next 5 days
        //excluding today and hourly steps
        for(let i = 0; i < data.length; i++) {
            let forecast = data[i];
            let momentObj = moment.unix(forecast.dt);

            //Get today day and add offset
            const date = moment().utc()
                .add(dayOffset, 'day');

            if(date.isSame(momentObj, 'day')) {
                forecastData = [...forecastData, forecast];
                dayOffset++;
            }
        }
        return forecastData;
    }


    _renderHeaderLeftAccessory() {
        return (
            <View style={{
                flex: 1,
                paddingHorizontal: ScaledValue(20),
                alignContent: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacityEx
                    style={{
                        width: ScaledValue(23),
                        height: ScaledValue(19),
                    }}
                    hitSlop={{ 
                        top: ScaledValue(20), 
                        bottom: ScaledValue(20), 
                        left: ScaledValue(20), 
                        right: ScaledValue(20)
                    }}
                    onPress={this.onBack}>

                    <FastImage
                        source={arrow_left} 
                        resizeMode="contain" 
                        tintColor={colors.white}
                        style={{
                            width: ScaledValue(23),
                            height: ScaledValue(19),
                        }} />
                </TouchableOpacityEx>
            </View>
        );
    }

    _renderHeaderRightAccessory() {
        return (
            <View style={{
                flex: 1,
                paddingHorizontal: ScaledValue(20),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'center'
            }}>
                <TouchableOpacityEx
                    style={{
                        width: ScaledValue(23),
                        height: ScaledValue(19),
                    }}
                    hitSlop={{ 
                        top: ScaledValue(20), 
                        bottom: ScaledValue(20), 
                        left: ScaledValue(20), 
                        right: ScaledValue(20)
                    }}
                    onPress={this.onAdd}>

                    <FastImage
                        source={plus} 
                        resizeMode="contain" 
                        tintColor={colors.white}
                        style={{
                            width: ScaledValue(24),
                            height: ScaledValue(24),
                        }} />
                </TouchableOpacityEx>
            </View>
        );
    }

    /**
     * 
     * Render weather related image
     * based on location weather data
     * 
     * @param {*} location 
     * @returns 
     */
    _renderWeatherImage(weatherObject) {
        if(!weatherObject) {
            return null;
        }

        let imageProps = null;

        //Conditionally set gradient colors and image props
        //based on current location weather

        if(weatherObject.main === 'Clear') {
            imageProps = {
                source: sunny, //TODO: set right image, no assets from invision...
                resizeMode: 'contain',
                style: {
                    width: ScaledValue(84),
                    height: ScaledValue(84),
                }
            }

        }else if(weatherObject.main === 'Clouds') {
            imageProps = {
                source: cloudy,
                resizeMode: 'contain',
                style: {
                    width: ScaledValue(84),
                    height: ScaledValue(52),
                }
            }
        }else if(weatherObject.main === 'Sunny') {
            imageProps = {
                source: sunny,
                resizeMode: 'contain',
                style: {
                    width: ScaledValue(84),
                    height: ScaledValue(84),
                }
            }
        } 

        if(imageProps) {
            return (
                <FastImage { ...imageProps } />
            );
        }
        return null;
    }

    /**
     * Render location forecast data timeline
     */
    _renderTimeline() {

        const { location } = this.props;
        const { layoutFirstTimelineCircle } = this.state;

        let hourlyData = [];
        let foundInitialIndex = false;

        //Get hourly data and compare current date
        //to find initial item which will be set as NOW
        if(location?.data?.hourly?.length) {

            for(let i = 0; i < location.data.hourly.length && hourlyData.length < 8; i++) {
                let item = location.data.hourly[i];
                let momentObj = moment.unix(item.dt);

                //Get today day and add offset
                if(moment().isSame(momentObj, 'hour')) {
                    foundInitialIndex = true;
                }

                if(foundInitialIndex) {
                    hourlyData = [...hourlyData, item];
                }
            }
        }

        console.log('hourlyData', hourlyData);


        return (
            <View style={{
                flexDirection: 'row',
                // backgroundColor: 'red',
                alignContent: 'center',
                alignItems: 'center',
            }}>
                {(layoutFirstTimelineCircle) && (
                    <LinearGradient 
                        style={{
                            position: 'absolute',
                            height: ScaledValue(4),
                            top: (layoutFirstTimelineCircle?.y ?? 0) + (ScaledValue(25) / 2) - ScaledValue(3),
                            left: (layoutFirstTimelineCircle?.x ?? 0) + (ScaledValue(25) / 2),
                            width: '100%',
                        }}
                        start={{ 
                            x: 0, 
                            y: 1
                        }}
                        end={{ 
                            x: 1, 
                            y: 1
                        }}
                        colors={[
                            hexToRgba(colors.white, 1), 
                            hexToRgba(colors.white, 0.6), 
                            hexToRgba(colors.white, 0.3)
                        ]} />
                )}
                    
                {hourlyData.map((e, index) => {
                    let viewProps = {};
                    let momentObj = moment.unix(e.dt);

                    if(index === 0) {
                        viewProps = {
                            onLayout: this.onLayoutTimelineCircle
                        }
                    }

                    //Get only int value
                    const temperature = Number.parseInt(e?.temp ?? 0, 10);
                    
                    return (
                        <View 
                            key={`timeline-item[${index}]`}
                            style={{
                                // backgroundColor: 'red',
                                alignContent: 'center',
                                alignItems: 'center',
                                marginRight: ScaledValue(30)
                            }}>

                            <Text style={{
                                fontFamily: (index === 0) ? 
                                    fontFamilies.PoppinsBold : 
                                    fontFamilies.PoppinsLight,
                                fontSize: ScaledValue((index === 0) ? 18 : 12),
                                lineHeight: ScaledValue((index === 0) ? 27 : 18),
                                color: colors.white,
                                textAlign: 'center'
                            }}>{(index === 0) ? 'Now' : `${momentObj.format('h a')}`}</Text>
        
                            <View 
                                style={{
                                    width: ScaledValue((index === 0) ? 25 : 15),
                                    height: ScaledValue((index === 0) ? 25 : 15),
                                    borderRadius: ScaledValue((index === 0) ? 25 : 15)/2,
                                    backgroundColor: colors.white,
                                    marginVertical: ScaledValue(16)
                                }} 
                                {...viewProps} />
        
                            <Text style={{
                                fontFamily: (index === 0) ? 
                                    fontFamilies.PoppinsBold : 
                                    fontFamilies.PoppinsLight,
                                fontSize: ScaledValue((index === 0) ? 25 : 20),
                                lineHeight: ScaledValue((index === 0) ? 38 : 30),
                                color: colors.white,
                                textAlign: 'center'
                            }}>{`${temperature}°`}</Text>
                        </View>
                    )
                })}
                
            </View>
        );
    }

    /**
     * Render location forecast data for next 7 days
     */
    _renderForecasts() {

        const { 
            location,
        } = this.props;

        const { 
            renderLazyContent,
        } = this.state;

        if(!renderLazyContent) {
            return (
                <View style={{
                    flexDirection: 'row',
                    paddingLeft: ScaledValue(20)
                }}>
                    {Array(2).fill(0).map((_, index) => (
                        <View 
                            key={`daily-forecast-placeholder[${index}]`}
                            style={{
                                width: ScaledValue(148),
                                height: ScaledValue(232),
                                borderRadius: ScaledValue(20),
                                marginRight: ScaledValue(15),
                                overflow: 'hidden',
                            }}>

                            <Shimmer style={{
                                width: ScaledValue(148),
                                height: ScaledValue(232),
                                backgroundColor: colors.grey,
                            }}/>
                        </View>
                    ))}
                </View>
            );
        }

        const dailyData = location?.data?.daily ?? null;

        //No data to show
        if(!dailyData?.length) {
            return null;
        }

        //Parse daily data
        const parsedData = this._parseForecastData(dailyData);

        return (
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                contentContainerStyle={{
                    paddingHorizontal: ScaledValue(20),
                }}>

                {parsedData.map((dailyDataObject, index) => {

                    const { 
                        dt,
                        temp,
                        weather
                    } = dailyDataObject || {};
                    
                    //Get only int value
                    const temperature = Number.parseInt(temp?.day ?? 0, 10);
                    const momentObj = moment.unix(dt);
                    
                    return (
                        <View 
                            key={`daily-forecast[${index}]`}
                            style={{
                                backgroundColor: hexToRgba(colors.white, 0.1),
                                width: ScaledValue(148),
                                height: ScaledValue(232),
                                borderRadius: ScaledValue(20),
                                marginRight: ScaledValue(15),
                                elevation: 1
                            }}>

                            <View style={{
                                marginTop: ScaledValue(20)
                            }}>
                                <Text style={{
                                    fontFamily: fontFamilies.PoppinsSemiBold,
                                    fontSize: ScaledValue(22),
                                    lineHeight: ScaledValue(33),
                                    color: colors.white,
                                    textAlign: 'center'
                                }}>{`${momentObj.format('dddd')}`}</Text>
                            </View>
        
                            <View style={{
                                marginTop: ScaledValue(5)
                            }}>
                                <Text style={{
                                    fontFamily: fontFamilies.PoppinsSemiBold,
                                    fontSize: ScaledValue(36),
                                    lineHeight: ScaledValue(55),
                                    color: colors.white,
                                    textAlign: 'center'
                                }}>{`${temperature}°`}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                marginBottom: ScaledValue(20),
                                alignContent: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // backgroundColor: 'red'
                            }}>
                                {this._renderWeatherImage(weather?.[0] ?? null)}
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        );
    }


    render() {
		console.log(`[${this.constructor.name}] RENDERING`);

        const {
            location
        } = this.props;

        console.log('location', location);

        const currentData = location?.data?.current ?? null;
        const { 
            dt,
            temp,
            weather
        } = currentData || {};
        
        //Get only int value
        const temperature = Number.parseInt(temp ?? 0, 10);
        const momentObj = moment.unix(dt);

        return (
            <SafeAreaView 
                style={{ 
                    flex: 1,
                    backgroundColor: 'red'
                }}>

                <LinearGradient 
                    style={{
                        backgroundColor: 'transparent', 
                        ...StyleSheet.absoluteFillObject
                    }}
                    colors={this._getGradientColors()} />

                <View style={{
                    flex: 1
                }}>
                    <Header
                        style={{
                            marginTop: ScaledValue(50)
                        }}
                        renderLeftAccessory={this.renderHeaderLeftAccessory}
                        renderRightAccessory={this.renderHeaderRightAccessory}>

                        <Text style={{
                            fontFamily: fontFamilies.PoppinsSemiBold,
                            fontSize: ScaledValue(32),
                            lineHeight: ScaledValue(48),
                            color: colors.white,
                            textAlign: 'center'
                        }}>
                            {location?.name ?? ''}
                        </Text>
                    </Header>

                    <View style={{
                        flex: 1,
                    }}>
                        <Text style={{
                            fontFamily: fontFamilies.PoppinsMedium,
                            fontSize: ScaledValue(20),
                            color: colors.white,
                            textAlign: 'center'
                        }}>{`${momentObj.format('dddd D')}, ${momentObj.format('MMMM')}`}</Text>

                        <View style={{
                            marginTop: ScaledValue(20)
                        }}>
                            <Text style={{
                                fontFamily: fontFamilies.PoppinsLight,
                                fontSize: ScaledValue(20),
                                color: colors.white,
                                textAlign: 'center'
                            }}>{weather?.[0]?.main ?? ''}</Text>
                        </View>
                        
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {this._renderWeatherImage(location?.data?.current?.weather?.[0] ?? null)}

                            <View style={{
                                marginLeft: ScaledValue(42)
                            }}>
                                <Text style={{
                                    fontFamily: fontFamilies.PoppinsBold,
                                    fontSize: ScaledValue(110),
                                    lineHeight: ScaledValue(166),
                                    color: colors.white,
                                }}>{`${temperature}°`}</Text>
                            </View>
                        </View>

                        <View style={{
                            marginLeft: ScaledValue(46)
                        }}>
                            {this._renderTimeline()}
                        </View>
                        
                        <View style={{
                            marginTop: ScaledValue(40)
                        }}>
                            {this._renderForecasts()}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}


function mapStateToProps(state, ownProps) {
    const { locationId } = ownProps;
    const { locations } = state.home;

    return {
        location: locations?.find(_ => _.id === locationId) ?? null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}

const connectedComp = reduxConnect(mapStateToProps, mapDispatchToProps)(LocationDetails);
export { connectedComp as LocationDetails }