import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    TOKEN_LOADED
} from "./types";

//Load Token
export const loadToken = () => async dispatch => {
    if (sessionStorage.token) {
      return dispatch({
        type: TOKEN_LOADED,
        payload: sessionStorage.getItem("token")
      });
    } else {
      dispatch({
        type: AUTH_ERROR
      });
    }
};

//ucitavanje korisnika
// export const loadUser = () => (dispatch, getState) => {
//     dispatch({ type: USER_LOADING});
//     axios.get('/api/users/user', tokenConfig(getState))
//     .then(res => dispatch({
//         type: USER_LOADED,
//         payload: res.data
//     }))
//     .catch(err => {
//         //dispatch(returnErrors(err.response.data, err.response.status));
//         dispatch({
//             type: AUTH_ERROR
//         });
//     });
// };
export const loadUser = () => async (dispatch, getStore) => {
    dispatch({ type: USER_LOADING});
    try {
      const header = makeAuthTokenHeader(getStore().auth.token);
      const res = await axios.get("/api/users/user", header);
  
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };


//registracija korisnika
export const register = ({ ime, prezime, datumRod, mail, korisnickoIme, lozinka }) => dispatch => {
    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ ime, prezime, datumRod, mail, korisnickoIme, lozinka });

    axios.post('/api/users/register', body, config)
    .then(res => dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
    }))
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
        dispatch({
            type: REGISTER_FAIL
        });
    });
}

//login korisnika
export const login = ({ korisnickoIme, lozinka }) => dispatch => {
    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ korisnickoIme, lozinka });

    axios.post('/api/users/login', body, config)
    .then(res => dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
    }))
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL
        });
    });
}


//odjava korisnika
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
}

//token
export const tokenConfig = getState => {
    //dohvati token iz  localstorage
    const token = getState().auth.token;

    //headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    ///dodaj token u headers ako postoji
    if(token){
        config.headers['x-auth-token'] = token;
    }

    return config;
}

export const makeAuthTokenHeader = token => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      return {
        headers: {
          "x-auth-token": token
        }
      };
    } else {
      throw new Error("Token nedostaje");
    }
  };