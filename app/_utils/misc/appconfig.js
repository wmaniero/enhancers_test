
import AsyncStorage from '@react-native-community/async-storage';

const setAppConfig = async (payload) => {
    console.log('[setAppConfig] payload', payload);

    try {
        //Retrieve existing AppConfig data
        const [data, error] = await getAppConfig();

        //If we have existing data, create object for later
        //override
        let nextData = {};
        
        if(data && !error) {
            nextData = {
                ...data
            }
        }

        nextData = {
            ...nextData,
            ...payload
        }

        //Store updated data
        await AsyncStorage.setItem('@AppConfig', JSON.stringify(nextData));

        return [true, null];
    }catch(error) {
        return [null, error];
    }
}

const getAppConfig = async () => {
    try {
        const dataStr = await AsyncStorage.getItem('@AppConfig');
        const data = JSON.parse(dataStr);

        return [data, null];
    }catch(error) {
        return [null, error];
    }
}

const resetAppConfig = async () => {
    console.log('[resetAppConfig] Removing @AppConfig');

    try {
        //Remove AppConfig item
        await AsyncStorage.removeItem('@AppConfig');

        return [true, null];
    }catch(error) {
        return [null, error];
    }
}

export {
    setAppConfig,
    getAppConfig,
    resetAppConfig
}