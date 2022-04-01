import axios from 'axios';
import environment from '../../_config/enviroment';
import appendQuery from 'append-query';

export const getCoordinatesByLocation = async (location) => {
    try {
        const result = await axios({
            url: appendQuery(`${environment.OPENWEATHERMAP_API_ENDPOINT}/geo/1.0/direct`, {
                q: location,
                limit: 5,
                appid: environment.OPENWEATHERMAP_API_KEY
            }),
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache'
        });

        return [result.data, null];
    }catch(error) {
        return [null, error];
    }
}

export const getLocationData = async (latitude, longitude) => {
    try {
        const result = await axios({
            url: appendQuery(`${environment.OPENWEATHERMAP_API_ENDPOINT}/data/2.5/onecall`, {
                lat: latitude,
                lon: longitude,
                units: 'metric',
                exclude: 'minutely',
                appid: environment.OPENWEATHERMAP_API_KEY
            }),
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache'
        });

        return [result.data, null];
    }catch(error) {
        return [null, error];
    }
}