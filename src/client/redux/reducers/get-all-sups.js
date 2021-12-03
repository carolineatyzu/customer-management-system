import { GET_SUP_FAIL,GET_SUP_SUCCESS,GET_SUP_START } from './types';

const initState = {
  state: 0,
  error: null,
  list: []
};

const getAllSup = (state = initState, action) => {
  switch(action.type) {
    case GET_SUP_START:
      return {
        ...state,
        state: 0,
        error: null,
        list: []
      };
    case GET_SUP_FAIL:
      return {
        ...state,
        state: 2,
        error: action.error,
      };
    case GET_SUP_SUCCESS:
      return {
        ...state,
        state: 1,
        error: null,
        list: action.list,
      }
    default:
      return state;
  }
};

export default getAllSup;