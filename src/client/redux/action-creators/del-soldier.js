import axios from 'axios';
import { DEL_SOLDIER_START,DEL_SOLDIER_FAIL,DEL_SOLDIER_SUCCESS } from '../reducers/types';

const delSoldierStart = () => ({
  type: DEL_SOLDIER_START
});

const delSoldierFail = error => ({
  type: DEL_SOLDIER_FAIL,
  error
});

const delSoldierSuccess = () => ({
  type: DEL_SOLDIER_SUCCESS
});

export const delSoldier = (id,callback) => (dispatch) => {
  const endPoint = "http://localhost:4000/api/soldier";
  dispatch(delSoldierStart());
  console.log('delete');
  axios.delete(`${endPoint}/${id}`)
  .then(() => {
    dispatch(delSoldierSuccess());
    callback();
  })
  .catch(() => {
    dispatch(delSoldierFail({ message: "Deleting soldier failed" }));
  });
};