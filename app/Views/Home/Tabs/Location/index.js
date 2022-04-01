import React, {
    forwardRef, 
    memo
} from 'react';
import { 
    View,
    Text,
} from 'react-native';

export const HomeTabs_Location = memo(forwardRef((props, ref) => {
    console.log('[HomeTabs_Location] props', props);

    return (
        <View>
            <Text>HomeTabs_Location</Text>
        </View>
    );
}));