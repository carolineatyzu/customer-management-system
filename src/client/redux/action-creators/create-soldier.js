import axios from 'axios';
import { CREATE_SOLDIER_START,CREATE_SOLDIER_FAIL,CREATE_SOLDIER_SUCCESS } from '../reducers/types';

const createSoldierStart = () => ({
  type: CREATE_SOLDIER_START
});

const createSoldierFail = error => ({
  type: CREATE_SOLDIER_FAIL,
  error
});

const createSoldierSuccess = () => ({
  type: CREATE_SOLDIER_SUCCESS
});

export const createSoldier = (query,avatar,history) => (dispatch) => {
  const endPoint = "http://localhost:4000/api/soldier";
  dispatch(createSoldierStart());
  return axios.post(endPoint,query)
  .then((res) => {
    const data = new FormData();
    data.append("avatar",avatar);
    if (!avatar) {
      dispatch(createSoldierSuccess());
      history.push("/");
      return;
    }
    return axios.post(`${endPoint}/avatar/${res.data.id}`,data)
    .then(() => {
      dispatch(createSoldierSuccess());
      history.push("/");
    })
    .catch(err => {
      dispatch(createSoldierFail({ message: "Updating soldier avatar failed" }));
    });
  })
  .catch(err => {
    dispatch(createSoldierFail({ message: "Creating soldier failed" }));
  });
};