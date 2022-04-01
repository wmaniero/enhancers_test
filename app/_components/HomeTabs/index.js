import React, {
    forwardRef,
    useState,
    useRef,
} from 'react';
import { 
    Text,
    View, 
    I18nManager,
    useWindowDimensions, 
    TouchableOpacity,
} from 'react-native';
import { 
    colors, 
    fontFamilies, 
    ScaledValue, 
} from '../../_utils/ui';
import { 
    HomeTabs_Home, 
    HomeTabs_Location, 
    HomeTabs_Search
} from '../../Views';
import { 
    TabView, 
    TabBar
} from 'react-native-tab-view';
import Animated, { 
    interpolate, 
    multiply
} from 'react-native-reanimated';
import { 
    home,
    search,
    location
} from '../../_assets/images';
import FastImage from 'react-native-fast-image';

const ROUTES = [{
    key: 'tab-home', 
    icon: home
}, {
    key: 'tab-search', 
    icon: search 
}, {
    key: 'tab-location', 
    icon: location
}];

/**
 * 
 * @param {*} props 
 * @returns 
 */
const HomeTabs = forwardRef((props, ref) => {
    console.log('[HomeTabs] props', props);

	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);
	const routes = useRef(ROUTES).current;

    
    const renderIndicator = (indicatorProps) => {
        const { 
            position, 
            navigationState, 
            getTabWidth
        } = indicatorProps;

        const translateX = routes.length > 1
            ? getTranslateX(position, routes, getTabWidth)
            : 0;
    
        return (
            <Animated.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: `${100 / navigationState.routes.length}%`,
                transform: [{ translateX }],
            }}>
                <Animated.View style={{
                    backgroundColor: '#01175F',
                    width: '70%',
                    height: ScaledValue(3),
                    borderRadius: ScaledValue(2),
                }} />
            </Animated.View>
        );
    }

    const getTranslateX = (position, routes, getTabWidth) => {
        const inputRange = routes.map((_, i) => i);
    
        // every index contains widths at all previous indices
        const outputRange = routes.reduce((acc, _, i) => {
            if (i === 0) return [0];
            return [...acc, acc[i - 1] + getTabWidth(i - 1)];
        }, []);
    
        const translateX = interpolate(position, {
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });
    
        return multiply(translateX, I18nManager.isRTL ? -1 : 1);
    }

    const renderTabBar = (tabBarProps) => {
        return (
            <TabBar
                {...tabBarProps}
                renderTabBarItem={renderTabBarItem}
                renderIndicator={renderIndicator}
                style={{
                    backgroundColor: '#FFFFFF',
                    marginHorizontal: ScaledValue(20),
                    marginVertical: ScaledValue(20),
                    borderRadius: ScaledValue(25),
                    zIndex: 1
                }}
                activeColor={colors.white} />
        );
    }

    const renderTabBarItem = (props) => {
        const { navigationState, onPress } = props;
        const { key, icon } = props.route;

        let isActive = false;

        if(navigationState.routes?.[navigationState?.index]?.key === key) {
            isActive = true;
        }

        const onRoutePress = (event) => {
            requestAnimationFrame(() => {
                onPress(event);
            });
        }

        return (
            <TouchableOpacity 
                key={`tab-bar-item[${key}]`}
                onPress={onRoutePress}
                disabled={isActive}
                style={[{
                    flex: 1,
                    height: ScaledValue(78),
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                }]}>
                    <FastImage
                        source={icon} 
                        resizeMode="contain" 
                        tintColor={(isActive) ? '#01175F' : '#787A94'}
                        style={{
                            width: ScaledValue(24),
                            height: ScaledValue(24),
                        }} />
            </TouchableOpacity>
        );
    }

    const renderScene = (routeProps) => {
        const { route } = routeProps;
        const { key } = route;

        switch (key) {
            case 'tab-home':
                return (
                    <HomeTabs_Home 
                        {...routeProps} 
                        {...props} />
                );

            case 'tab-search':
                return (
                    <HomeTabs_Search 
                        {...routeProps} 
                        {...props}/>
                );

            case 'tab-location':
                return (
                    <HomeTabs_Location
                        {...routeProps} 
                        {...props} />
                );

            default:
                return null;
        }
    }

	return (
        <TabView
            swipeEnabled={true}
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            tabBarPosition="bottom"
            initialLayout={{ width: layout.width }} />
	);
});

export { HomeTabs }