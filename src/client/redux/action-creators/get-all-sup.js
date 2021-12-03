import axios from 'axios';
import { GET_SUP_FAIL,GET_SUP_SUCCESS,GET_SUP_START } from '../reducers/types';

const getSupStart = () => ({
  type: GET_SUP_START
});

const getSupFail = error => ({
  type: GET_SUP_FAIL,
  error
});

const getSupSuccess = list => ({
  type: GET_SUP_SUCCESS,
  list
});

export const getSup = () => (dispatch) => {
  const endPoint = "http://localhost:4000/api/soldiers?all=1";
  dispatch(getSupStart());
  return axios.get(endPoint)
  .then(res => {
    dispatch(getSupSuccess(res.data.data));
  })
  .catch((error) => {
    dispatch(getSupFail({ message: "Fetching sups error" }));
  });
}