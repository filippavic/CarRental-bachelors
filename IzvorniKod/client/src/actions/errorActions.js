import { GET_ERRORS, CLEAR_ERRORS } from './types';

// vrati greske
export const returnErrors = (msg, status, id = null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    };
};

// ocisti greske
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};