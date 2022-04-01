
import { Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';

/**
 * Build root screen object
 * 
 * @param {*} screen 
 * @param {*} screenProps 
 * @returns 
 */
export const screenToRoot = (screen, screenProps) => {
    return {
        root: {
            stack: {
                children: [{
                    component: {
                        name: screen,
                        options: {
                            topBar: {
                                visible: false,
                            },
                        },
                        passProps: {
                            ...screenProps
                        }
                    },
                }],
            },
        },
    }
}


/**
 * Navigate to screen and set it as root
 * 
 * @param {*} screen 
 * @param {*} options 
 */
 export const pushRootScreen = (screen, options, screenProps) => {
    
    const { width } = Dimensions.get('window');

    Navigation.setRoot({
        root: {
            stack: {
                children: [{
                    component: {
                        name: screen,
                        options: {
                            // Optional options object to configure the screen
                            topBar: {
                                visible: false
                            },
                            animations: {
                                setRoot: {
                                    translationX: {
                                        from: width,
                                        to: 0,
                                        duration: 300,
                                    },
                                    // alpha: {
                                    //     from: 0,
                                    //     to: 1,
                                    //     duration: 400,
                                    // }
                                }
                            },
                            ...options,
                        },
                        passProps: {
                            ...screenProps
                        }
                    },
                }],
            },
        },
    });
}

/**
 * Navigate to screen modally
 * returns StackID of presented modal screen
 * 
 * @param {*} screen 
 * @param {*} options 
 */
export const pushModalScreen = async (screen, options, screenProps) => {

    const stackId = await Navigation.showModal({
        stack: {
            children: [{
                component: {
                    name: screen,
                    options: {
                        topBar: {
                            visible: false,
                        },
                        ...options,
                    },
                    passProps: {
                        ...screenProps
                    }
                },
            }],
        },
    });
    return stackId;
}

/**
 * Push stack screen
 * 
 * @param {*} screen 
 * @param {*} options 
 */
export const pushStackScreen = (componentId, screen, options, screenProps) => {
    
    const { width } = Dimensions.get('window');

    Navigation.push(componentId, {
        component: {
            name: screen,
            options: {
                // Optional options object to configure the screen
                topBar: {
                    visible: false,
                },
                animations: {
                    push: {
                        translationX: {
                            from: width,
                            to: 0,
                            duration: 300,
                        },
                    },
                    pop: {
                        translationX: {
                            from: 0,
                            to: width,
                            duration: 300,
                        },
                    }
                },
                ...options
            },
            passProps: {
                ...screenProps
            }
        },
    });
}

/**
 * Extend fn and add fade animation props
 * 
 * @param {*} fn 
 * @returns 
 */
export function pushStackScreenWithFade(componentId, screen, options, screenProps) {
    return pushStackScreen(componentId, screen, {
        ...options,            
        animations: {
            push: {
                content: {
                    alpha: {
                        from: 0,
                        to: 1,
                        duration: 400,
                    }
                },
            },
            pop: {
                content: {
                    alpha: {
                        from: 1,
                        to: 0,
                        duration: 400,
                    }
                }
            }
        }
    }, screenProps);
}