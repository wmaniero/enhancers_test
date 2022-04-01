import React, {
    forwardRef, 
    memo
} from 'react';
import { 
    View,
    Text,
} from 'react-native';

export const HomeTabs_Search = memo(forwardRef((props, ref) => {
    console.log('[HomeTabs_Search] props', props);

    return (
        <View>
            <Text>HomeTabs_Search</Text>
        </View>
    );
}));