import { homeConstants } from '../_constants';

const initialState = {
    loading: false,
    locations: [],
};

export function home(state = initialState, action) {
    switch (action.type) {

        case homeConstants.ADD_LOCATION:

            return {
                ...state,
                locations: [...state.locations, action.payload]
            }

        case homeConstants.UPDATE_LOCATION:

            return {
                ...state,
                locations: [...state.locations.map(_ => {
                    if(_.id === action.locationId) {
                        return ({
                            ..._,
                            ...action.payload
                        });
                    }

                    return ({
                        ..._,
                    });
                })]
            }

        default:
            return state;
    }
}