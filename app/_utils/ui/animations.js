import Animated, { 
    Value,
    Easing, 
    clockRunning,
    startClock,
    stopClock,
    set, 
    cond,
    timing,
    block,
    not,
    eq
} from 'react-native-reanimated';

function runTiming(
    clock, 
    value, 
    dest, 
    startStopClock = true, 
    overrideConfig = {}, 
    isRunning = new Value(1)
) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        frameTime: new Value(0),
        time: new Value(0),
    }
    
    const config = {
        toValue: new Value(0),
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
        ...overrideConfig
    }
    
    return [
        cond(clockRunning(clock), [
            cond(eq(isRunning, 1), [  
                set(state.position, value),
            ], [
                set(state.time, clock),
            ]),
        ], [
            set(state.finished, 0),
            set(state.frameTime, 0),
            set(state.time, 0),
            set(state.position, value),
            set(config.toValue, dest),
            startStopClock && startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, startStopClock && stopClock(clock)),
        state.position,
    ];
}

export { 
    runTiming,
}