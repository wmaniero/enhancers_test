import React, { 
    createRef
} from 'react';
import { 
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    InteractionManager,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ScaledValue,
    fontFamilies,
    colors,
    withPreventDoublePress
} from '../../_utils/ui';
import { search } from '../../_assets/images';
import { getCoordinatesByLocation } from '../../_utils/services';
import { Navigation } from 'react-native-navigation';
import { BlurView } from '@react-native-community/blur';
import { debounce } from 'lodash/function';
import FastImage from 'react-native-fast-image';
import hexToRgba from 'hex-to-rgba';

//Wrap pressable components to avoid double press issue
const TouchableOpacityEx = withPreventDoublePress(TouchableOpacity);

class AddLocation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            location: '',
            searchResults: null,
            isSearching: false,
        }

        this.locationInputRef = createRef();
        this.onClose = this._onClose.bind(this);
        this.onLocationTextChange = debounce(this._onLocationTextChange.bind(this), 150);
    }

	componentDidMount() {
		this.navigationEventListener = Navigation.events().bindComponent(this);
	}

	componentWillUnmount() {
        this.navigationEventListener?.remove();
	}

	componentDidAppear() {
        //Focus first input field on mount
        InteractionManager.runAfterInteractions(() => {
            this.locationInputRef?.current?.focus();
        });
	}

    _onClose() {
        const { componentId } = this.props;

        Keyboard.dismiss();
        Navigation.dismissModal(componentId);
    }

    /**
     * 
     * @param {*} text 
     */
    _onLocationTextChange(text) {
        this.setState({ location: text }, () => {

            const { location } = this.state;

            if(location.trim().length < 3) {
                return;
            }

            this.setState({ isSearching: true }, async () => {
                    
                //Search location against weather geocode API
                const [
                    response, 
                    error
                ] = await getCoordinatesByLocation(location);

                console.log('[getCoordinatesByLocation] response', response);
                console.log('[getCoordinatesByLocation] error', error);

                if(error) {
                    //TODO: show alert?
                    console.warn(error);

                    this.setState({
                        isSearching: false,
                    });

                }else{

                    this.setState({
                        isSearching: false,
                        searchResults: response
                    });
                }
            })

        });
    }

    _onLocationSelected(location) {
        console.log('[_onLocationSelected] location', location);

        const { onLocationSelected } = this.props;

        //Close current view
        this._onClose();

        //Trigger callback on next tick
        if(typeof onLocationSelected === 'function') {
            setTimeout(() => onLocationSelected(location), 0);
        }
    }


    _renderSearchResults() {
        const { searchResults } = this.state;

        //No results to show
        if(!searchResults?.length) {
            return null;
        }

        return (
            <ScrollView 
                style={{
                    flex: 1
                }}
                contentContainerStyle={{
                    backgroundColor: colors.darkGrey,
                    marginTop: ScaledValue(12),
                    marginHorizontal: ScaledValue(10),
                    borderRadius: ScaledValue(12)
                }}
                keyboardShouldPersistTaps="handled">

                {searchResults.map((_, index) => {
                    
                    let description = ``;

                    if(_?.name) {
                        description += `${_.name}`;
                    }

                    if(_?.state) {
                        description += `, ${_.state}`;
                    }

                    if(_?.country) {
                        description += `, ${_.country}`;
                    }
                    
                    return ([
                        <TouchableOpacityEx 
                            key={`item[${_.lat}|${_.lon}]`}
                            style={{
                                paddingVertical: ScaledValue(15),
                                paddingHorizontal: ScaledValue(10)
                            }}
                            onPress={() => this._onLocationSelected(_)}>
                                
                            <Text style={{
                                fontFamily: fontFamilies.PoppinsMedium,
                                fontSize: ScaledValue(18),
                                lineHeight: ScaledValue(20),
                                color: colors.white,
                            }}>{description}</Text>
                        </TouchableOpacityEx>,
                        
                        (index < (searchResults.length - 1)) ? 
                            <View 
                                key={`divider[${_.lat}|${_.lon}]`}
                                style={{
                                    height: ScaledValue(1),
                                    backgroundColor: colors.white
                                }} /> : null
                    ])
                })}
                    
            </ScrollView>
        );
    }

    render() {
		console.log(`[${this.constructor.name}] RENDERING`);

        const { isSearching } = this.state;

        return (
            <SafeAreaView 
                style={{ 
                    flex: 1,
                    backgroundColor: hexToRgba(colors.white, 0.7),
                }}>

                <BlurView
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        zIndex: 1
                    }}
                    blurAmount={2} />

                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    zIndex: 2,
                }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <View style={{
                            marginTop: ScaledValue(20),
                            marginHorizontal: ScaledValue(10),
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: hexToRgba(colors.grey, 0.6),
                                paddingVertical: ScaledValue(5),
                                paddingHorizontal: ScaledValue(10),
                                alignContent: 'center',
                                alignItems: 'center',
                                borderRadius: ScaledValue(8),
                                marginRight: ScaledValue(10)
                            }}>
                                <FastImage
                                    source={search} 
                                    resizeMode="contain" 
                                    tintColor={colors.white}
                                    style={{
                                        width: ScaledValue(20),
                                        height: ScaledValue(20),
                                    }} />

                                <View style={{
                                    flex: 1,
                                    marginLeft: ScaledValue(12)
                                }}>
                                    <TextInput
                                        ref={this.locationInputRef}
                                        placeholder="Search location..."
                                        placeholderTextColor={colors.white}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoCompleteType="off"
                                        underlineColorAndroid="transparent"
                                        keyboardType="visible-password"
                                        onChangeText={this.onLocationTextChange}
                                        style={{
                                            fontFamily: fontFamilies.PoppinsMedium,
                                            fontSize: ScaledValue(18),
                                            lineHeight: ScaledValue(30),
                                            color: colors.white,
                                            padding: 0,
                                            borderWidth: 0,
                                        }} />
                                </View>
                                    
                                {(isSearching) && (
                                    <View style={{
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingLeft: ScaledValue(10)
                                    }}>
                                        <ActivityIndicator 
                                            animating={true} 
                                            size="small" 
                                            color={colors.white} />
                                    </View>
                                )}
                            </View>

                            <TouchableOpacityEx onPress={this.onClose}>
                                <Text style={{
                                    fontFamily: fontFamilies.PoppinsMedium,
                                    fontSize: ScaledValue(18),
                                    lineHeight: ScaledValue(20),
                                    color: colors.white,
                                }}>Cancel</Text>
                            </TouchableOpacityEx>
                        </View>

                        {this._renderSearchResults()}
                    </View>
                </View>

            </SafeAreaView>
        );
    }
}

export { AddLocation }