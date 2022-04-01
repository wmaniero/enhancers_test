/**
 * 
 * @param {*} url 
 * @param {*} path 
 * @returns 
 */
export const addUrlPath = (url, path) => {

    //Check if url contains query params
    let urlParts = url.split('?');
    let urlParams = urlParts?.[1] ?? null;

    if(urlParts[0].endsWith('/')) {
        urlParts[0] = urlParts[0].substring(0, urlParts[0].length - 1);
    }

    let formattedUrl = `${urlParts[0]}/${path}`;
    if(urlParams) {
        formattedUrl = `${formattedUrl}?${urlParams}`;
    }
    return formattedUrl;
}

/**
 * 
 * @param {*} string 
 * @returns 
 */
export const isJSON = (string) => {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}