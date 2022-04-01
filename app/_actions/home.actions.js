
import { 
    homeConstants,
    REQUEST,
    SUCCESS,
    FAILURE
} from '../_constants';
import * as services from '../_utils/services';

export const homeActions = {
    addLocation,
    updateLocation,
    getLocationData
}

function addLocation(payload) { 
    return { type: homeConstants.ADD_LOCATION, payload } 
}

function updateLocation(locationId, payload) { 
    return { type: homeConstants.UPDATE_LOCATION, locationId, payload } 
}

function getLocationData(latitude, longitude, successCb, failureCb) {

    return async dispatch => {
        dispatch(request());

        const [response, responseError] = await services.getLocationData(latitude, longitude);
        console.log(`[getLocationData] response`, response);
        console.log(`[getLocationData] responseError`, responseError);

        if(response && responseError === null) {
            dispatch(success(response));
            if (typeof successCb === 'function') {
                successCb(response);
            }

        }else{
            dispatch(failure(responseError));
            if (typeof failureCb === 'function') {
                failureCb(responseError);
            }
        }
    }

    function request() { 
        return { type: REQUEST(homeConstants.GET_CURRENT_WEATHER_DATA) } 
    }
    function success(payload) { 
        return { type: SUCCESS(homeConstants.GET_CURRENT_WEATHER_DATA), payload } 
    }
    function failure(error) { 
        return { type: FAILURE(homeConstants.GET_CURRENT_WEATHER_DATA), error } 
    }
}