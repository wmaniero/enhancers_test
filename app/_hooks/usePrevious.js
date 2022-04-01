import { 
    useRef, 
    useEffect, 
} from 'react';

/**
 * 
 * @param {*} value 
 * @returns 
 */
export function usePrevious(value) {
    const ref = useRef(true);
  
    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}