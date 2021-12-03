import axios from 'axios';

import { FETCH_LIST_START,FETCH_LIST_FAIL,FETCH_LIST_SUCCESS_APPEND,FETCH_LIST_SUCCESS_REPLACE,UPDATE_LIST_QUERY,CLEAN_LIST_LIST } from '../reducers/types';

const fetchListStart = () => ({
  type: FETCH_LIST_START
});

const fetchListFail = error => ({
  type: FETCH_LIST_FAIL,
  error
});

const fetchListSuccessAppend = list => ({
  type: FETCH_LIST_SUCCESS_APPEND,
  list
});

const fetchListSuccessReplace = list => ({
  type: FETCH_LIST_SUCCESS_REPLACE,
  list
});

export const updateListQuery = query => ({
  type: UPDATE_LIST_QUERY,
  query
});

export const cleanSoldierList = () => ({
  type: CLEAN_LIST_LIST
});

export const fetchSoldierList = (replace=false) => (dispatch,getState) => {
  const endPoint = "http://localhost:4000/api/soldiers";
  const query = getState().soldierList.query;
  const url = Object.entries(query).reduce((a,[key,val]) => {
    return `${a}${key}=${val}&`;
  },`${endPoint}?`);
  dispatch(fetchListStart());
  return axios.get(`${url}`)
  .then(res => {
    if (replace) {
      dispatch(fetchListSuccessReplace(res.data));
    } else {
      dispatch(fetchListSuccessAppend(res.data));
    }
    return res;
  })
  .catch(() => {
    dispatch(fetchListFail({ message: "Fetching soldier list failed" }));
  });
};