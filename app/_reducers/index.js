import { combineReducers } from "redux";
import { home } from './home.reducer';

const appReducer = combineReducers({
    home,
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
}

export default rootReducer;