import axios from 'axios';
import { EDIT_SOLDIER_START,EDIT_SOLDIER_FAIL,EDIT_SOLDIER_SUCCESS } from '../reducers/types';

const editSoldierStart = () => ({
  type: EDIT_SOLDIER_START
});

const editSoldierFail = error => ({
  type: EDIT_SOLDIER_FAIL,
  error
});

const editSoldierSuccess = () => ({
  type: EDIT_SOLDIER_SUCCESS
});

export const editSoldier = (query,avatar,history) => (dispatch) => {
  console.log("edit");
  const endPoint = "http://localhost:4000/api/soldier";
  const id = query._id;
  dispatch(editSoldierStart());
  return axios.put(`${endPoint}/${id}`,query)
  .then(() => {
    if (avatar) {
      const data = new FormData();
      data.append("avatar",avatar);
      return axios.post(`${endPoint}/avatar/${id}`,data)
      .then(() => {
        dispatch(editSoldierSuccess());
        history.push("/");
      })
      .catch(err => {
        dispatch(editSoldierFail({ message: "Edit soldier avatar failed" }));
      });
    } else {
      dispatch(editSoldierSuccess());
      history.push("/");
    }
  })
  .catch(() => {
    dispatch(editSoldierFail({ message: "Edit soldier failed" }));
  });
};