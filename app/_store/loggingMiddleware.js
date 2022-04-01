/* eslint-disable */

const loggingMiddleware = (store) => (next) => (action) => {
    if(__DEV__) {
        console.info('%cPrev State:', 'color: cyan', store.getState());
        console.log(action);
    }
    const result = next(action);

    if(__DEV__) {
        console.info('%cNext State:', 'color: cyan', store.getState());
    }
    return result;
};

export default loggingMiddleware;