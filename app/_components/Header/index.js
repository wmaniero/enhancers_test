import React from 'react';
import { View } from 'react-native';
import { ScaledValue } from '../../_utils/ui';


const Header = (props) => {
    console.log('[Header] props', props);

    //Parse props overrides
    let customStyle = props?.style ?? {};

    //Defaults
    let style = [{
        flexDirection: 'row',
        height: ScaledValue(50)
        
    }, customStyle];

    const renderLeftAccessory = () => {
        if(typeof props.renderLeftAccessory === 'function') {
            return props.renderLeftAccessory();
        }
    }

    const renderRightAccessory = () => {
        if(typeof props.renderRightAccessory === 'function') {
            return props.renderRightAccessory();
        }
    }


    return (
        <View style={style}>
            <View style={{
                flex: 0.2,
                // backgroundColor: 'cyan'
            }}>
                {renderLeftAccessory()}
            </View>

            <View style={{
                flex: 1,
                // backgroundColor: 'red'
            }}>
                {props.children}
            </View>

            <View style={{
                flex: 0.2,
                // backgroundColor: 'orange'
            }}>
                {renderRightAccessory()}
            </View>
        </View>
    )
}

export { Header }